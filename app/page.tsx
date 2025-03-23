// 'use client';
// import { useRouter } from "next/navigation";
// import { useEffect, useState } from "react";
// import Image from "next/image";
// import { useAdmin } from "./context/AdminContext";
// import axios from "axios";
// import Loading from "./components/Loader/Loading";

// export default function Home() {
//     const router = useRouter();
//     const [formData, setFormData] = useState({
//         email: '',
//         password: '',
//     });
//     const [rememberMe, setRememberMe] = useState(false);
//     const [isLoading, setIsLoading] = useState(false);
//     const [showLoading, setShowLoading] = useState(false);

//     const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setFormData({ ...formData, [e.target.id]: e.target.value });
//     };

//     const handleRememberMeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setRememberMe(e.target.checked);
//         console.log('Remember Me:', e.target.checked);
//     };

//     const { setAdmin } = useAdmin();
//     const [apiUrl, setApiUrl] = useState('');

//     useEffect(() => {
//         if (typeof window !== 'undefined') {
//             // Client-side API selection
//             setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '');
//         }
//     }, []);

//     const handleSignIn = async () => {
//         setIsLoading(true);
//         setShowLoading(false);
//         setTimeout(() => setShowLoading(true), 500); // 500ms delay before showing the loading component
    
//         console.log(formData);
//         try {
//             const response = await axios.post(`${apiUrl}/api/v1/login-AdminUser`, {
//                 email: formData.email,
//                 password: formData.password,
//             });
    
//             console.log('Response Data:', response.data);
    
//             if (response.status === 200 || response.data.success) {
//                 const token = response.data.accessToken;
//                 sessionStorage.setItem('name', response.data.user.name);
    
//                 console.log('Token before request:', token);
    
//                 // Store token in either localStorage or sessionStorage based on 'rememberMe'
//                 if (rememberMe) {
//                     try {
//                         localStorage.setItem('token', token);
//                         console.log('Token stored in localStorage:', localStorage.getItem('token'));
//                     } catch (e) {
//                         console.error('Error storing token in localStorage:', e);
//                     }
//                 } else {
//                     localStorage.setItem('token', token);
//                     sessionStorage.setItem('token', token);
//                     console.log('Token stored in sessionStorage:', sessionStorage.getItem('token'));
//                 }
    
//                 // Verify token storage
//                 console.log('Token stored in localStorage after setting:', localStorage.getItem('token'));
//                 console.log('Token stored in sessionStorage after setting:', sessionStorage.getItem('token'));
    
//                 // Update admin context
//                 setAdmin(response.data.user);
//                 // Set the Authorization header for future requests
//                 axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
    
//                 // Redirect to dashboard
//                 router.push('/dashboard');
//             } else {
//                 alert('Invalid credentials');
//             }
//         } catch (error) {
//             console.error('Error during sign in:', error);
//             alert(`An errors occurred. Please try again. ${error}`);
//         } finally {
//             setIsLoading(false);
//             setShowLoading(false);
//         }
//     };
    
//     return (
//         <div className='w-full h-screen flex justify-center items-center'>
//             {isLoading && showLoading ? (
//                 <Loading />
//             ) : (
//                 <div className="w-[830px] h-[640px] flex flex-col justify-center items-center gap-[42px]">
//                     <div className="self-stretch h-[25px] text-center text-black text-[32px] font-bold font-['Inter']">Sign in</div>

//                     <Image className="w-[273px] h-60" src="/SignIn.png" alt='sign in image' width={380} height={380} />
//                     <div className="self-stretch flex flex-col justify-center items-center gap-[20px]">
//                         <div className="flex gap-[86px]">
//                             <div className="h-[68px] relative">
//                                 <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Email</label>
//                                 <input type="email" id="email" value={formData.email} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="name@flowbite.com" />
//                             </div>
//                             <div className="h-[68px] relative">
//                                 <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
//                                 <input type="password" id="password" value={formData.password} onChange={handleChange} className="bg-green-200 border border-gray-300 text-black text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 placeholder-black" placeholder="Password" />
//                             </div>
//                         </div>
//                         <div className="flex justify-between items-center w-full mt-4">
//                             <div className="flex items-center">
//                                 <input
//                                     id="default-radio-1"
//                                     type="radio"
//                                     value=""
//                                     name="default-radio"
//                                     checked={rememberMe}
//                                     onChange={handleRememberMeChange}
//                                     className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500"
//                                 />
//                                 <label className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Remember Me</label>
//                             </div>
//                             <div className="flex items-center">
//                                 <div className="w-[169px] h-4 text-black text-xl font-medium font-['Inter'] cursor-pointer">Forgot Password ?</div>
//                             </div>
//                         </div>
//                     </div>
//                     <button
//                         type="button"
//                         onClick={handleSignIn}
//                         className="focus:outline-none text-black bg-[#0cdc09] hover:bg-green-800 hover:border hover:border-[#0cdc09] focus:ring-4 focus:ring-green-300 font-bold font-['Inter'] tracking-[3.60px] rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-[#0cdc09] dark:hover:bg-transparent dark:focus:ring-green-800 transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg"
//                     >
//                         Sign in
//                     </button>
//                     <div className="flex flex-row items-center gap-2">
//                         <div className="text-black text-xl font-light font-['Inter']">Don&apos;t have an account?</div>
//                         <button
//                             className="text-blue-500 hover:underline text-xl font-bold font-['Inter']"
//                             onClick={() => router.push('/signup')}
//                         >
//                             Sign Up
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

'use client';

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { useAdmin } from "./context/AdminContext";
import axios from "axios";
import { Button } from "./components/ui/button";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "./components/ui/card";
import { Checkbox } from "./components/ui/checkbox";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

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
    const [showLoading, setShowLoading] = useState(false);
    const { setAdmin } = useAdmin();
    const [apiUrl, setApiUrl] = useState('');

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setApiUrl(window.location.hostname === 'localhost' ? 'http://localhost:4000' : process.env.NEXT_PUBLIC_DEPLOYMENT_URL || '');
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
        const { id, value } = e.target;
        setFormData({ ...formData, [id]: value });
        
        // Clear error when user starts typing
        if (errors[id as keyof typeof errors]) {
            setErrors({ ...errors, [id]: '' });
        }
    };

    const handleSignIn = async () => {
        if (!validateForm()) {
            toast.error('Please fix the errors before submitting');
            return;
        }

        setIsLoading(true);
        setShowLoading(false);
        setTimeout(() => setShowLoading(true), 500); // 500ms delay before showing the loading component

        try {
            const response = await axios.post(`${apiUrl}/api/v1/login-AdminUser`, {
                email: formData.email,
                password: formData.password,
            });

            console.log('Response Data:', response.data);

            if (response.status === 200 || response.data.success) {
                const token = response.data.accessToken;
                sessionStorage.setItem('name', response.data.user.name);

                console.log('Token before request:', token);

                // Store token in either localStorage or sessionStorage based on 'rememberMe'
                if (rememberMe) {
                    try {
                        localStorage.setItem('token', token);
                        console.log('Token stored in localStorage:', localStorage.getItem('token'));
                    } catch (e) {
                        console.error('Error storing token in localStorage:', e);
                    }
                } else {
                    // For non-remember-me, store in sessionStorage (and localStorage for compatibility)
                    localStorage.setItem('token', token);
                    sessionStorage.setItem('token', token);
                    console.log('Token stored in sessionStorage:', sessionStorage.getItem('token'));
                }

                // Update admin context
                setAdmin(response.data.user);
                
                // Set the Authorization header for future requests
                axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.accessToken}`;
                
                toast.success('Successfully signed in!');
                router.push('/dashboard');
            }
        } catch (error: any) {
            console.error('Error during sign in:', error);
            const errorMessage = error.response?.data?.message || 'Invalid email or password';
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
            setShowLoading(false);
        }
    };

    const handleResetPassword = () => {
        router.push('/forgot-password');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-background to-muted px-4">
            <Card className="w-full max-w-[830px] shadow-xl">
                <CardHeader className="space-y-1 flex flex-col items-center">
                    <CardTitle className="text-3xl font-bold">Sign in</CardTitle>
                    <Image
                        src="/SignIn.png"
                        alt="Sign in illustration"
                        width={273}
                        height={240}
                        className="mt-6"
                        priority
                    />
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.email ? 'border-red-500' : ''}`}
                                />
                                {errors.email && (
                                    <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                                )}
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    className={`bg-background ${errors.password ? 'border-red-500' : ''}`}
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                                )}
                            </div>
                        </div>

                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="remember"
                                    checked={rememberMe}
                                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                                />
                                <Label htmlFor="remember" className="text-sm">Remember me</Label>
                            </div>
                            <Button
                                variant="link"
                                className="text-primary hover:text-primary/80"
                                onClick={handleResetPassword}
                            >
                                Forgot Password?
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Button
                            className="w-full bg-green-500 hover:bg-green-600 text-white"
                            onClick={handleSignIn}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign in'
                            )}
                        </Button>

                        <div className="text-center space-x-2">
                            <span className="text-muted-foreground">Don't have an account?</span>
                            <Button
                                variant="link"
                                className="text-primary hover:text-primary/80"
                                onClick={() => router.push('/signup')}
                            >
                                Sign Up
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}