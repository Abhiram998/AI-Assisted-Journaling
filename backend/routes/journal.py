from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import List, Any
import uuid
import datetime

from database import get_db
from models import DBJournalEntry, JournalEntryCreate

import os
import requests

HF_TOKEN = os.getenv("HF_TOKEN")
HF_MODEL_URL = "https://api-inference.huggingface.co/models/j-hartmann/emotion-english-distilroberta-base"

class AnalyzeRequest(BaseModel):
    text: str

class AnalyzeResponse(BaseModel):
    emotion: str
    keywords: List[str]
    summary: str

def map_hf_emotion_to_app(hf_label: str) -> str:
    mapping = {
        "joy": "Happy",
        "sadness": "Sad",
        "anger": "Stressed",
        "fear": "Stressed",
        "disgust": "Sad",
        "surprise": "Stressed", # surprise can be ambiguous, set to stressed for app demo
        "neutral": "Calm"
    }
    return mapping.get(hf_label.lower(), "Calm")

@router.post("/analyze", response_model=AnalyzeResponse)
def analyze_journal(request: AnalyzeRequest):
    text = request.text
    if not text.strip():
        return {"emotion": "Calm", "keywords": [], "summary": "No text provided."}

    # Truncate text to avoid model length errors
    truncated_text = text[:512]
    
    try:
        if HF_TOKEN:
            headers = {"Authorization": f"Bearer {HF_TOKEN}"}
            payload = {"inputs": truncated_text}
            
            response = requests.post(HF_MODEL_URL, headers=headers, json=payload, timeout=20)
            
            if response.status_code == 200:
                results = response.json()
                # Check for list nested results
                if isinstance(results, list) and len(results) > 0:
                    # Some HF models return [[{"label": "...", "score": ...}]]
                    inner = results[0]
                    if isinstance(inner, list) and len(inner) > 0:
                        hf_label = inner[0]["label"]
                    else:
                        hf_label = inner["label"]
                    app_emotion = map_hf_emotion_to_app(hf_label)
                else:
                    app_emotion = "Calm"
            else:
                print(f"HF API Error: {response.status_code} - {response.text}")
                app_emotion = "Calm"
        else:
            print("HF_TOKEN not found, skipping analysis")
            app_emotion = "Calm"
    except Exception as e:
        print(f"Error calling HF Inference API: {e}")
        app_emotion = "Calm"

    # Simple keyword extraction (words > 5 chars for demo)
    words = [w.strip('.,?!”"\'') for w in text.split()]
    keywords = list(set([w.lower() for w in words if len(w) > 5]))[:3]
    if not keywords:
        keywords = ["reflection", "thought", "journal"]

    summaries = {
        "Happy": "Your entry reflects a positive state of mind.",
        "Sad": "Your writing suggests you may be going through a reflective or melancholic period.",
        "Stressed": "Your entry indicates elevated stress levels.",
        "Calm": "Your thoughts appear balanced and peaceful."
    }

    return {
        "emotion": app_emotion,
        "keywords": keywords,
        "summary": summaries.get(app_emotion, "Analysis complete.")
    }

@router.post("")
def create_journal(entry: JournalEntryCreate, db: Session = Depends(get_db)):
    from fastapi.responses import JSONResponse
    try:
        db_entry = DBJournalEntry(
            id=str(uuid.uuid4()),
            userId=entry.userId,
            ambience=entry.ambience,
            text=entry.text,
            emotion=entry.emotion,
            date=datetime.datetime.utcnow()
        )
        db.add(db_entry)
        db.commit()
        db.refresh(db_entry)
        return {"message": "Success", "id": db_entry.id}
    except Exception as e:
        db.rollback()
        print(f"Database error: {e}")
        return JSONResponse(status_code=500, content={
            "error": "Database write failed",
            "details": "Could not insert journal entry"
        })

@router.get("/{userId}")
def get_user_journals(userId: str, db: Session = Depends(get_db)):
    entries = db.query(DBJournalEntry).filter(DBJournalEntry.userId == userId).order_by(DBJournalEntry.date.desc()).all()
    res = []
    for e in entries:
        preview = e.text[:100] + "..." if len(e.text) > 100 else e.text
        res.append({
            "id": e.id,
            "date": e.date.strftime("%b %d, %Y"),
            "preview": preview,
            "emotion": e.emotion
        })
    return res

@router.get("/insights/{userId}")
def get_user_insights(userId: str, db: Session = Depends(get_db)):
    from sqlalchemy import func
    
    total = db.query(func.count(DBJournalEntry.id)).filter(DBJournalEntry.userId == userId).scalar() or 0

    if total == 0:
        return {
            "totalEntries": 0,
            "topEmotion": "N/A",
            "mostUsedAmbience": "N/A",
            "recentKeywords": [],
            "moodData": [],
            "emotionDistribution": [],
            "topAmbiences": []
        }

    # Group by emotion
    emotion_counts = db.query(
        DBJournalEntry.emotion, 
        func.count(DBJournalEntry.id).label('count')
    ).filter(DBJournalEntry.userId == userId).group_by(DBJournalEntry.emotion).all()
    
    top_emotion = max(emotion_counts, key=lambda x: x[1])[0] if emotion_counts else "N/A"

    # Group by ambience
    ambience_counts = db.query(
        DBJournalEntry.ambience, 
        func.count(DBJournalEntry.id).label('count')
    ).filter(DBJournalEntry.userId == userId).group_by(DBJournalEntry.ambience).all()
    
    top_ambience = max(ambience_counts, key=lambda x: x[1])[0] if ambience_counts else "N/A"

    colors = {
        "Calm": "var(--color-chart-1)",
        "Happy": "var(--color-chart-2)",
        "Stressed": "var(--color-chart-3)",
        "Sad": "var(--color-chart-4)",
    }

    emotionDist = []
    for emo, count in emotion_counts:
        emotionDist.append({
            "name": emo,
            "value": round((count / total) * 100),
            "fill": colors.get(emo, "var(--color-chart-1)")
        })

    # Sort ambiences by count descending
    sorted_ambiences = sorted(ambience_counts, key=lambda x: -x[1])[:3]
    topAmbiences = []
    for amb, count in sorted_ambiences:
        topAmbiences.append({"name": amb.title(), "count": count})

    # Mock chart config structure using numeric mood scores
    mood_score = {"Happy": 8, "Calm": 7, "Stressed": 4, "Sad": 3}
    recent_entries = db.query(DBJournalEntry).filter(DBJournalEntry.userId == userId).order_by(DBJournalEntry.date.asc()).limit(7).all()
    
    moodData = []
    for e in recent_entries:
        moodData.append({
            "day": e.date.strftime("%a"),
            "mood": mood_score.get(e.emotion, 5)
        })

    return {
        "totalEntries": total,
        "topEmotion": top_emotion,
        "mostUsedAmbience": top_ambience.title() if top_ambience != "N/A" else "N/A",
        "recentKeywords": [],
        "moodData": moodData,
        "emotionDistribution": emotionDist,
        "topAmbiences": topAmbiences
    }
