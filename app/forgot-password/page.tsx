'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Image from "next/image";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Loader2 } from "lucide-react";

export default function ForgotPassword() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post(`${apiUrl}/api/v1/forgot-password`, { email });
            
            if (response.data.success) {
                // Store the reset token in sessionStorage
                sessionStorage.setItem('resetToken', response.data.resetToken);
                // Navigate to reset password page
                router.push(`/reset-password?email=${encodeURIComponent(email)}`);
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
            <Card className="w-full max-w-[500px] shadow-xl">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <CardTitle className="text-2xl font-bold">Forgot Password</CardTitle>
                    <Image
                        src="/forgot-password.png"
                        alt="Forgot password illustration"
                        width={200}
                        height={200}
                        className="mt-6"
                        priority
                    />
                </CardHeader>
                <CardContent className="space-y-4">
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email address"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="bg-background"
                            />
                        </div>

                        {message && (
                            <p className={`text-sm ${message.includes('error') ? 'text-red-500' : 'text-green-500'}`}>
                                {message}
                            </p>
                        )}

                        <Button
                            type="submit"
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Sending...
                                </>
                            ) : (
                                'Send Reset Instructions'
                            )}
                        </Button>

                        <div className="text-center space-x-2">
                            <Button
                                variant="link"
                                className="text-primary hover:text-primary/80"
                                onClick={() => router.push('/')}
                            >
                                Back to Sign In
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}