# 🧪 Consumable Product Risk Analyzer

A comprehensive AI-powered web application that analyzes consumable products for health and safety risks. The system provides detailed risk assessments including allergen detection, harmful additive identification, nutritional analysis, contamination risk evaluation, and drug interaction warnings.

## 🌟 Features

### 🤖 AI-Powered Analysis
- **Advanced Risk Assessment**: Multi-dimensional analysis using OpenAI GPT-4 or Anthropic Claude
- **Allergen Detection**: Comprehensive allergen identification and cross-contamination warnings
- **Additive Analysis**: Detection of potentially harmful food additives and preservatives
- **Nutritional Risk Assessment**: Analysis of sodium, sugar, trans fats, and other nutritional concerns
- **Contamination Risk Evaluation**: Assessment based on product category and historical data
- **Drug Interaction Warnings**: Identification of potential medication interactions

### 👤 Personalized Health Profiles
- **Custom Allergy Tracking**: Personal allergen management and warnings
- **Dietary Restrictions**: Support for various dietary needs and restrictions
- **Medical Conditions**: Consideration of existing health conditions in risk assessment
- **Personalized Recommendations**: Tailored advice based on individual health profiles

### 📊 Comprehensive Reporting
- **Risk Scoring**: 0-100 risk scores with confidence levels
- **Detailed Breakdowns**: Category-specific risk analysis
- **Safety Warnings**: Critical alerts for high-risk products
- **AI Insights**: Natural language summaries and recommendations
- **Analysis History**: Track and compare previous analyses

### 🎨 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Glassmorphism UI**: Beautiful, modern interface with blur effects
- **Real-time Analysis**: Instant feedback and progress indicators
- **Interactive Forms**: User-friendly product input with validation
- **Animated Components**: Smooth animations and transitions

## 🏗️ Architecture

### Backend (FastAPI)
- **FastAPI Framework**: Modern, fast web framework for building APIs
- **SQLAlchemy ORM**: Database management with SQLite/PostgreSQL support
- **Pydantic Models**: Data validation and serialization
- **AI Integration**: OpenAI and Anthropic API integration
- **Background Tasks**: Async processing for analysis results
- **RESTful API**: Clean, documented API endpoints

### Frontend (React)
- **React 18**: Modern React with hooks and functional components
- **Material-UI (MUI)**: Professional component library
- **React Router**: Client-side routing
- **React Query**: Data fetching and caching
- **React Hook Form**: Form management with validation
- **Framer Motion**: Smooth animations and transitions
- **Styled Components**: CSS-in-JS styling

### Database
- **SQLite**: Default lightweight database (development)
- **PostgreSQL**: Production database option
- **Migration Support**: Database schema versioning

## 🚀 Quick Start

### Prerequisites
- Python 3.11+
- Node.js 18+
- OpenAI API key OR Anthropic API key (at least one required)

### Option 1: Docker Deployment (Recommended)

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd consumable-product-analyzer
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your API keys
   ```

3. **Build and run with Docker Compose**
   ```bash
   docker-compose up --build
   ```

4. **Access the application**
   - Open http://localhost:8000 in your browser

### Option 2: Local Development

1. **Clone and setup backend**
   ```bash
   git clone <repository-url>
   cd consumable-product-analyzer
   
   # Install Python dependencies
   pip install -r requirements.txt
   
   # Configure environment
   cp .env.example .env
   # Edit .env with your API keys
   
   # Run backend
   cd backend
   python -m uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

2. **Setup frontend (in a new terminal)**
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the project root:

```env
# Database Configuration
DATABASE_URL=sqlite:///./product_analyzer.db

# AI Service API Keys (at least one required)
OPENAI_API_KEY=your_openai_api_key_here
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Application Configuration
DEBUG=False
SECRET_KEY=your_secret_key_here
```

### API Keys Setup

1. **OpenAI API Key**
   - Visit https://platform.openai.com/api-keys
   - Create a new API key
   - Add to `.env` as `OPENAI_API_KEY`

2. **Anthropic API Key**
   - Visit https://console.anthropic.com/
   - Create a new API key
   - Add to `.env` as `ANTHROPIC_API_KEY`

## 📖 Usage Guide

### 1. Product Analysis

1. **Navigate to Analyze Page**
   - Click "Analyze" in the navigation menu

2. **Enter Product Information**
   - **Product Name**: Name of the consumable product
   - **Category**: Select appropriate category (optional)
   - **Ingredients**: List ingredients separated by commas
   - **Description**: Additional product details (optional)

3. **Add Nutrition Facts (Optional)**
   - Expand "Nutrition Facts" section
   - Enter values for calories, sodium, sugar, fats, etc.

4. **Configure Health Profile (Optional)**
   - Expand "Health Profile" section
   - Add allergies, dietary restrictions, medical conditions
   - Use preset allergen chips or add custom ones

5. **Run Analysis**
   - Click "Analyze Product"
   - Wait for AI processing (typically 5-15 seconds)

### 2. Understanding Results

#### Risk Levels
- **LOW (0-29)**: Minimal safety concerns
- **MEDIUM (30-59)**: Moderate risks, caution advised
- **HIGH (60-79)**: Significant risks, careful consideration needed
- **CRITICAL (80-100)**: Serious risks, avoid if possible

#### Analysis Categories
- **Allergen Risk**: Known allergens and cross-contamination risks
- **Nutritional Risk**: High sodium, sugar, unhealthy fats
- **Additive Risk**: Potentially harmful preservatives and additives
- **Contamination Risk**: Bacterial, chemical, or physical contamination
- **Interaction Risk**: Potential drug or supplement interactions

### 3. Health Profile Management

#### Adding Allergies
1. Use preset allergen chips for common allergies
2. Add custom allergies using the text input
3. Remove allergies by clicking the X on selected chips

#### Personal Recommendations
The AI provides personalized advice based on:
- Your specific allergies and restrictions
- Medical conditions
- Age group and pregnancy status
- Previous analysis history

## 🔌 API Documentation

### Core Endpoints

#### POST `/api/analysis/analyze`
Analyze a product for health and safety risks.

**Request Body:**
```json
{
  "product_name": "Chocolate Chip Cookies",
  "ingredients": "flour, sugar, chocolate chips, butter, eggs",
  "category": "Snacks",
  "nutrition_facts": {
    "calories": 150,
    "sodium_mg": 120,
    "sugar_g": 8
  }
}
```

**Response:**
```json
{
  "status": "success",
  "session_id": "uuid-string",
  "analysis": {
    "overall_risk_score": 45.2,
    "risk_level": "MEDIUM",
    "confidence_score": 87.5,
    "allergen_risk": {...},
    "nutritional_risk": {...},
    "ai_summary": "...",
    "ai_recommendations": [...]
  }
}
```

#### GET `/api/analysis/history`
Retrieve analysis history.

#### GET `/api/analysis/stats`
Get analysis statistics and trends.

#### POST `/api/analysis/quick-check`
Quick allergen check for ingredient lists.

### Full API Documentation
Visit http://localhost:8000/docs for interactive API documentation.

## 🛠️ Development

### Project Structure
```
consumable-product-analyzer/
├── backend/
│   ├── main.py              # FastAPI application
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── ai_analyzer.py       # AI risk analysis engine
│   └── routers/
│       ├── analysis.py      # Analysis endpoints
│       └── products.py      # Product management
├── frontend/
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── App.js           # Main application
│   │   └── index.js         # Entry point
│   └── package.json
├── requirements.txt         # Python dependencies
├── Dockerfile              # Container configuration
├── docker-compose.yml     # Multi-service setup
└── README.md              # This file
```

### Adding New Risk Categories

1. **Update AI Analyzer**
   ```python
   # In backend/ai_analyzer.py
   async def _analyze_new_category(self, product_data):
       # Implement new analysis logic
       pass
   ```

2. **Update Database Models**
   ```python
   # In backend/models.py
   class RiskAnalysis(Base):
       new_risk_category = Column(Float)
   ```

3. **Update Frontend Components**
   ```javascript
   // Add new risk category to results display
   ```

### Running Tests

```bash
# Backend tests
cd backend
python -m pytest tests/

# Frontend tests
cd frontend
npm test
```

## 🚀 Deployment

### Production Deployment with Docker

1. **Setup production environment**
   ```bash
   # Use PostgreSQL for production
   echo "DATABASE_URL=postgresql://user:pass@localhost:5432/analyzer" >> .env
   ```

2. **Deploy with Docker Compose**
   ```bash
   docker-compose -f docker-compose.prod.yml up -d
   ```

### Cloud Deployment Options

#### AWS ECS/Fargate
- Use provided Dockerfile
- Configure RDS for PostgreSQL
- Set up Application Load Balancer

#### Google Cloud Run
- Build and push to Container Registry
- Deploy with Cloud SQL PostgreSQL
- Configure custom domain

#### Azure Container Instances
- Push to Azure Container Registry
- Use Azure Database for PostgreSQL
- Configure Application Gateway

### Environment Configuration

**Production Environment Variables:**
```env
DATABASE_URL=postgresql://user:pass@db:5432/analyzer
OPENAI_API_KEY=your_production_key
ANTHROPIC_API_KEY=your_production_key
DEBUG=False
SECRET_KEY=your_secure_secret_key
```

## 🔒 Security Considerations

- **API Key Protection**: Store API keys securely, never commit to version control
- **Input Validation**: All inputs are validated using Pydantic schemas
- **SQL Injection Prevention**: SQLAlchemy ORM provides protection
- **Rate Limiting**: Consider implementing rate limiting for API endpoints
- **HTTPS**: Use HTTPS in production environments
- **User Data**: No personal data is stored without explicit consent

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow PEP 8 for Python code
- Use ESLint/Prettier for JavaScript formatting
- Write unit tests for new features
- Update documentation for API changes
- Use conventional commit messages

## 📜 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

### Common Issues

**Q: Analysis is taking too long**
A: Check your internet connection and API key validity. The AI analysis typically takes 5-15 seconds.

**Q: Getting "Analysis failed" error**
A: Ensure you have valid OpenAI or Anthropic API keys configured in your `.env` file.

**Q: Database connection issues**
A: Check your DATABASE_URL in the `.env` file. For SQLite, ensure the directory is writable.

### Getting Help

- 📧 Email: support@example.com
- 💬 Discord: [Community Server](https://discord.gg/example)
- 🐛 Issues: [GitHub Issues](https://github.com/example/issues)
- 📖 Documentation: [Wiki](https://github.com/example/wiki)

## 🙏 Acknowledgments

- OpenAI for GPT-4 API
- Anthropic for Claude API
- Material-UI for React components
- FastAPI for the excellent web framework
- The open-source community for various libraries and tools

---

Built with ❤️ for food safety and consumer health.