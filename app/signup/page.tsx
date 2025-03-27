'use client';

import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from "framer-motion";
import { toast } from "sonner";

// Material UI imports
import { 
  Button, 
  TextField, 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Checkbox, 
  FormControlLabel,
  InputAdornment,
  IconButton 
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  PersonOutline, 
  LockOutlined, 
  EmailOutlined 
} from '@mui/icons-material';

const SignUp = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        registrationNumber: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [apiUrl, setApiUrl] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                setApiUrl('http://localhost:4000');
            } else {
                setApiUrl(`${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}`);
            }
        }
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: '',
        };

        // Name validation
        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
            isValid = false;
        }

        // Email validation
        if (!formData.email) {
            newErrors.email = 'Email is required';
            isValid = false;
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
            isValid = false;
        }

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
            isValid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
            isValid = false;
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
            isValid = false;
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            isValid = false;
        }

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        
        // Clear error when user starts typing
        if (errors[id]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const handleSignUp = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/v1/AdminRegistration`, {
                name: formData.name,
                email: formData.email,
                password: formData.password,
            });

            if (response.status === 201 || response.data.success) {
                if (response.data.activationToken) {
                    const token = response.data.activationToken;
                    toast.success('Registration successful! Please check your email to activate your account.');
                    router.push(`/activate?token=${token}`);
                } else {
                    // Registration successful, and no activation needed
                    toast.success('Registration successful!');
                    router.push('/dashboard');
                }
            } else {
                // Handle error response
                toast.error('Registration failed. Please try again.');
            }
        } catch (error) {
            // Handle error
            console.error('Error during registration:', error);
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 px-4 py-10">
            {/* Decorative elements */}
            <div className="absolute top-10 left-10 w-16 h-16 rounded-full bg-green-200 opacity-60"></div>
            <div className="absolute top-20 right-20 w-24 h-24 rounded-full bg-green-100 opacity-40"></div>
            <div className="absolute bottom-10 left-1/4 w-20 h-20 rounded-full bg-green-200 opacity-50"></div>
            <div className="absolute bottom-20 right-1/3 w-12 h-12 rounded-full bg-green-100 opacity-30"></div>
            
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="w-full max-w-[500px] relative z-10"
            >
                <Card 
                    sx={{ 
                        borderRadius: '24px', 
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                        border: 'none'
                    }}
                >
                    <CardContent sx={{ padding: 4 }}>
                        <Box display="flex" flexDirection="column" alignItems="center" textAlign="center">
                            <Box 
                                sx={{ 
                                    bgcolor: '#e6ffe6', 
                                    borderRadius: '50%', 
                                    width: 64, 
                                    height: 64, 
                                    display: 'flex', 
                                    alignItems: 'center', 
                                    justifyContent: 'center',
                                    mb: 3
                                }}
                            >
                                <PersonOutline sx={{ fontSize: 32, color: '#4caf50' }} />
                            </Box>
                            
                            <Typography variant="h5" component="h1" fontWeight="bold" mb={1}>
                                Signing you UP!
                            </Typography>
                            
                            <Typography variant="body1" color="text.secondary" mb={4}>
                                Create an account to access all features
                            </Typography>
                            
                            <Box width="100%" sx={{ '& .MuiTextField-root': { mb: 3 } }}>
                                <TextField
                                    id="name"
                                    label="Full Name"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.name}
                                    onChange={handleChange}
                                    error={!!errors.name}
                                    helperText={errors.name}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <PersonOutline sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(230, 255, 230, 0.5)',
                                        }
                                    }}
                                />
                                
                                <TextField
                                    id="email"
                                    label="Email"
                                    variant="outlined"
                                    fullWidth
                                    value={formData.email}
                                    onChange={handleChange}
                                    error={!!errors.email}
                                    helperText={errors.email}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <EmailOutlined sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(230, 255, 230, 0.5)',
                                        }
                                    }}
                                />
                                
                                <TextField
                                    id="password"
                                    label="Password"
                                    variant="outlined"
                                    fullWidth
                                    type={showPassword ? 'text' : 'password'}
                                    value={formData.password}
                                    onChange={handleChange}
                                    error={!!errors.password}
                                    helperText={errors.password}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={togglePasswordVisibility} edge="end">
                                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(230, 255, 230, 0.5)',
                                        }
                                    }}
                                />
                                
                                <TextField
                                    id="confirmPassword"
                                    label="Confirm Password"
                                    variant="outlined"
                                    fullWidth
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    error={!!errors.confirmPassword}
                                    helperText={errors.confirmPassword}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <LockOutlined sx={{ color: 'action.active' }} />
                                            </InputAdornment>
                                        ),
                                        endAdornment: (
                                            <InputAdornment position="end">
                                                <IconButton onClick={toggleConfirmPasswordVisibility} edge="end">
                                                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }}
                                    sx={{
                                        '& .MuiOutlinedInput-root': {
                                            borderRadius: '12px',
                                            bgcolor: 'rgba(230, 255, 230, 0.5)',
                                        }
                                    }}
                                />
                                
                                <motion.div
                                    whileHover={{ scale: 1.01 }}
                                    whileTap={{ scale: 0.99 }}
                                >
                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        onClick={handleSignUp}
                                        disabled={isLoading}
                                        sx={{
                                            bgcolor: '#4caf50',
                                            '&:hover': { bgcolor: '#388e3c' },
                                            borderRadius: '12px',
                                            py: 1.5,
                                            textTransform: 'uppercase',
                                            fontWeight: 'bold',
                                            letterSpacing: '2px',
                                            mb: 2
                                        }}
                                    >
                                        {isLoading ? 'Signing up...' : 'SIGN UP'}
                                    </Button>
                                </motion.div>
                            </Box>

                            <Box mt={3} display="flex" alignItems="center" justifyContent="center">
                                <Typography variant="body2" color="text.secondary">
                                    Already have an account?
                                </Typography>
                                <Button 
                                    color="primary"
                                    onClick={() => router.push('/')} 
                                    sx={{ ml: 1, textTransform: 'none', fontWeight: 'bold' }}
                                >
                                    Sign in
                                </Button>
                            </Box>
                        </Box>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default SignUp;