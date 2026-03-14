from sqlalchemy import Column, String, Text, DateTime
import datetime
from .database import Base
from pydantic import BaseModel

class DBJournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, index=True)
    ambience = Column(String)
    text = Column(Text)
    emotion = Column(String)
    date = Column(DateTime, default=datetime.datetime.utcnow)

class JournalEntryCreate(BaseModel):
    userId: str
    ambience: str
    text: str
    emotion: str

class JournalEntryResponse(BaseModel):
    id: str
    userId: str
    ambience: str
    text: str
    emotion: str
    date: str
