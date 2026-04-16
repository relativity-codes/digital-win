# Week 2 Digital Twin Project

This is a complete Week 2 production project featuring an AI-powered Digital Twin chatbot.

## Project Structure

```
week2-twin/
├── backend/              # FastAPI backend with AWS Bedrock
│   ├── server.py        # Main FastAPI server
│   ├── context.py       # AI context and personality
│   ├── resources.py     # Data loading utilities
│   ├── data/           # Personal data files
│   │   ├── facts.json
│   │   ├── summary.txt
│   │   └── style.txt
│   ├── requirements.txt
│   └── .env
├── frontend/            # Next.js App Router frontend
│   ├── app/
│   │   ├── page.tsx    # Chat interface
│   │   ├── layout.tsx
│   │   ├── api/chat/   # API proxy route
│   │   └── components/
│   ├── styles/
│   ├── package.json
│   └── tailwind.config.js
└── memory/             # Conversation memory storage
```

## Features

- **AI Digital Twin**: Conversational AI that represents a person
- **Memory Management**: Persistent conversation history
- **AWS Bedrock Integration**: Uses Amazon Nova models
- **Modern UI**: Beautiful chat interface with Tailwind CSS
- **Production Ready**: Configured for deployment

## Setup

### Backend Setup

1. Install Python dependencies:

   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. Configure environment variables in `backend/.env`:
   - Set your AWS credentials
   - Configure Bedrock model ID
   - Set CORS origins

3. Add your personal data:
   - Update `data/facts.json` with your information
   - Edit `data/summary.txt` and `data/style.txt`
   - Add your LinkedIn PDF as `data/linkedin.pdf`

### Frontend Setup

1. Install Node.js dependencies:

   ```bash
   cd frontend
   npm install
   ```

2. Configure backend URL in `frontend/.env.local`:

   ```
   BACKEND_URL=http://localhost:8000
   ```

## Running Locally

1. Start the backend:

   ```bash
   cd backend
   python server.py
   ```

2. Start the frontend:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open <http://localhost:3000>

## Deployment

### Backend (AWS Lambda)

The backend is configured for AWS Lambda deployment with:

- Mangum for Lambda integration
- S3 for memory storage (when configured)
- API Gateway for REST API

### Frontend (Vercel)

The frontend deploys to Vercel with:

- Next.js App Router
- API routes that proxy to the backend
- Environment variables for backend URL

## AWS Configuration

### Required IAM Permissions

- AmazonBedrockFullAccess
- CloudWatchFullAccess
- AmazonAPIGatewayAdministrator
- AmazonS3FullAccess
- AWSLambda_FullAccess

### Bedrock Models

Uses `global.amazon.nova-2-lite-v1:0` by default. Update in `.env` if needed.

## Customization

1. **Personality**: Edit `backend/me.txt` and data files
2. **UI Styling**: Modify `frontend/app/page.tsx` and Tailwind classes
3. **AI Behavior**: Update prompts in `backend/context.py`

## Security Notes

- Never commit `.env` files
- Use IAM roles with minimal permissions
- Configure CORS properly for production
- Validate all inputs and outputs
# digital-win
