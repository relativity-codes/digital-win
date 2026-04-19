from fastapi import FastAPI, Request
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, RedirectResponse
from mangum import Mangum
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from openai import OpenAI

import os
from dotenv import load_dotenv
from typing import Optional, List, Dict
import json
import uuid
from datetime import datetime
from redis import Redis
from context import prompt

# Load env
load_dotenv()

# Init app
app = FastAPI()
handler = Mangum(app)

# OpenAI client (OpenRouter)
client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY"),
    base_url=os.getenv("OPENAI_BASE_URL"),
)

def safe_int(value, default):
    try:
        return int(value)
    except (ValueError, TypeError):
        return default

# Redis client
redis = Redis(
    host=os.getenv("REDIS_HOST", "localhost"),
    port=safe_int(os.getenv("REDIS_PORT"), 6379),
    db=safe_int(os.getenv("REDIS_DB"), 0),
    username=os.getenv("REDIS_USER", ""),
    password=os.getenv("REDIS_PASSWORD", ""),
    decode_responses=True
)

# CORS
origins = os.getenv("CORS_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["*"],
)


# -------------------------
# Models
# -------------------------

class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    session_id: str


# -------------------------
# Redis Memory Helpers
# -------------------------

MAX_MESSAGES = 20  # keep last N messages

def memory_key(session_id: str) -> str:
    return f"chat:{session_id}"


def load_memory(session_id: str) -> List[Dict]:
    """Load chat history from Redis."""
    key = memory_key(session_id)

    raw_messages = redis.lrange(key, 0, -1)

    # Redis stores newest at head (LPUSH), so reverse
    messages = [json.loads(m) for m in reversed(raw_messages)]
    return messages


def save_message(session_id: str, message: Dict):
    """Append message and trim memory."""
    key = memory_key(session_id)

    redis.lpush(key, json.dumps(message))
    redis.ltrim(key, 0, MAX_MESSAGES - 1)

    # optional TTL (24h session expiry)
    redis.expire(key, 60 * 60 * 24)


# -------------------------
# OpenAI Call (OpenRouter fallback)
# -------------------------

MODELS = [
    "openai/gpt-4.1-mini",
    "anthropic/claude-3.5-sonnet",
]


def call_openai(messages):
    for model in MODELS:
        try:
            response = client.chat.completions.create(
                model=model,
                messages=messages,
                temperature=0.7,
                max_tokens=1000,
            )
            return response.choices[0].message.content
        except Exception as e:
            print(f"Model {model} failed: {e}")

    return "All AI providers are currently unavailable."


# -------------------------
# Chat Endpoint
# -------------------------

@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    session_id = request.session_id or str(uuid.uuid4())

    # Load memory
    memory = load_memory(session_id)

    # Append user message (Redis)
    user_message = {
        "role": "user",
        "content": request.message
    }
    save_message(session_id, user_message)

    # Build messages for model
    system_prompt = prompt()

    messages = [
        {"role": "system", "content": system_prompt},
        *memory[-10:],  # last context window
        user_message
    ]

    # Call LLM
    ai_response = call_openai(messages)

    assistant_message = {
        "role": "assistant",
        "content": ai_response
    }

    save_message(session_id, assistant_message)

    return ChatResponse(
        response=ai_response,
        session_id=session_id
    )


# -------------------------
# Health Check
# -------------------------

@app.get("/health")
async def health():
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }


# -------------------------
# Static Frontend Serving
# -------------------------

@app.get("/{full_path:path}")
async def serve_frontend(full_path: str):
    # Construct the path to the file in the static directory
    static_file_path = os.path.join("static", full_path)
    
    # 1. If it's a file that exists, serve it (e.g., /_next/static/...)
    if os.path.isfile(static_file_path):
        return FileResponse(static_file_path)
    
    # 2. Otherwise, serve index.html for root or SPA routing
    index_path = os.path.join("static", "index.html")
    if os.path.exists(index_path):
        return FileResponse(index_path)
    
    return {"message": "Digital Twin API is running. Frontend static files not found."}


# -------------------------
# Run locally
# -------------------------

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("server:app", host="0.0.0.0", port=8000, reload=True)