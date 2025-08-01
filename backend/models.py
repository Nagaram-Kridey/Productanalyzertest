from sqlalchemy import Column, Integer, String, Text, DateTime, Float, JSON, Boolean
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Product(Base):
    __tablename__ = "products"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    brand = Column(String(255))
    category = Column(String(100))
    ingredients = Column(Text)
    nutrition_facts = Column(JSON)
    barcode = Column(String(50))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class RiskAnalysis(Base):
    __tablename__ = "risk_analyses"
    
    id = Column(Integer, primary_key=True, index=True)
    product_id = Column(Integer, nullable=False)
    overall_risk_score = Column(Float)  # 0-100 scale
    risk_level = Column(String(20))  # LOW, MEDIUM, HIGH, CRITICAL
    
    # Risk categories
    allergen_risk = Column(Float)
    nutritional_risk = Column(Float)
    additive_risk = Column(Float)
    contamination_risk = Column(Float)
    interaction_risk = Column(Float)
    
    # Analysis details
    identified_allergens = Column(JSON)
    harmful_additives = Column(JSON)
    nutritional_concerns = Column(JSON)
    safety_warnings = Column(JSON)
    
    # AI analysis
    ai_summary = Column(Text)
    ai_recommendations = Column(JSON)
    confidence_score = Column(Float)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    analyzer_version = Column(String(50))

class UserSubmission(Base):
    __tablename__ = "user_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(100))
    product_name = Column(String(255))
    product_description = Column(Text)
    ingredients_text = Column(Text)
    image_path = Column(String(500))
    analysis_id = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)