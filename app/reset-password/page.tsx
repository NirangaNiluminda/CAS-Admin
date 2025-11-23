'use client';

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, Suspense } from "react";
import Image from "next/image";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Loader2, Lock, Eye, EyeOff, ArrowRight, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

function ResetPasswordContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get('token');

    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [apiUrl, setApiUrl] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || 'https://softbackendnewrender.onrender.com');
        }
    }, []);

    useEffect(() => {
        if (!token) {
            toast.error('Invalid or missing reset token');
            // Optionally redirect after a delay
            // setTimeout(() => router.push('/forgot-password'), 3000);
        }
    }, [token, router]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.password || !formData.confirmPassword) {
            toast.error('Please fill in all fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            toast.error('Password must be at least 6 characters');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${apiUrl}/api/v1/reset-password`, {
                token,
                newPassword: formData.password
            });

            if (response.status === 200 || response.data.success) {
                setIsSuccess(true);
                toast.success('Password reset successfully!');
                setTimeout(() => {
                    router.push('/');
                }, 3000);
            }
        } catch (error: any) {
            console.error('Error resetting password:', error);
            const errorMessage = error.response?.data?.message || 'Failed to reset password. Please try again.';
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

    if (isSuccess) {
        return (
            <div className="text-center">
                <div className="inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-green-500/20 text-green-400 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">Password Reset!</h2>
                <p className="text-gray-300 mb-8">
                    Your password has been successfully updated. You will be redirected to the login page shortly.
                </p>
                <Button
                    onClick={() => router.push('/')}
                    className="w-full h-12 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold"
                >
                    Go to Login Now
                </Button>
            </div>
        );
    }

    return (
        <>
            <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-500/20">
                    <Lock className="text-white w-8 h-8" />
                </div>
                <h1 className="text-3xl font-bold text-white tracking-tight mb-2">Reset Password</h1>
                <p className="text-gray-300">Enter your new password below</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-5">
                    <div className="space-y-2">
                        <Label htmlFor="password" className="text-gray-200 font-medium ml-1">New Password</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                <Lock size={20} />
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter new password"
                                value={formData.password}
                                onChange={handleChange}
                                className="h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={togglePasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                            >
                                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-gray-200 font-medium ml-1">Confirm Password</Label>
                        <div className="relative group">
                            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-green-400 transition-colors duration-200">
                                <Lock size={20} />
                            </div>
                            <Input
                                id="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Confirm new password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="h-12 pl-12 pr-12 bg-white/5 border-white/10 text-white placeholder:text-gray-500 focus:bg-white/10 focus:border-green-500 focus:ring-2 focus:ring-green-500/20 transition-all duration-200 rounded-xl"
                            />
                            <button
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors p-1 hover:bg-white/10 rounded-lg"
                            >
                                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                            </button>
                        </div>
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-green-900/20 transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0"
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <div className="flex items-center justify-center gap-2">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Resetting...</span>
                        </div>
                    ) : (
                        <div className="flex items-center justify-center gap-2">
                            <span>Reset Password</span>
                            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </div>
                    )}
                </Button>
            </form>
        </>
    );
}

export default function ResetPassword() {
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
                    src="/reset-password.png"
                    alt="Reset Password Background"
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
                    <Suspense fallback={
                        <div className="flex justify-center items-center h-40">
                            <Loader2 className="h-8 w-8 animate-spin text-green-500" />
                        </div>
                    }>
                        <ResetPasswordContent />
                    </Suspense>
                </div>
            </motion.div>
        </div>
    );
}