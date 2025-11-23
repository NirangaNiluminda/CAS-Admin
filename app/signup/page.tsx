'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Mail, Lock, User, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function SignUp() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://softbackendnewrender.onrender.com');
        }
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            name: '',
            email: '',
            password: '',
            confirmPassword: ''
        };

        // Name validation
        if (!formData.name) {
            newErrors.name = 'Name is required';
            isValid = false;
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
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

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        const key = id as keyof typeof errors;
        setFormData({ ...formData, [key]: value });

        // Clear error when user starts typing
        if (errors[key]) {
            setErrors({ ...errors, [key]: '' });
        }
    };

    const handleSignUp = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

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
                toast.success('Registration successful!');

                if (response.data.activationToken) {
                    const token = response.data.activationToken;
                    toast.info('Please check your email to activate your account.');
                    router.push(`/activate?token=${token}`);
                } else {
                    // Registration successful, and no activation needed
                    router.push('/dashboard');
                }
            }
        } catch (error: any) {
            console.error('Error during registration:', error);
            const errorMessage = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(errorMessage);
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
        <div className="h-screen w-full relative overflow-hidden flex items-center justify-center bg-black">
            {/* Full Screen Background Image */}
            <motion.div
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                transition={{ duration: 20, repeat: Infinity, repeatType: "reverse", ease: "linear" }}
                className="absolute inset-0 w-full h-full"
            >
                <Image
                    src="/SignIn.png"
                    alt="Sign Up Background"
                    layout="fill"
                    objectFit="cover"
                    priority
                    className="opacity-60"
                />
            </motion.div>

            {/* Dark Overlay for Readability */}
            <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/80 backdrop-blur-[2px]"></div>

            {/* Glassmorphism Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="relative z-10 w-full max-w-md p-6 mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl overflow-hidden"
            >
                {/* Decorative Glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-20">
                    <div className="text-center mb-4">
                        <div className="inline-flex items-center justify-center w-12 h-12 mb-2 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                            <span className="text-white text-2xl font-bold">A</span>
                        </div>
                        <h1 className="text-2xl font-bold text-white tracking-tight mb-1">Create Account</h1>
                        <p className="text-gray-300 text-sm">Join us and start managing your classroom</p>
                    </div>

                    <form onSubmit={handleSignUp} className="space-y-3">
                        <div className="space-y-3">
                            {/* Name Input */}
                            <div className="space-y-1">
                                <Label htmlFor="name" className="text-gray-200 font-medium ml-1 text-xs uppercase tracking-wider">Full Name</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                        <User size={16} />
                                    </div>
                                    <Input
                                        id="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        className={`h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-lg text-sm ${errors.name ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.name && (
                                    <p className="text-xs text-red-400 pl-1 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                        {errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Email Input */}
                            <div className="space-y-1">
                                <Label htmlFor="email" className="text-gray-200 font-medium ml-1 text-xs uppercase tracking-wider">Email Address</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                        <Mail size={16} />
                                    </div>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        className={`h-10 pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-lg text-sm ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-xs text-red-400 pl-1 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password Input */}
                            <div className="space-y-1">
                                <Label htmlFor="password" className="text-gray-200 font-medium ml-1 text-xs uppercase tracking-wider">Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                        <Lock size={16} />
                                    </div>
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        placeholder="Create a password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className={`h-10 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-lg text-sm ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={togglePasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="text-xs text-red-400 pl-1 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                        {errors.password}
                                    </p>
                                )}
                            </div>

                            {/* Confirm Password Input */}
                            <div className="space-y-1">
                                <Label htmlFor="confirmPassword" className="text-gray-200 font-medium ml-1 text-xs uppercase tracking-wider">Confirm Password</Label>
                                <div className="relative group">
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                        <Lock size={16} />
                                    </div>
                                    <Input
                                        id="confirmPassword"
                                        type={showConfirmPassword ? "text" : "password"}
                                        placeholder="Confirm your password"
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                        className={`h-10 pl-10 pr-10 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-lg text-sm ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={toggleConfirmPasswordVisibility}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-xs text-red-400 pl-1 font-medium flex items-center gap-1">
                                        <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>
                        </div>

                        <Button
                            type="submit"
                            className="w-full h-11 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-base shadow-lg shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Creating account...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Sign Up</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>

                        <div className="relative my-4">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="px-4 bg-transparent text-gray-400 font-medium backdrop-blur-sm">Or</span>
                            </div>
                        </div>

                        <div className="flex justify-center">
                            <p className="text-gray-400 text-xs">
                                Already have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/')}
                                    className="text-green-400 hover:text-green-300 font-bold hover:underline transition-all ml-1"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}