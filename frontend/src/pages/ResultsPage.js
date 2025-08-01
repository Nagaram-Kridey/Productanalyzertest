import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  LinearProgress,
  Chip,
  List,
  ListItem,
  ListItemText,
  Alert,
  Button,
  useTheme,
  alpha,
  CircularProgress,
} from '@mui/material';
import {
  Warning,
  CheckCircle,
  Error,
  Info,
  Share,
  Download,
  Analytics,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const ResultsPage = () => {
  const { sessionId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: analysisData, isLoading, error } = useQuery(
    ['analysis', sessionId],
    async () => {
      const response = await axios.get(`/api/analysis/session/${sessionId}`);
      return response.data;
    },
    {
      enabled: !!sessionId,
    }
  );

  const getRiskColor = (level) => {
    switch (level) {
      case 'LOW':
        return theme.palette.success.main;
      case 'MEDIUM':
        return theme.palette.warning.main;
      case 'HIGH':
        return theme.palette.error.main;
      case 'CRITICAL':
        return theme.palette.error.dark;
      default:
        return theme.palette.grey[500];
    }
  };

  const getRiskIcon = (level) => {
    switch (level) {
      case 'LOW':
        return <CheckCircle />;
      case 'MEDIUM':
        return <Info />;
      case 'HIGH':
        return <Warning />;
      case 'CRITICAL':
        return <Error />;
      default:
        return <Info />;
    }
  };

  const RiskMeter = ({ score, level, label }) => (
    <Card
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
        borderRadius: 2,
        p: 2,
        textAlign: 'center',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 1 }}>
        {getRiskIcon(level)}
        <Typography variant="h6" sx={{ color: 'white', ml: 1 }}>
          {label}
        </Typography>
      </Box>
      
      <Box sx={{ position: 'relative', display: 'inline-flex', mb: 2 }}>
        <CircularProgress
          variant="determinate"
          value={score}
          size={80}
          thickness={4}
          sx={{
            color: getRiskColor(level),
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            {Math.round(score)}
          </Typography>
        </Box>
      </Box>
      
      <Chip
        label={level}
        size="small"
        sx={{
          backgroundColor: getRiskColor(level),
          color: 'white',
          fontWeight: 600,
        }}
      />
    </Card>
  );

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
          Loading analysis results...
        </Typography>
      </Box>
    );
  }

  if (error || !analysisData) {
    return (
      <Box sx={{ textAlign: 'center', py: 8 }}>
        <Error sx={{ fontSize: 80, color: theme.palette.error.main, mb: 2 }} />
        <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
          Analysis Not Found
        </Typography>
        <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8), mb: 4 }}>
          The analysis results could not be loaded. This might be due to an invalid session ID or expired results.
        </Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/analyze')}
          sx={{
            background: theme.palette.primary.main,
            color: 'white',
            '&:hover': {
              background: theme.palette.primary.dark,
            },
          }}
        >
          Start New Analysis
        </Button>
      </Box>
    );
  }

  const { analysis, product } = analysisData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h2"
          component="h1"
          sx={{
            color: 'white',
            textAlign: 'center',
            mb: 2,
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.3)',
          }}
        >
          Analysis Results
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            color: alpha(theme.palette.common.white, 0.9),
            textAlign: 'center',
            mb: 4,
          }}
        >
          {product?.name || 'Product Analysis'}
        </Typography>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', mb: 4 }}>
          <Button
            startIcon={<Analytics />}
            onClick={() => navigate('/analyze')}
            sx={{ color: 'white', borderColor: 'white' }}
            variant="outlined"
          >
            New Analysis
          </Button>
          <Button
            startIcon={<Share />}
            sx={{ color: 'white', borderColor: 'white' }}
            variant="outlined"
          >
            Share Results
          </Button>
          <Button
            startIcon={<Download />}
            sx={{ color: 'white', borderColor: 'white' }}
            variant="outlined"
          >
            Download Report
          </Button>
        </Box>
      </Box>

      {/* Overall Risk Score */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          borderRadius: 3,
          p: 3,
          mb: 4,
          textAlign: 'center',
        }}
      >
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          Overall Risk Assessment
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 3 }}>
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              variant="determinate"
              value={analysis.overall_risk_score}
              size={120}
              thickness={6}
              sx={{
                color: getRiskColor(analysis.risk_level),
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                },
              }}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                {Math.round(analysis.overall_risk_score)}
              </Typography>
              <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                Risk Score
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2, mb: 2 }}>
          {getRiskIcon(analysis.risk_level)}
          <Chip
            label={`${analysis.risk_level} RISK`}
            size="large"
            sx={{
              backgroundColor: getRiskColor(analysis.risk_level),
              color: 'white',
              fontWeight: 600,
              fontSize: '1rem',
              px: 2,
              py: 1,
            }}
          />
        </Box>

        <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.9) }}>
          Confidence: {Math.round(analysis.confidence_score)}%
        </Typography>
      </Card>

      {/* Risk Categories */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={4}>
          <RiskMeter
            score={analysis.allergen_risk?.score || 0}
            level={analysis.allergen_risk?.severity || 'LOW'}
            label="Allergen Risk"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RiskMeter
            score={analysis.nutritional_risk?.score || 0}
            level={analysis.nutritional_risk?.severity || 'LOW'}
            label="Nutritional Risk"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RiskMeter
            score={analysis.additive_risk?.score || 0}
            level={analysis.additive_risk?.severity || 'LOW'}
            label="Additive Risk"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RiskMeter
            score={analysis.contamination_risk?.score || 0}
            level={analysis.contamination_risk?.severity || 'LOW'}
            label="Contamination Risk"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <RiskMeter
            score={analysis.interaction_risk?.score || 0}
            level={analysis.interaction_risk?.severity || 'LOW'}
            label="Interaction Risk"
          />
        </Grid>
      </Grid>

      {/* Detailed Results */}
      <Grid container spacing={3}>
        {/* Safety Warnings */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 3,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                <Warning sx={{ mr: 1, verticalAlign: 'middle' }} />
                Safety Warnings
              </Typography>
              {analysis.safety_warnings?.length > 0 ? (
                <List>
                  {analysis.safety_warnings.map((warning, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={warning}
                        primaryTypographyProps={{
                          color: 'white',
                          fontSize: '0.9rem',
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                  No safety warnings identified.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* AI Summary */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 3,
              height: '100%',
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                <Analytics sx={{ mr: 1, verticalAlign: 'middle' }} />
                AI Analysis Summary
              </Typography>
              <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), lineHeight: 1.6 }}>
                {analysis.ai_summary || 'AI analysis summary not available.'}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Identified Allergens */}
        {analysis.identified_allergens?.length > 0 && (
          <Grid item xs={12} md={6}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                  Identified Allergens
                </Typography>
                <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                  {analysis.identified_allergens.map((allergen, index) => (
                    <Chip
                      key={index}
                      label={allergen}
                      size="small"
                      sx={{
                        backgroundColor: theme.palette.warning.main,
                        color: 'white',
                        fontWeight: 500,
                      }}
                    />
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        )}

        {/* AI Recommendations */}
        <Grid item xs={12} md={6}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 3,
            }}
          >
            <CardContent>
              <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
                <CheckCircle sx={{ mr: 1, verticalAlign: 'middle' }} />
                Recommendations
              </Typography>
              {analysis.ai_recommendations?.length > 0 ? (
                <List>
                  {analysis.ai_recommendations.map((recommendation, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemText
                        primary={`• ${recommendation}`}
                        primaryTypographyProps={{
                          color: alpha(theme.palette.common.white, 0.9),
                          fontSize: '0.9rem',
                          lineHeight: 1.5,
                        }}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                  No specific recommendations available.
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Information */}
      <Alert
        severity="info"
        sx={{
          mt: 4,
          background: 'rgba(33, 150, 243, 0.1)',
          color: 'white',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            color: theme.palette.info.light,
          },
        }}
      >
        <Typography variant="body2">
          This analysis is based on AI evaluation of the provided ingredients and nutritional information. 
          Always consult with healthcare professionals for personalized dietary advice, especially if you have 
          specific health conditions or severe allergies.
        </Typography>
      </Alert>
    </motion.div>
  );
};

export default ResultsPage;