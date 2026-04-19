
# Week 2 Digital Twin Project (Unified Edition)

This is a production-ready AI-powered Digital Twin project, unified into a single deployment using **Zappa** and **FastAPI**.

## Project Structure

```
week2-twin/
├── backend/              # Unified FastAPI server & Static Hosting
│   ├── server.py        # Main FastAPI server (serves API & Frontend)
│   ├── zappa_settings.json # Zappa deployment configuration
│   ├── context.py       # AI context and personality
│   ├── resources.py     # Data loading utilities
│   ├── static/          # Exported Frontend files (built in CI)
│   ├── data/           # Personal data files
│   │   ├── facts.json
│   │   ├── summary.txt
│   │   └── style.txt
│   ├── requirements.txt
│   └── .env
├── frontend/            # Next.js Static Frontend
│   ├── app/
│   │   ├── page.tsx    # Chat interface
│   │   └── layout.tsx
│   ├── next.config.js  # Configured for static export
│   ├── package.json
│   └── tailwind.config.js
└── .github/             # Automated CI/CD
    └── workflows/
        └── deploy.yml  # Unified GitHub Actions workflow
```

## Features

- **Unified Deployment**: Both Frontend and Backend are hosted on a single AWS Lambda function via Zappa.
- **AI Digital Twin**: Conversational AI powered by **AWS Bedrock (Amazon Nova)**.
- **Automated CI/CD**: Fully automated build and deployment with GitHub Actions.
- **Secret Injection**: Securely injects environment variables from GitHub Secrets during deployment.
- **Simplified Networking**: No more CORS or complex URL management; everything runs on one base URL.

## Setup & Local Development

### 1. Backend Setup
```bash
cd backend
pip install -r requirements.txt
```
Config variables in `backend/.env`:
- `OPENAI_API_KEY`: Your OpenRouter/OpenAI API key.
- `BEDROCK_MODEL_ID`: Default is `global.amazon.nova-2-lite-v1:0`.

### 2. Frontend Setup
```bash
cd frontend
npm install
```

### 3. Running Locally
For the best development experience, run them separately:
- **Backend:** `cd backend && python server.py` (Runs on port 8000)
- **Frontend:** `cd frontend && npm run dev` (Runs on port 3000)

## Deployment (AWS Zappa)

This project has been simplified to use **Zappa** for all infrastructure. Terraform is no longer required.

### CI/CD Workflow
The updated GitHub Actions workflow handles the following:
1. **Frontend Build**: Generates a static export of the Next.js app.
2. **Consolidation**: Moves the static files into the `backend/static` folder.
3. **Secret Injection**: Injects all `TF_VAR_*` GitHub Secrets into the production environment.
4. **Zappa Update**: Deploys the unified package to AWS Lambda and API Gateway.

### Required GitHub Secrets
Ensure the following are set in your repository:
- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `TF_VAR_OPENAI_API_KEY`
- `TF_VAR_REDIS_HOST` (etc.)

## Customization

1. **Digital Persona**: Edit `backend/data/facts.json`, `summary.txt`, and `style.txt`.
2. **AI Logic**: Modify prompts in `backend/context.py`.
3. **UI/UX**: Customize the chat interface in `frontend/app/page.tsx`.

## Security Notes

- **Secrets**: Use GitHub Secrets for all sensitive keys. The CI pipeline will automatically map them.
- **S3 Bucket**: Ensure your deployment bucket defined in `zappa_settings.json` exists.
- **VPC**: If connecting to a private Redis, ensure Zappa is configured for VPC access.
