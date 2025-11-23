'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdmin } from "./context/AdminContext";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Checkbox } from "./components/ui/checkbox";
import { Loader2, Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

export default function Home() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({
        email: '',
        password: '',
    });
    const [rememberMe, setRememberMe] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const { setAdmin } = useAdmin();
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://softbackendnewrender.onrender.com');
        }
    }, []);

    const validateForm = () => {
        let isValid = true;
        const newErrors = {
            email: '',
            password: '',
        };

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

        setErrors(newErrors);
        return isValid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target as HTMLInputElement;
        setFormData({ ...formData, [id]: value });

        // Clear error when user starts typing
        if (id in errors) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const handleSignIn = async (e?: React.FormEvent) => {
        if (e) e.preventDefault();

        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/v1/login-AdminUser`, {
                email: formData.email,
                password: formData.password,
            }, {
                withCredentials: true
            });

            if (response.status === 200 || response.data.success) {
                const token = response.data.accessToken;
                sessionStorage.setItem('name', response.data.user.name);

                // Store token in either localStorage or sessionStorage based on 'rememberMe'
                if (rememberMe) {
                    try {
                        localStorage.setItem('token', token);
                    } catch (e) {
                        console.error('Error storing token in localStorage:', e);
                    }
                } else {
                    // For non-remember-me, store in sessionStorage (and localStorage for compatibility)
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('token', token);
                }

                // Update admin context
                setAdmin(response.data.user);

                // Set the Authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;

                toast.success('Successfully signed in!');
                router.push('/dashboard');
            }
        } catch (error) {
            console.error('Error during sign in:', error);
            const errorMessage = axios.isAxiosError(error) && error.response?.data?.message
                ? error.response.data.message
                : 'Invalid email or password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResetPassword = () => {
        router.push('/forgot-password');
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    alt="Sign In Background"
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
                className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl shadow-2xl overflow-hidden"
            >
                {/* Decorative Glow */}
                <div className="absolute -top-20 -left-20 w-40 h-40 bg-green-500/30 rounded-full blur-3xl pointer-events-none"></div>
                <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-emerald-500/30 rounded-full blur-3xl pointer-events-none"></div>

                <div className="relative z-20">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                            <span className="text-white text-3xl font-bold">A</span>
                        </div>
                        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Welcome Back</h1>
                        <p className="text-gray-300">Sign in to your admin account</p>
                    </div>

                    <form onSubmit={handleSignIn} className="space-y-5">
                        {/* Email Field */}
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-gray-200 font-medium ml-1">Email Address</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                    <Mail size={20} />
                                </div>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="admin@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-xl ${errors.email ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-sm text-red-400 pl-1 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                    {errors.email}
                                </p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-gray-200 font-medium ml-1">Password</Label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                    <Lock size={20} />
                                </div>
                                <Input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-xl ${errors.password ? 'border-red-500 focus:border-red-500' : ''}`}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordVisibility}
                                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                                >
                                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-sm text-red-400 pl-1 font-medium flex items-center gap-1">
                                    <span className="w-1 h-1 rounded-full bg-red-400 inline-block"></span>
                                    {errors.password}
                                </p>
                            )}
                        </div>

                        {/* Remember Me & Forgot Password */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                    className="border-white/20 data-[state=checked]:bg-green-600 data-[state=checked]:border-green-600"
                                />
                                <label
                                    htmlFor="remember"
                                    className="text-sm text-gray-300 cursor-pointer select-none hover:text-white transition-colors"
                                >
                                    Remember me
                                </label>
                            </div>
                            <button
                                type="button"
                                onClick={handleResetPassword}
                                className="text-sm text-green-400 hover:text-green-300 transition-colors font-medium hover:underline"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 mt-2"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Loader2 className="h-5 w-5 animate-spin" />
                                    <span>Signing in...</span>
                                </div>
                            ) : (
                                <div className="flex items-center justify-center gap-2">
                                    <span>Sign In</span>
                                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-white/10"></span>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-400 font-medium backdrop-blur-sm">Or</span>
                            </div>
                        </div>

                        {/* Sign Up Link */}
                        <div className="flex justify-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <button
                                    type="button"
                                    onClick={() => router.push('/signup')}
                                    className="text-green-400 hover:text-green-300 font-bold hover:underline transition-all ml-1"
                                >
                                    Sign up
                                </button>
                            </p>
                        </div>
                    </form>
                </div>
            </motion.div>
        </div>
    );
}