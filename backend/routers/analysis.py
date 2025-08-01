from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks
from sqlalchemy.orm import Session
from typing import Optional
import uuid
from datetime import datetime

from ..database import get_db
from ..models import RiskAnalysis, UserSubmission, Product
from ..schemas import ProductAnalysisRequest, RiskAnalysisResponse, HealthProfile, AnalysisHistory
from ..ai_analyzer import AIRiskAnalyzer

router = APIRouter()
ai_analyzer = AIRiskAnalyzer()

@router.post("/analyze", response_model=dict)
async def analyze_product(
    request: ProductAnalysisRequest,
    health_profile: Optional[HealthProfile] = None,
    background_tasks: BackgroundTasks = BackgroundTasks(),
    db: Session = Depends(get_db)
):
    """
    Analyze a consumable product for health and safety risks
    """
    try:
        # Generate session ID for tracking
        session_id = str(uuid.uuid4())
        
        # Prepare product data for analysis
        product_data = {
            "product_name": request.product_name,
            "ingredients": request.ingredients,
            "nutrition_facts": request.nutrition_facts or {},
            "category": request.category or "Unknown",
            "product_description": request.product_description or ""
        }
        
        # Convert health profile to dict if provided
        health_profile_dict = health_profile.dict() if health_profile else None
        
        # Run AI analysis
        analysis_result = await ai_analyzer.analyze_product(product_data, health_profile_dict)
        
        # Save to database in background
        background_tasks.add_task(
            save_analysis_to_db,
            db, product_data, analysis_result, session_id
        )
        
        return {
            "status": "success",
            "session_id": session_id,
            "analysis": analysis_result
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")

@router.get("/history", response_model=list[AnalysisHistory])
async def get_analysis_history(
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Get recent analysis history
    """
    try:
        analyses = db.query(RiskAnalysis).order_by(RiskAnalysis.created_at.desc()).limit(limit).all()
        
        history = []
        for analysis in analyses:
            # Get product name from user submission or use generic name
            submission = db.query(UserSubmission).filter(
                UserSubmission.analysis_id == analysis.id
            ).first()
            
            product_name = submission.product_name if submission else "Unknown Product"
            
            history.append(AnalysisHistory(
                id=analysis.id,
                product_name=product_name,
                risk_level=analysis.risk_level,
                overall_risk_score=analysis.overall_risk_score,
                created_at=analysis.created_at
            ))
        
        return history
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve history: {str(e)}")

@router.get("/analysis/{analysis_id}")
async def get_analysis_details(
    analysis_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed analysis results by ID
    """
    try:
        analysis = db.query(RiskAnalysis).filter(RiskAnalysis.id == analysis_id).first()
        
        if not analysis:
            raise HTTPException(status_code=404, detail="Analysis not found")
        
        # Get associated user submission
        submission = db.query(UserSubmission).filter(
            UserSubmission.analysis_id == analysis_id
        ).first()
        
        return {
            "analysis": {
                "id": analysis.id,
                "overall_risk_score": analysis.overall_risk_score,
                "risk_level": analysis.risk_level,
                "confidence_score": analysis.confidence_score,
                "allergen_risk": {
                    "score": analysis.allergen_risk,
                    "allergens": analysis.identified_allergens
                },
                "nutritional_risk": analysis.nutritional_risk,
                "additive_risk": analysis.additive_risk,
                "contamination_risk": analysis.contamination_risk,
                "interaction_risk": analysis.interaction_risk,
                "identified_allergens": analysis.identified_allergens,
                "harmful_additives": analysis.harmful_additives,
                "nutritional_concerns": analysis.nutritional_concerns,
                "safety_warnings": analysis.safety_warnings,
                "ai_summary": analysis.ai_summary,
                "ai_recommendations": analysis.ai_recommendations,
                "created_at": analysis.created_at
            },
            "product": {
                "name": submission.product_name if submission else "Unknown",
                "description": submission.product_description if submission else "",
                "ingredients": submission.ingredients_text if submission else ""
            }
        }
        
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to retrieve analysis: {str(e)}")

@router.post("/quick-check")
async def quick_ingredient_check(
    ingredients: str,
    allergens: Optional[list[str]] = None
):
    """
    Quick check for specific allergens in ingredients list
    """
    try:
        analyzer = AIRiskAnalyzer()
        
        # Parse ingredients
        ingredient_list = analyzer._parse_ingredients(ingredients)
        
        # Check for allergens
        health_profile = {"allergies": allergens} if allergens else None
        allergen_analysis = await analyzer._analyze_allergens(ingredient_list, health_profile)
        
        return {
            "status": "success",
            "ingredients_found": ingredient_list,
            "allergen_warnings": allergen_analysis["details"],
            "risk_level": allergen_analysis["severity"],
            "identified_allergens": allergen_analysis.get("allergens", [])
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Quick check failed: {str(e)}")

def save_analysis_to_db(db: Session, product_data: dict, analysis_result: dict, session_id: str):
    """
    Save analysis results to database (background task)
    """
    try:
        # Create product record
        product = Product(
            name=product_data["product_name"],
            category=product_data.get("category"),
            ingredients=product_data["ingredients"],
            nutrition_facts=product_data.get("nutrition_facts")
        )
        db.add(product)
        db.flush()  # Get the ID
        
        # Create risk analysis record
        risk_analysis = RiskAnalysis(
            product_id=product.id,
            overall_risk_score=analysis_result.get("overall_risk_score", 0),
            risk_level=analysis_result.get("risk_level", "UNKNOWN"),
            allergen_risk=analysis_result.get("allergen_risk", {}).get("score", 0),
            nutritional_risk=analysis_result.get("nutritional_risk", {}).get("score", 0),
            additive_risk=analysis_result.get("additive_risk", {}).get("score", 0),
            contamination_risk=analysis_result.get("contamination_risk", {}).get("score", 0),
            interaction_risk=analysis_result.get("interaction_risk", {}).get("score", 0),
            identified_allergens=analysis_result.get("identified_allergens", []),
            harmful_additives=analysis_result.get("harmful_additives", []),
            nutritional_concerns=analysis_result.get("nutritional_concerns", []),
            safety_warnings=analysis_result.get("safety_warnings", []),
            ai_summary=analysis_result.get("ai_summary", ""),
            ai_recommendations=analysis_result.get("ai_recommendations", []),
            confidence_score=analysis_result.get("confidence_score", 0),
            analyzer_version="1.0.0"
        )
        db.add(risk_analysis)
        db.flush()
        
        # Create user submission record
        user_submission = UserSubmission(
            session_id=session_id,
            product_name=product_data["product_name"],
            product_description=product_data.get("product_description", ""),
            ingredients_text=product_data["ingredients"],
            analysis_id=risk_analysis.id
        )
        db.add(user_submission)
        
        db.commit()
        
    except Exception as e:
        db.rollback()
        print(f"Failed to save analysis to database: {e}")

@router.get("/stats")
async def get_analysis_stats(db: Session = Depends(get_db)):
    """
    Get analysis statistics
    """
    try:
        total_analyses = db.query(RiskAnalysis).count()
        
        # Count by risk level
        risk_level_counts = {}
        for level in ["LOW", "MEDIUM", "HIGH", "CRITICAL"]:
            count = db.query(RiskAnalysis).filter(RiskAnalysis.risk_level == level).count()
            risk_level_counts[level.lower()] = count
        
        # Average risk score
        avg_risk_score = db.query(RiskAnalysis).with_entities(
            db.func.avg(RiskAnalysis.overall_risk_score)
        ).scalar() or 0
        
        return {
            "total_analyses": total_analyses,
            "risk_distribution": risk_level_counts,
            "average_risk_score": round(float(avg_risk_score), 1),
            "last_updated": datetime.utcnow().isoformat()
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to get stats: {str(e)}")