import React from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
} from '@mui/material';
import {
  History,
  Visibility,
  Analytics,
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useQuery } from 'react-query';
import axios from 'axios';

const HistoryPage = () => {
  const navigate = useNavigate();
  const theme = useTheme();

  const { data: historyData, isLoading, error } = useQuery(
    'analysis-history',
    async () => {
      const response = await axios.get('/api/analysis/history');
      return response.data;
    }
  );

  const { data: statsData } = useQuery(
    'analysis-stats',
    async () => {
      const response = await axios.get('/api/analysis/stats');
      return response.data;
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <CircularProgress size={60} sx={{ color: 'white' }} />
        <Typography variant="h6" sx={{ color: 'white', ml: 2 }}>
          Loading analysis history...
        </Typography>
      </Box>
    );
  }

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
          mb: 4,
          fontWeight: 600,
          textShadow: '0 2px 4px rgba(0,0,0,0.3)',
        }}
      >
        Analysis History
      </Typography>

      {/* Statistics Cards */}
      {statsData && (
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
                textAlign: 'center',
                p: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                {statsData.total_analyses}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                Total Analyses
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
                textAlign: 'center',
                p: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
                {statsData.average_risk_score}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                Avg Risk Score
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
                textAlign: 'center',
                p: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: theme.palette.success.main, fontWeight: 700 }}>
                {statsData.risk_distribution?.low || 0}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                Low Risk Products
              </Typography>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card
              sx={{
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(20px)',
                border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                borderRadius: 3,
                textAlign: 'center',
                p: 2,
              }}
            >
              <Typography variant="h3" sx={{ color: theme.palette.error.main, fontWeight: 700 }}>
                {(statsData.risk_distribution?.high || 0) + (statsData.risk_distribution?.critical || 0)}
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                High Risk Products
              </Typography>
            </Card>
          </Grid>
        </Grid>
      )}

      {/* History List */}
      <Card
        sx={{
          background: 'rgba(255, 255, 255, 0.1)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
          borderRadius: 3,
          mb: 4,
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
            <History sx={{ color: 'white', mr: 2, fontSize: '2rem' }} />
            <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
              Recent Analyses
            </Typography>
          </Box>

          {error ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Error sx={{ fontSize: 60, color: theme.palette.error.main, mb: 2 }} />
              <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
                Failed to Load History
              </Typography>
              <Typography sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                There was an error loading your analysis history.
              </Typography>
            </Box>
          ) : historyData && historyData.length > 0 ? (
            <List>
              {historyData.map((analysis, index) => (
                <motion.div
                  key={analysis.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <ListItem
                    sx={{
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: 2,
                      mb: 2,
                      border: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        transform: 'translateY(-2px)',
                        transition: 'all 0.2s ease-in-out',
                      },
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                      {getRiskIcon(analysis.risk_level)}
                    </Box>
                    
                    <ListItemText
                      primary={
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                          {analysis.product_name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                            {formatDate(analysis.created_at)}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, gap: 1 }}>
                            <Chip
                              label={`${analysis.risk_level} RISK`}
                              size="small"
                              sx={{
                                backgroundColor: getRiskColor(analysis.risk_level),
                                color: 'white',
                                fontWeight: 600,
                              }}
                            />
                            <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                              Score: {Math.round(analysis.overall_risk_score)}/100
                            </Typography>
                          </Box>
                        </Box>
                      }
                    />
                    
                    <ListItemSecondaryAction>
                      <IconButton
                        onClick={() => navigate(`/results/${analysis.id}`)}
                        sx={{
                          color: 'white',
                          background: 'rgba(255, 255, 255, 0.1)',
                          '&:hover': {
                            background: 'rgba(255, 255, 255, 0.2)',
                          },
                        }}
                      >
                        <Visibility />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                </motion.div>
              ))}
            </List>
          ) : (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Analytics sx={{ fontSize: 80, color: alpha(theme.palette.common.white, 0.5), mb: 2 }} />
              <Typography variant="h5" sx={{ color: 'white', mb: 2 }}>
                No Analysis History
              </Typography>
              <Typography variant="body1" sx={{ color: alpha(theme.palette.common.white, 0.8), mb: 4 }}>
                You haven't analyzed any products yet. Start by analyzing your first product!
              </Typography>
              <Button
                variant="contained"
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
                Analyze Product
              </Button>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Risk Distribution Chart */}
      {statsData && statsData.risk_distribution && (
        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            borderRadius: 3,
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: 'white', mb: 3, fontWeight: 600 }}>
              Risk Level Distribution
            </Typography>
            
            <Grid container spacing={2}>
              {Object.entries(statsData.risk_distribution).map(([level, count]) => (
                <Grid item xs={6} sm={3} key={level}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" sx={{ color: getRiskColor(level.toUpperCase()), fontWeight: 700 }}>
                      {count}
                    </Typography>
                    <Typography variant="body2" sx={{ color: alpha(theme.palette.common.white, 0.8) }}>
                      {level.charAt(0).toUpperCase() + level.slice(1)} Risk
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </CardContent>
        </Card>
      )}
    </motion.div>
  );
};

export default HistoryPage;