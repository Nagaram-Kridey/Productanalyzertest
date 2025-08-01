import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Button,
  useTheme,
  alpha,
  Divider,
} from '@mui/material';
import {
  Science,
  Psychology,
  Security,
  Analytics,
  HealthAndSafety,
  Warning,
  CheckCircle,
  Code,
  GitHub,
  Email,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const AboutPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Analysis',
      description: 'Advanced machine learning algorithms analyze product ingredients using OpenAI GPT-4 and Anthropic Claude for comprehensive risk assessment.',
    },
    {
      icon: <Security />,
      title: 'Multi-Dimensional Risk Assessment',
      description: 'Evaluates allergens, harmful additives, nutritional content, contamination risks, and drug interactions across multiple categories.',
    },
    {
      icon: <HealthAndSafety />,
      title: 'Personalized Health Profiles',
      description: 'Customized analysis based on individual allergies, dietary restrictions, medical conditions, and health preferences.',
    },
    {
      icon: <Analytics />,
      title: 'Comprehensive Reporting',
      description: 'Detailed reports with risk scores, confidence levels, safety warnings, and actionable recommendations.',
    },
  ];

  const riskCategories = [
    {
      title: 'Allergen Risk',
      description: 'Identifies known allergens and potential cross-contamination risks based on ingredient analysis.',
      icon: <Warning />,
    },
    {
      title: 'Nutritional Risk',
      description: 'Evaluates high sodium, sugar, trans fats, and other nutritional concerns that may impact health.',
      icon: <HealthAndSafety />,
    },
    {
      title: 'Additive Risk',
      description: 'Detects potentially harmful preservatives, artificial colors, and chemical additives.',
      icon: <Science />,
    },
    {
      title: 'Contamination Risk',
      description: 'Assesses bacterial, chemical, and physical contamination risks based on product category.',
      icon: <Security />,
    },
    {
      title: 'Interaction Risk',
      description: 'Identifies potential interactions with medications and supplements.',
      icon: <Psychology />,
    },
  ];

  const teamMembers = [
    {
      name: 'AI Analysis Engine',
      role: 'Core risk assessment powered by OpenAI and Anthropic',
      description: 'Advanced language models provide intelligent analysis of product ingredients and health implications.',
    },
    {
      name: 'Safety Database',
      role: 'Comprehensive ingredient and allergen database',
      description: 'Extensive knowledge base of food additives, allergens, and safety thresholds.',
    },
    {
      name: 'User Interface',
      role: 'Modern, responsive web application',
      description: 'Beautiful React-based interface with glassmorphism design and smooth animations.',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
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
        About Product Analyzer
      </Typography>

      <Typography
        variant="h5"
        sx={{
          color: alpha(theme.palette.common.white, 0.9),
          textAlign: 'center',
          mb: 6,
          maxWidth: 800,
          mx: 'auto',
          lineHeight: 1.6,
        }}
      >
        AI-powered consumable product safety analysis for informed health decisions
      </Typography>

      {/* Mission Statement */}
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
        <Science sx={{ fontSize: 60, color: 'white', mb: 2 }} />
        <Typography variant="h4" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.9), fontSize: '1.1rem', lineHeight: 1.8 }}>
          We believe everyone deserves access to clear, accurate information about the products they consume. 
          Our AI-powered platform democratizes food safety analysis, making it easy for consumers to understand 
          potential health risks and make informed decisions about their dietary choices.
        </Typography>
      </Card>

      {/* Key Features */}
      <Typography
        variant="h3"
        sx={{
          color: 'white',
          textAlign: 'center',
          mb: 4,
          fontWeight: 600,
        }}
      >
        Key Features
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  borderRadius: 3,
                  height: '100%',
                  p: 3,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    background: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 60,
                      height: 60,
                      borderRadius: '50%',
                      background: alpha(theme.palette.primary.main, 0.2),
                      color: 'white',
                      mr: 2,
                    }}
                  >
                    {feature.icon}
                  </Box>
                  <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                    {feature.title}
                  </Typography>
                </Box>
                <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), lineHeight: 1.6 }}>
                  {feature.description}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Risk Analysis Categories */}
      <Typography
        variant="h3"
        sx={{
          color: 'white',
          textAlign: 'center',
          mb: 4,
          fontWeight: 600,
        }}
      >
        Analysis Categories
      </Typography>

      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          borderRadius: 3,
          p: 3,
          mb: 6,
        }}
      >
        <List>
          {riskCategories.map((category, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  mb: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ListItemIcon sx={{ minWidth: 56 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      background: alpha(theme.palette.secondary.main, 0.2),
                      color: 'white',
                    }}
                  >
                    {category.icon}
                  </Box>
                </ListItemIcon>
                <ListItemText
                  primary={
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                      {category.title}
                    </Typography>
                  }
                  secondary={
                    <Typography sx={{ color: alpha(theme.palette.common.white, 0.8), mt: 1 }}>
                      {category.description}
                    </Typography>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </Card>

      {/* Technology Stack */}
      <Typography
        variant="h3"
        sx={{
          color: 'white',
          textAlign: 'center',
          mb: 4,
          fontWeight: 600,
        }}
      >
        Technology
      </Typography>

      <Grid container spacing={4} sx={{ mb: 6 }}>
        {teamMembers.map((member, index) => (
          <Grid item xs={12} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  backdropFilter: 'blur(20px)',
                  border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                  borderRadius: 3,
                  p: 3,
                  textAlign: 'center',
                  height: '100%',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <Code sx={{ fontSize: 50, color: 'white', mb: 2 }} />
                <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.7), mb: 2 }}>
                  {member.role}
                </Typography>
                <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), lineHeight: 1.6 }}>
                  {member.description}
                </Typography>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {/* Safety Disclaimer */}
      <Card
        sx={{
          background: 'rgba(255, 193, 7, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.warning.main, 0.3)}`,
          borderRadius: 3,
          p: 3,
          mb: 4,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', mb: 2 }}>
          <Warning sx={{ color: theme.palette.warning.main, mr: 2, mt: 0.5 }} />
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
            Important Disclaimer
          </Typography>
        </Box>
        <Typography sx={{ color: alpha(theme.palette.common.white, 0.9), lineHeight: 1.6 }}>
          This tool provides AI-generated analysis for informational purposes only and should not replace 
          professional medical advice. Always consult with healthcare professionals for personalized dietary 
          recommendations, especially if you have severe allergies, medical conditions, or specific health concerns. 
          The analysis is based on ingredient information provided and may not account for all potential risks or 
          individual sensitivities.
        </Typography>
      </Card>

      {/* Contact & Support */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          borderRadius: 3,
          p: 3,
          textAlign: 'center',
        }}
      >
        <Typography variant="h5" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
          Get Started Today
        </Typography>
        <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.9), mb: 3 }}>
          Ready to analyze your products? Start making informed decisions about your consumables today.
        </Typography>
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/analyze')}
            startIcon={<Analytics />}
            sx={{
              background: theme.palette.primary.main,
              color: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                background: theme.palette.primary.dark,
              },
            }}
          >
            Start Analysis
          </Button>
          <Button
            variant="outlined"
            size="large"
            startIcon={<GitHub />}
            sx={{
              color: 'white',
              borderColor: 'white',
              fontSize: '1.1rem',
              fontWeight: 600,
              px: 3,
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              '&:hover': {
                borderColor: theme.palette.primary.main,
                background: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            View on GitHub
          </Button>
        </Box>
      </Card>
    </motion.div>
  );
};

export default AboutPage;