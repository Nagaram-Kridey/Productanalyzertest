import React from 'react';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Container,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Security,
  Psychology,
  Speed,
  HealthAndSafety,
  Analytics,
  Warning,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const features = [
    {
      icon: <Psychology />,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI algorithms analyze ingredients for potential health risks and safety concerns.',
    },
    {
      icon: <Security />,
      title: 'Comprehensive Risk Assessment',
      description: 'Detailed evaluation of allergens, additives, nutritional content, and contamination risks.',
    },
    {
      icon: <Speed />,
      title: 'Instant Results',
      description: 'Get detailed analysis results in seconds with confidence scores and recommendations.',
    },
    {
      icon: <HealthAndSafety />,
      title: 'Health Profile Integration',
      description: 'Personalized analysis based on your allergies, dietary restrictions, and health conditions.',
    },
    {
      icon: <Analytics />,
      title: 'Detailed Reports',
      description: 'Comprehensive reports with risk breakdowns, safety warnings, and actionable insights.',
    },
    {
      icon: <Warning />,
      title: 'Real-time Alerts',
      description: 'Immediate warnings for critical risks and potential drug interactions.',
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <Box>
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
          <Typography
            variant="h1"
            component="h1"
            sx={{
              color: 'white',
              fontWeight: 700,
              mb: 3,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              fontSize: { xs: '2rem', sm: '2.5rem', md: '3.5rem' },
            }}
          >
            AI-Powered Product Safety Analysis
          </Typography>
          
          <Typography
            variant="h5"
            component="p"
            sx={{
              color: alpha(theme.palette.common.white, 0.9),
              mb: 4,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.6,
              fontSize: { xs: '1.1rem', sm: '1.25rem' },
            }}
          >
            Analyze consumable products for health risks, allergens, and safety concerns using advanced AI technology
          </Typography>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/analyze')}
              sx={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.3)}`,
                color: 'white',
                fontSize: '1.2rem',
                fontWeight: 600,
                px: 4,
                py: 2,
                borderRadius: 3,
                textTransform: 'none',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.3)',
                  boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
                },
              }}
            >
              Start Analysis
            </Button>
          </motion.div>
        </Container>
      </motion.div>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <Typography
            variant="h2"
            component="h2"
            sx={{
              color: 'white',
              textAlign: 'center',
              mb: 6,
              fontWeight: 600,
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
            }}
          >
            Why Choose Our Analyzer?
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <motion.div variants={itemVariants}>
                  <Card
                    sx={{
                      height: '100%',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(20px)',
                      border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                      borderRadius: 3,
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        background: 'rgba(255, 255, 255, 0.15)',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
                      },
                    }}
                  >
                    <CardContent sx={{ p: 3, textAlign: 'center' }}>
                      <Box
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: 64,
                          height: 64,
                          borderRadius: '50%',
                          background: alpha(theme.palette.common.white, 0.2),
                          color: 'white',
                          mb: 2,
                          fontSize: '2rem',
                        }}
                      >
                        {feature.icon}
                      </Box>
                      
                      <Typography
                        variant="h6"
                        component="h3"
                        sx={{
                          color: 'white',
                          fontWeight: 600,
                          mb: 2,
                        }}
                      >
                        {feature.title}
                      </Typography>
                      
                      <Typography
                        variant="body1"
                        sx={{
                          color: alpha(theme.palette.common.white, 0.8),
                          lineHeight: 1.6,
                        }}
                      >
                        {feature.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </motion.div>
      </Container>

      {/* CTA Section */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
          <Card
            sx={{
              background: 'rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(20px)',
              border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
              borderRadius: 4,
              p: 4,
            }}
          >
            <Typography
              variant="h4"
              component="h3"
              sx={{
                color: 'white',
                fontWeight: 600,
                mb: 2,
              }}
            >
              Ready to Analyze Your Products?
            </Typography>
            
            <Typography
              variant="body1"
              sx={{
                color: alpha(theme.palette.common.white, 0.9),
                mb: 3,
                fontSize: '1.1rem',
              }}
            >
              Upload product information and get comprehensive safety analysis in seconds
            </Typography>
            
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/analyze')}
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
              Get Started Now
            </Button>
          </Card>
        </Container>
      </motion.div>
    </Box>
  );
};

export default HomePage;