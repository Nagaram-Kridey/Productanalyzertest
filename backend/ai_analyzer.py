import os
import json
import re
from typing import Dict, List, Tuple, Optional
import openai
from anthropic import Anthropic
import asyncio
from dataclasses import dataclass

@dataclass
class IngredientAnalysis:
    name: str
    risk_level: str
    concerns: List[str]
    allergen_info: Optional[str] = None

class AIRiskAnalyzer:
    def __init__(self):
        self.openai_client = openai.OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.anthropic_client = Anthropic(api_key=os.getenv("ANTHROPIC_API_KEY"))
        
        # Known risk databases
        self.allergen_database = {
            "milk", "eggs", "fish", "shellfish", "tree nuts", "peanuts", 
            "wheat", "soybeans", "sesame", "lactose", "gluten", "casein"
        }
        
        self.harmful_additives = {
            "monosodium glutamate": "May cause headaches and nausea in sensitive individuals",
            "sodium nitrate": "Potential carcinogen, linked to cancer risk",
            "high fructose corn syrup": "Linked to obesity and diabetes",
            "trans fat": "Increases heart disease risk",
            "aspartame": "May cause headaches in sensitive individuals",
            "red dye 40": "Potential behavioral issues in children",
            "bht": "Potential carcinogen",
            "bha": "Potential carcinogen",
            "sodium benzoate": "May form benzene when combined with vitamin C"
        }
        
        self.nutrition_thresholds = {
            "sodium": {"high": 600, "very_high": 1400},  # mg per serving
            "sugar": {"high": 15, "very_high": 25},      # g per serving
            "saturated_fat": {"high": 5, "very_high": 10}, # g per serving
            "trans_fat": {"any": 0.5}                    # g per serving
        }

    async def analyze_product(self, product_data: Dict, health_profile: Optional[Dict] = None) -> Dict:
        """
        Comprehensive AI-powered product risk analysis
        """
        try:
            # Parse ingredients
            ingredients = self._parse_ingredients(product_data.get("ingredients", ""))
            
            # Run parallel analysis
            tasks = [
                self._analyze_allergens(ingredients, health_profile),
                self._analyze_additives(ingredients),
                self._analyze_nutrition(product_data.get("nutrition_facts", {})),
                self._ai_comprehensive_analysis(product_data, health_profile),
                self._analyze_contamination_risk(product_data),
                self._analyze_drug_interactions(ingredients, health_profile)
            ]
            
            allergen_analysis, additive_analysis, nutrition_analysis, ai_analysis, contamination_analysis, interaction_analysis = await asyncio.gather(*tasks)
            
            # Calculate overall risk score
            overall_score = self._calculate_overall_risk(
                allergen_analysis, additive_analysis, nutrition_analysis, 
                contamination_analysis, interaction_analysis
            )
            
            # Determine risk level
            risk_level = self._determine_risk_level(overall_score)
            
            return {
                "overall_risk_score": overall_score,
                "risk_level": risk_level,
                "confidence_score": ai_analysis.get("confidence", 85),
                "allergen_risk": allergen_analysis,
                "nutritional_risk": nutrition_analysis,
                "additive_risk": additive_analysis,
                "contamination_risk": contamination_analysis,
                "interaction_risk": interaction_analysis,
                "identified_allergens": allergen_analysis.get("allergens", []),
                "harmful_additives": additive_analysis.get("harmful", []),
                "nutritional_concerns": nutrition_analysis.get("concerns", []),
                "safety_warnings": self._generate_safety_warnings(allergen_analysis, additive_analysis, nutrition_analysis),
                "ai_summary": ai_analysis.get("summary", ""),
                "ai_recommendations": ai_analysis.get("recommendations", [])
            }
            
        except Exception as e:
            print(f"Error in product analysis: {e}")
            return self._get_error_response()

    def _parse_ingredients(self, ingredients_text: str) -> List[str]:
        """Parse ingredients from text"""
        if not ingredients_text:
            return []
        
        # Remove common prefixes and clean up
        ingredients_text = re.sub(r'^ingredients?:?\s*', '', ingredients_text.lower())
        
        # Split by commas and clean
        ingredients = [ing.strip() for ing in ingredients_text.split(',')]
        ingredients = [ing for ing in ingredients if ing and len(ing) > 1]
        
        return ingredients

    async def _analyze_allergens(self, ingredients: List[str], health_profile: Optional[Dict]) -> Dict:
        """Analyze potential allergens"""
        identified_allergens = []
        risk_details = []
        
        for ingredient in ingredients:
            for allergen in self.allergen_database:
                if allergen.lower() in ingredient.lower():
                    identified_allergens.append(allergen)
                    
                    # Check against user's allergies
                    if health_profile and allergen in health_profile.get("allergies", []):
                        risk_details.append(f"CRITICAL: Contains {allergen} - matches your allergy profile")
                    else:
                        risk_details.append(f"Contains {allergen}")
        
        # Calculate risk score
        base_score = len(identified_allergens) * 15
        personal_risk_multiplier = 3 if health_profile and any(
            allergen in health_profile.get("allergies", []) for allergen in identified_allergens
        ) else 1
        
        score = min(base_score * personal_risk_multiplier, 100)
        severity = "CRITICAL" if score > 80 else "HIGH" if score > 50 else "MEDIUM" if score > 20 else "LOW"
        
        return {
            "score": score,
            "details": risk_details,
            "severity": severity,
            "allergens": identified_allergens
        }

    async def _analyze_additives(self, ingredients: List[str]) -> Dict:
        """Analyze harmful additives"""
        harmful_found = []
        risk_details = []
        
        for ingredient in ingredients:
            for additive, concern in self.harmful_additives.items():
                if additive.lower() in ingredient.lower():
                    harmful_found.append({"name": additive, "concern": concern})
                    risk_details.append(f"Contains {additive}: {concern}")
        
        score = len(harmful_found) * 20
        severity = "HIGH" if score > 60 else "MEDIUM" if score > 30 else "LOW"
        
        return {
            "score": min(score, 100),
            "details": risk_details,
            "severity": severity,
            "harmful": harmful_found
        }

    async def _analyze_nutrition(self, nutrition_facts: Dict) -> Dict:
        """Analyze nutritional risks"""
        concerns = []
        risk_details = []
        score = 0
        
        if not nutrition_facts:
            return {"score": 20, "details": ["Nutrition information not available"], "severity": "MEDIUM", "concerns": []}
        
        # Analyze sodium
        sodium = nutrition_facts.get("sodium_mg", 0)
        if sodium > self.nutrition_thresholds["sodium"]["very_high"]:
            concerns.append({"type": "sodium", "level": "very_high", "value": sodium})
            risk_details.append(f"Very high sodium content: {sodium}mg")
            score += 25
        elif sodium > self.nutrition_thresholds["sodium"]["high"]:
            concerns.append({"type": "sodium", "level": "high", "value": sodium})
            risk_details.append(f"High sodium content: {sodium}mg")
            score += 15
        
        # Analyze sugar
        sugar = nutrition_facts.get("sugar_g", 0)
        if sugar > self.nutrition_thresholds["sugar"]["very_high"]:
            concerns.append({"type": "sugar", "level": "very_high", "value": sugar})
            risk_details.append(f"Very high sugar content: {sugar}g")
            score += 20
        elif sugar > self.nutrition_thresholds["sugar"]["high"]:
            concerns.append({"type": "sugar", "level": "high", "value": sugar})
            risk_details.append(f"High sugar content: {sugar}g")
            score += 10
        
        # Analyze trans fat
        trans_fat = nutrition_facts.get("trans_fat_g", 0)
        if trans_fat > self.nutrition_thresholds["trans_fat"]["any"]:
            concerns.append({"type": "trans_fat", "level": "any", "value": trans_fat})
            risk_details.append(f"Contains trans fat: {trans_fat}g")
            score += 30
        
        severity = "HIGH" if score > 50 else "MEDIUM" if score > 25 else "LOW"
        
        return {
            "score": min(score, 100),
            "details": risk_details,
            "severity": severity,
            "concerns": concerns
        }

    async def _ai_comprehensive_analysis(self, product_data: Dict, health_profile: Optional[Dict]) -> Dict:
        """Use AI for comprehensive analysis"""
        try:
            prompt = f"""
            Analyze this consumable product for health and safety risks:
            
            Product: {product_data.get('product_name', 'Unknown')}
            Ingredients: {product_data.get('ingredients', 'Not provided')}
            Nutrition: {json.dumps(product_data.get('nutrition_facts', {}), indent=2)}
            Category: {product_data.get('category', 'Unknown')}
            
            User Health Profile: {json.dumps(health_profile or {}, indent=2)}
            
            Provide a comprehensive analysis including:
            1. Overall safety assessment
            2. Specific health concerns
            3. Personalized recommendations based on health profile
            4. Long-term consumption risks
            5. Interactions with common medications
            
            Format your response as JSON with keys: summary, recommendations, confidence, concerns
            """
            
            response = await self._call_ai_service(prompt)
            
            if response:
                return response
            else:
                return self._get_default_ai_response()
                
        except Exception as e:
            print(f"AI analysis error: {e}")
            return self._get_default_ai_response()

    async def _call_ai_service(self, prompt: str) -> Optional[Dict]:
        """Call AI service (OpenAI or Anthropic)"""
        try:
            # Try OpenAI first
            if os.getenv("OPENAI_API_KEY"):
                response = self.openai_client.chat.completions.create(
                    model="gpt-4",
                    messages=[
                        {"role": "system", "content": "You are a food safety and nutrition expert. Provide accurate, evidence-based analysis."},
                        {"role": "user", "content": prompt}
                    ],
                    temperature=0.3
                )
                
                content = response.choices[0].message.content
                # Try to parse as JSON
                try:
                    return json.loads(content)
                except:
                    return {"summary": content, "recommendations": [], "confidence": 80, "concerns": []}
            
            # Fallback to Anthropic
            elif os.getenv("ANTHROPIC_API_KEY"):
                response = self.anthropic_client.messages.create(
                    model="claude-3-sonnet-20240229",
                    max_tokens=1000,
                    messages=[{"role": "user", "content": prompt}]
                )
                
                content = response.content[0].text
                try:
                    return json.loads(content)
                except:
                    return {"summary": content, "recommendations": [], "confidence": 80, "concerns": []}
                    
        except Exception as e:
            print(f"AI service error: {e}")
            return None

    async def _analyze_contamination_risk(self, product_data: Dict) -> Dict:
        """Analyze contamination risks"""
        risk_factors = []
        score = 0
        
        category = product_data.get("category", "").lower()
        
        # High-risk categories
        if any(cat in category for cat in ["seafood", "meat", "dairy", "eggs"]):
            risk_factors.append("High-risk category for bacterial contamination")
            score += 20
        
        if "raw" in category or "unpasteurized" in product_data.get("ingredients", "").lower():
            risk_factors.append("Raw/unpasteurized product - higher contamination risk")
            score += 30
        
        # Check for recall-prone ingredients
        ingredients = product_data.get("ingredients", "").lower()
        if any(ingredient in ingredients for ingredient in ["spinach", "lettuce", "sprouts"]):
            risk_factors.append("Contains ingredients with history of contamination issues")
            score += 15
        
        severity = "HIGH" if score > 40 else "MEDIUM" if score > 20 else "LOW"
        
        return {
            "score": min(score, 100),
            "details": risk_factors or ["Low contamination risk"],
            "severity": severity
        }

    async def _analyze_drug_interactions(self, ingredients: List[str], health_profile: Optional[Dict]) -> Dict:
        """Analyze potential drug interactions"""
        interactions = []
        score = 0
        
        if not health_profile or not health_profile.get("medical_conditions"):
            return {"score": 0, "details": ["No medical conditions specified"], "severity": "LOW"}
        
        # Common interaction-prone ingredients
        interaction_ingredients = {
            "grapefruit": "Can interfere with many medications",
            "caffeine": "Can interact with stimulants and blood thinners",
            "alcohol": "Can interact with many medications",
            "vitamin k": "Can interfere with blood thinners",
            "tyramine": "Can interact with MAO inhibitors"
        }
        
        for ingredient in ingredients:
            for interaction_ingredient, warning in interaction_ingredients.items():
                if interaction_ingredient in ingredient.lower():
                    interactions.append(f"{interaction_ingredient}: {warning}")
                    score += 25
        
        severity = "HIGH" if score > 50 else "MEDIUM" if score > 25 else "LOW"
        
        return {
            "score": min(score, 100),
            "details": interactions or ["No known drug interactions"],
            "severity": severity
        }

    def _calculate_overall_risk(self, allergen_analysis: Dict, additive_analysis: Dict, 
                              nutrition_analysis: Dict, contamination_analysis: Dict, 
                              interaction_analysis: Dict) -> float:
        """Calculate weighted overall risk score"""
        weights = {
            "allergen": 0.3,
            "additive": 0.25,
            "nutrition": 0.2,
            "contamination": 0.15,
            "interaction": 0.1
        }
        
        overall_score = (
            allergen_analysis["score"] * weights["allergen"] +
            additive_analysis["score"] * weights["additive"] +
            nutrition_analysis["score"] * weights["nutrition"] +
            contamination_analysis["score"] * weights["contamination"] +
            interaction_analysis["score"] * weights["interaction"]
        )
        
        return round(overall_score, 1)

    def _determine_risk_level(self, score: float) -> str:
        """Determine risk level based on score"""
        if score >= 80:
            return "CRITICAL"
        elif score >= 60:
            return "HIGH"
        elif score >= 30:
            return "MEDIUM"
        else:
            return "LOW"

    def _generate_safety_warnings(self, allergen_analysis: Dict, additive_analysis: Dict, 
                                nutrition_analysis: Dict) -> List[str]:
        """Generate safety warnings"""
        warnings = []
        
        if allergen_analysis["severity"] in ["HIGH", "CRITICAL"]:
            warnings.append("⚠️ Contains known allergens - check ingredient list carefully")
        
        if additive_analysis["severity"] == "HIGH":
            warnings.append("⚠️ Contains potentially harmful additives")
        
        if nutrition_analysis["severity"] == "HIGH":
            warnings.append("⚠️ High in sodium, sugar, or unhealthy fats")
        
        if not warnings:
            warnings.append("✅ No major safety concerns identified")
        
        return warnings

    def _get_default_ai_response(self) -> Dict:
        """Default AI response when service is unavailable"""
        return {
            "summary": "AI analysis unavailable - basic rule-based analysis completed",
            "recommendations": ["Consult healthcare provider for personalized advice"],
            "confidence": 60,
            "concerns": []
        }

    def _get_error_response(self) -> Dict:
        """Error response"""
        return {
            "overall_risk_score": 50,
            "risk_level": "MEDIUM",
            "confidence_score": 30,
            "allergen_risk": {"score": 0, "details": ["Analysis failed"], "severity": "LOW"},
            "nutritional_risk": {"score": 0, "details": ["Analysis failed"], "severity": "LOW"},
            "additive_risk": {"score": 0, "details": ["Analysis failed"], "severity": "LOW"},
            "contamination_risk": {"score": 0, "details": ["Analysis failed"], "severity": "LOW"},
            "interaction_risk": {"score": 0, "details": ["Analysis failed"], "severity": "LOW"},
            "identified_allergens": [],
            "harmful_additives": [],
            "nutritional_concerns": [],
            "safety_warnings": ["Analysis error - please try again"],
            "ai_summary": "Analysis could not be completed due to technical error",
            "ai_recommendations": ["Please try again or consult a healthcare professional"]
        }