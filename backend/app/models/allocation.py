import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Integer, JSON, DateTime
from app.core.database import Base

class AllocationRun(Base):
    __tablename__ = "allocation_runs"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    run_date = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    total_candidates_considered = Column(Integer, default=0)
    total_internships_available = Column(Integer, default=0)
    total_allocated = Column(Integer, default=0)
    fairness_metrics = Column(JSON, default=dict) # e.g. state_distribution, average_score
    status = Column(String, default="COMPLETED") # COMPLETED, FAILED
