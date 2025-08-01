from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import uvicorn
import os
from dotenv import load_dotenv

from .database import engine, SessionLocal
from .models import Base
from .routers import products, analysis
from .ai_analyzer import AIRiskAnalyzer

load_dotenv()

# Create database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Consumable Product Risk Analyzer",
    description="AI-powered analysis of consumable products for health and safety risks",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(products.router, prefix="/api/products", tags=["products"])
app.include_router(analysis.router, prefix="/api/analysis", tags=["analysis"])

# Serve static files (React build)
if os.path.exists("../frontend/build"):
    app.mount("/static", StaticFiles(directory="../frontend/build/static"), name="static")
    
    @app.get("/")
    async def serve_frontend():
        return FileResponse("../frontend/build/index.html")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Consumable Product Risk Analyzer API"}

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )