import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  useTheme,
  alpha,
  Alert,
} from '@mui/material';
import {
  ExpandMore,
  Analytics,
  Add,
  Remove,
  Security,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const schema = yup.object({
  product_name: yup.string().required('Product name is required'),
  ingredients: yup.string().required('Ingredients list is required'),
  category: yup.string(),
  product_description: yup.string(),
  nutrition_facts: yup.object().shape({
    calories: yup.number().min(0),
    sodium_mg: yup.number().min(0),
    sugar_g: yup.number().min(0),
    saturated_fat_g: yup.number().min(0),
    trans_fat_g: yup.number().min(0),
    protein_g: yup.number().min(0),
    fiber_g: yup.number().min(0),
  }),
});

const AnalyzePage = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [allergies, setAllergies] = useState([]);
  const [dietaryRestrictions, setDietaryRestrictions] = useState([]);
  const [medicalConditions, setMedicalConditions] = useState([]);
  const [newAllergy, setNewAllergy] = useState('');

  const { control, handleSubmit, formState: { errors }, watch } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      product_name: '',
      ingredients: '',
      category: '',
      product_description: '',
      nutrition_facts: {
        calories: '',
        sodium_mg: '',
        sugar_g: '',
        saturated_fat_g: '',
        trans_fat_g: '',
        protein_g: '',
        fiber_g: '',
      },
    },
  });

  const categories = [
    'Food & Beverages',
    'Snacks',
    'Dairy Products',
    'Meat & Seafood',
    'Fruits & Vegetables',
    'Grains & Cereals',
    'Supplements',
    'Baby Food',
    'Frozen Foods',
    'Canned Goods',
    'Beverages',
    'Other',
  ];

  const commonAllergens = [
    'Milk', 'Eggs', 'Fish', 'Shellfish', 'Tree nuts', 'Peanuts',
    'Wheat', 'Soybeans', 'Sesame', 'Gluten', 'Lactose',
  ];

  const handleAddAllergy = () => {
    if (newAllergy && !allergies.includes(newAllergy)) {
      setAllergies([...allergies, newAllergy]);
      setNewAllergy('');
    }
  };

  const handleRemoveAllergy = (allergyToRemove) => {
    setAllergies(allergies.filter(allergy => allergy !== allergyToRemove));
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Prepare health profile
      const healthProfile = {
        allergies,
        dietary_restrictions: dietaryRestrictions,
        medical_conditions: medicalConditions,
      };

      // Clean nutrition facts - remove empty values
      const cleanedNutritionFacts = Object.fromEntries(
        Object.entries(data.nutrition_facts).filter(([key, value]) => value !== '')
      );

      const analysisData = {
        ...data,
        nutrition_facts: Object.keys(cleanedNutritionFacts).length > 0 ? cleanedNutritionFacts : null,
      };

      const response = await axios.post('/api/analysis/analyze', analysisData, {
        params: allergies.length > 0 || dietaryRestrictions.length > 0 || medicalConditions.length > 0 
          ? { health_profile: healthProfile } 
          : {},
      });

      if (response.data.status === 'success') {
        toast.success('Analysis completed successfully!');
        navigate(`/results/${response.data.session_id}`);
      } else {
        throw new Error('Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(error.response?.data?.detail || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
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
          Product Safety Analysis
        </Typography>

        <Card
          sx={{
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(theme.palette.common.white, 0.2)}`,
            borderRadius: 3,
            p: 3,
            mb: 3,
          }}
        >
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Security sx={{ color: 'white', mr: 2, fontSize: '2rem' }} />
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                Enter Product Information
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <Grid container spacing={3}>
                {/* Basic Product Info */}
                <Grid item xs={12} md={6}>
                  <Controller
                    name="product_name"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Product Name"
                        error={!!errors.product_name}
                        helperText={errors.product_name?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.5),
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha(theme.palette.common.white, 0.7),
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.error.light,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <Controller
                    name="category"
                    control={control}
                    render={({ field }) => (
                      <FormControl fullWidth>
                        <InputLabel sx={{ color: alpha(theme.palette.common.white, 0.7) }}>
                          Category
                        </InputLabel>
                        <Select
                          {...field}
                          label="Category"
                          sx={{
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.common.white, 0.3),
                            },
                            '&:hover .MuiOutlinedInput-notchedOutline': {
                              borderColor: alpha(theme.palette.common.white, 0.5),
                            },
                            '& .MuiSvgIcon-root': {
                              color: 'white',
                            },
                          }}
                        >
                          {categories.map((category) => (
                            <MenuItem key={category} value={category}>
                              {category}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="ingredients"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={4}
                        label="Ingredients List"
                        placeholder="Enter ingredients separated by commas..."
                        error={!!errors.ingredients}
                        helperText={errors.ingredients?.message}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.5),
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha(theme.palette.common.white, 0.7),
                          },
                          '& .MuiFormHelperText-root': {
                            color: theme.palette.error.light,
                          },
                        }}
                      />
                    )}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Controller
                    name="product_description"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        multiline
                        rows={2}
                        label="Product Description (Optional)"
                        placeholder="Additional product details..."
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            backgroundColor: 'rgba(255, 255, 255, 0.1)',
                            color: 'white',
                            '& fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.3),
                            },
                            '&:hover fieldset': {
                              borderColor: alpha(theme.palette.common.white, 0.5),
                            },
                          },
                          '& .MuiInputLabel-root': {
                            color: alpha(theme.palette.common.white, 0.7),
                          },
                        }}
                      />
                    )}
                  />
                </Grid>
              </Grid>

              {/* Optional Sections */}
              <Box sx={{ mt: 4 }}>
                {/* Nutrition Facts */}
                <Accordion
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    '&:before': { display: 'none' },
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                    <Typography sx={{ fontWeight: 600 }}>Nutrition Facts (Optional)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      {['calories', 'sodium_mg', 'sugar_g', 'saturated_fat_g', 'trans_fat_g', 'protein_g', 'fiber_g'].map((field) => (
                        <Grid item xs={6} sm={4} md={3} key={field}>
                          <Controller
                            name={`nutrition_facts.${field}`}
                            control={control}
                            render={({ field: inputField }) => (
                              <TextField
                                {...inputField}
                                fullWidth
                                type="number"
                                label={field.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                    color: 'white',
                                    '& fieldset': {
                                      borderColor: alpha(theme.palette.common.white, 0.3),
                                    },
                                  },
                                  '& .MuiInputLabel-root': {
                                    color: alpha(theme.palette.common.white, 0.7),
                                  },
                                }}
                              />
                            )}
                          />
                        </Grid>
                      ))}
                    </Grid>
                  </AccordionDetails>
                </Accordion>

                {/* Health Profile */}
                <Accordion
                  sx={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    color: 'white',
                    '&:before': { display: 'none' },
                    mt: 1,
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMore sx={{ color: 'white' }} />}>
                    <Typography sx={{ fontWeight: 600 }}>Health Profile (Optional)</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box sx={{ mb: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2, color: 'white' }}>
                        Allergies
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                        {commonAllergens.map((allergen) => (
                          <Chip
                            key={allergen}
                            label={allergen}
                            onClick={() => {
                              if (!allergies.includes(allergen)) {
                                setAllergies([...allergies, allergen]);
                              }
                            }}
                            variant={allergies.includes(allergen) ? 'filled' : 'outlined'}
                            sx={{
                              color: 'white',
                              borderColor: alpha(theme.palette.common.white, 0.3),
                              '&.MuiChip-filled': {
                                backgroundColor: theme.palette.primary.main,
                              },
                            }}
                          />
                        ))}
                      </Box>
                      
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', mb: 2 }}>
                        <TextField
                          value={newAllergy}
                          onChange={(e) => setNewAllergy(e.target.value)}
                          placeholder="Add custom allergy"
                          size="small"
                          sx={{
                            '& .MuiOutlinedInput-root': {
                              backgroundColor: 'rgba(255, 255, 255, 0.1)',
                              color: 'white',
                            },
                          }}
                        />
                        <Button
                          onClick={handleAddAllergy}
                          variant="outlined"
                          size="small"
                          startIcon={<Add />}
                          sx={{ color: 'white', borderColor: 'white' }}
                        >
                          Add
                        </Button>
                      </Box>

                      {allergies.length > 0 && (
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {allergies.map((allergy) => (
                            <Chip
                              key={allergy}
                              label={allergy}
                              onDelete={() => handleRemoveAllergy(allergy)}
                              deleteIcon={<Remove sx={{ color: 'white' }} />}
                              sx={{
                                backgroundColor: theme.palette.primary.main,
                                color: 'white',
                              }}
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              </Box>

              {/* Submit Button */}
              <Box sx={{ mt: 4, textAlign: 'center' }}>
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    size="large"
                    disabled={loading}
                    startIcon={loading ? <CircularProgress size={20} /> : <Analytics />}
                    sx={{
                      background: theme.palette.primary.main,
                      color: 'white',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      px: 4,
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      minWidth: 200,
                      '&:hover': {
                        background: theme.palette.primary.dark,
                      },
                      '&:disabled': {
                        background: alpha(theme.palette.primary.main, 0.5),
                      },
                    }}
                  >
                    {loading ? 'Analyzing...' : 'Analyze Product'}
                  </Button>
                </motion.div>
              </Box>
            </form>
          </CardContent>
        </Card>

        {/* Info Alert */}
        <Alert
          severity="info"
          sx={{
            background: 'rgba(33, 150, 243, 0.1)',
            color: 'white',
            borderRadius: 2,
            '& .MuiAlert-icon': {
              color: theme.palette.info.light,
            },
          }}
        >
          <Typography variant="body2">
            Our AI analyzes your product for potential health risks including allergens, harmful additives, 
            nutritional concerns, and contamination risks. Results include personalized recommendations 
            based on your health profile.
          </Typography>
        </Alert>
      </motion.div>
    </Box>
  );
};

export default AnalyzePage;