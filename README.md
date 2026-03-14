# AI-Assisted Journal System

A full-stack journaling platform that analyzes user emotions using a HuggingFace NLP model and provides mood insights over time.

## Tech Stack

Frontend
- Next.js
- Tailwind CSS
- Recharts

Backend
- FastAPI
- SQLAlchemy
- PostgreSQL (Production) / SQLite (Local)
- HuggingFace Hub (InferenceClient)

## Features

- Journal entry system
- AI emotion analysis
- Mood insights dashboard
- Persistent storage

## Setup Instructions

### Backend
```sh
cd backend
pip install -r requirements.txt
# Development
uvicorn main:app --reload

# Production
gunicorn -k uvicorn.workers.UvicornWorker main:app
```

### Frontend
```sh
npm install
npm run dev
```
