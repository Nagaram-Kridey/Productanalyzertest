from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any
from datetime import datetime

class ProductBase(BaseModel):
    name: str
    brand: Optional[str] = None
    category: Optional[str] = None
    ingredients: Optional[str] = None
    nutrition_facts: Optional[Dict[str, Any]] = None
    barcode: Optional[str] = None

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        orm_mode = True

class ProductAnalysisRequest(BaseModel):
    product_name: str
    ingredients: str
    nutrition_facts: Optional[Dict[str, Any]] = None
    product_description: Optional[str] = None
    category: Optional[str] = None

class RiskCategory(BaseModel):
    score: float = Field(..., ge=0, le=100)
    details: List[str] = []
    severity: str = Field(..., regex="^(LOW|MEDIUM|HIGH|CRITICAL)$")

class RiskAnalysisResponse(BaseModel):
    overall_risk_score: float = Field(..., ge=0, le=100)
    risk_level: str = Field(..., regex="^(LOW|MEDIUM|HIGH|CRITICAL)$")
    confidence_score: float = Field(..., ge=0, le=100)
    
    # Risk categories
    allergen_risk: RiskCategory
    nutritional_risk: RiskCategory
    additive_risk: RiskCategory
    contamination_risk: RiskCategory
    interaction_risk: RiskCategory
    
    # Detailed analysis
    identified_allergens: List[str]
    harmful_additives: List[Dict[str, str]]
    nutritional_concerns: List[Dict[str, str]]
    safety_warnings: List[str]
    
    # AI insights
    ai_summary: str
    ai_recommendations: List[str]
    
    analysis_id: int
    created_at: datetime

class AnalysisHistory(BaseModel):
    id: int
    product_name: str
    risk_level: str
    overall_risk_score: float
    created_at: datetime
    
    class Config:
        orm_mode = True

class HealthProfile(BaseModel):
    allergies: List[str] = []
    dietary_restrictions: List[str] = []
    medical_conditions: List[str] = []
    age_group: Optional[str] = None
    pregnancy_status: Optional[bool] = None