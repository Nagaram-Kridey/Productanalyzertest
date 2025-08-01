import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  useTheme,
  alpha,
} from '@mui/material';
import {
  Science,
  Analytics,
  History,
  Info,
  Home,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Analyze', path: '/analyze', icon: <Analytics /> },
    { label: 'History', path: '/history', icon: <History /> },
    { label: 'About', path: '/about', icon: <Info /> },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(20px)',
        borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
            }}
            onClick={() => navigate('/')}
          >
            <IconButton
              sx={{
                mr: 1,
                background: alpha(theme.palette.common.white, 0.2),
                color: 'white',
                '&:hover': {
                  background: alpha(theme.palette.common.white, 0.3),
                },
              }}
            >
              <Science />
            </IconButton>
            <Typography
              variant="h5"
              component="div"
              sx={{
                fontWeight: 700,
                color: 'white',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              }}
            >
              Product Analyzer
            </Typography>
          </Box>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Box sx={{ display: 'flex', gap: 1 }}>
            {navItems.map((item, index) => (
              <motion.div
                key={item.path}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Button
                  startIcon={item.icon}
                  onClick={() => navigate(item.path)}
                  sx={{
                    color: 'white',
                    textTransform: 'none',
                    fontWeight: 500,
                    px: 2,
                    py: 1,
                    borderRadius: 2,
                    background: isActive(item.path)
                      ? alpha(theme.palette.common.white, 0.2)
                      : 'transparent',
                    backdropFilter: isActive(item.path) ? 'blur(10px)' : 'none',
                    border: isActive(item.path)
                      ? `1px solid ${alpha(theme.palette.common.white, 0.3)}`
                      : '1px solid transparent',
                    '&:hover': {
                      background: alpha(theme.palette.common.white, 0.15),
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
                    },
                    transition: 'all 0.2s ease-in-out',
                  }}
                >
                  {item.label}
                </Button>
              </motion.div>
            ))}
          </Box>
        </motion.div>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;