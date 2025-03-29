'use client';

import React, { useEffect, useState } from 'react';
import {
    Table,
    TableHeader,
    TableBody,
    TableRow,
    TableHead,
    TableCell,
} from "../components/ui/table";
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../components/ui/select";
import { Card, CardContent } from "../components/ui/card";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "../components/ui/tooltip";
import { useRouter } from 'next/navigation';
import { useAdmin } from '../context/AdminContext';
import { useQuiz } from '../context/QuizContext';
import { useEssay } from '../context/EssayContext';
import { 
    PlusCircle, 
    Eye, 
    Link2, 
    Edit, 
    Search, 
    SortAsc, 
    FileText, 
    List, 
    BookOpen, 
    Calendar, 
    Clock, 
    User, 
    UserCheck,
    Award,
    BarChart3 
} from 'lucide-react';
import { toast } from "sonner";

import { motion, AnimatePresence } from "framer-motion";


interface Assignment {
    _id: string;
    title: string;
    questions: { length: number }[];
    createdAt?: string;
}

export default function Page() {
    const router = useRouter();
    const { admin } = useAdmin();
    const [name, setName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { setQuiz } = useQuiz();
    const { setEssay } = useEssay();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState<'title' | 'questions'>('title');
    const [assignmentType, setAssignmentType] = useState<'quiz' | 'essay'>('quiz');
    const [isLoading, setIsLoading] = useState(true);
    const [stats, setStats] = useState({
        totalAssignments: 0,
        totalQuestions: 0,
        recentActivity: 0
    });

    useEffect(() => {
        const fetchAssignments = async () => {
            setIsLoading(true);
            if (admin && admin._id) {
                try {
                    const apiUrl = typeof window !== 'undefined'
                        ? window.location.hostname === 'localhost'
                            ? 'http://localhost:4000'
                            : process.env.NEXT_PUBLIC_DEPLOYMENT_URL
                        : '';

                    const response = await fetch(
                        `${apiUrl}/api/v1/${assignmentType === 'quiz' ? `teacher/${admin._id}` : `essay/teacher/${admin._id}`}`
                    );

                    if (!response || !response.ok) {
                        throw new Error(`Failed to fetch: ${response?.statusText || 'Unknown error'}`);
                    }

                    const data = await response.json();
                    if (data.success) {
                        const fetchedAssignments = assignmentType === 'quiz' ? data.assignments : data.essayAssignments;
                        setAssignments(fetchedAssignments);
                        
                        // Calculate stats
                        const totalQuestions = fetchedAssignments.reduce((acc, curr) => acc + curr.questions.length, 0);
                        
                        // Count recent activity (assignments created in the last 30 days)
                        const thirtyDaysAgo = new Date();
                        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
                        const recentActivity = fetchedAssignments.filter(a => 
                            a.createdAt && new Date(a.createdAt) > thirtyDaysAgo
                        ).length;
                        
                        setStats({
                            totalAssignments: fetchedAssignments.length,
                            totalQuestions,
                            recentActivity
                        });
                    }
                } catch (error) {
                    console.error('Failed to fetch assignments', error);
                    toast.error("Failed to load assignments");
                } finally {
                    setIsLoading(false);
                }
            }
        };

        fetchAssignments();
    }, [admin, assignmentType]);

    useEffect(() => {
        if (admin?.name) {
            setName(admin.name);
        }
    }, [admin]);

    const fetchQuiz = async (id: string, type: string) => {
        try {
            const apiUrl = typeof window !== 'undefined'
                ? window.location.hostname === 'localhost'
                    ? 'http://localhost:4000'
                    : process.env.NEXT_PUBLIC_DEPLOYMENT_URL
                : '';

            const response = await fetch(`${apiUrl}/api/v1/${type === 'quiz' ? '' : 'essay/'}${id}`);
            const data = await response.json();

            if (data.success) {
                if (type === 'quiz') {
                    setQuiz(data.assignment);
                    router.push('/viewquiz');
                } else {
                    setEssay(data.essayAssignment);
                    router.push('/viewessay');
                }
            }
        } catch (error) {
            console.error('Failed to fetch quiz', error);
            toast.error("Failed to load assignment details");
        }
    };

    const editQuiz = async (id: string) => {
        try {
            const apiUrl = typeof window !== 'undefined'
                ? window.location.hostname === 'localhost'
                    ? 'http://localhost:4000'
                    : process.env.NEXT_PUBLIC_DEPLOYMENT_URL
                : '';

            const response = await fetch(`${apiUrl}/api/v1/${id}`);
            const data = await response.json();

            if (data.success) {
                setQuiz(data.assignment);
                router.push(`/edit/${id}`);
            }
        } catch (error) {
            console.error('Failed to fetch quiz', error);
            toast.error("Failed to load assignment for editing");
        }
    };

    const getQuizLink = (id: string) => {
        const URL = `http://localhost:3001/signin/${id}`;
        navigator.clipboard.writeText(URL)
            .then(() => {
                toast.success("Link copied!", {
                    description: "Assignment link has been copied to clipboard"
                });
            })
            .catch(err => {
                console.error('Failed to copy link: ', err);
                toast.error("Failed to copy", {
                    description: "Please try again"
                });
            });
        return URL;
    };

    const filteredAssignments = Array.isArray(assignments)
        ? assignments
            .filter(assignment =>
                assignment.title.toLowerCase().includes(searchTerm.toLowerCase())
            )
            .sort((a, b) => {
                if (sortOption === "title") {
                    return a.title.localeCompare(b.title);
                } else if (sortOption === "questions") {
                    return b.questions.length - a.questions.length;
                }
                return 0;
            })
        : [];
    useEffect(() => {
        localStorage.removeItem('currentBreadcrumbs');
    }, []);
    return (

        <div className="min-h-screen bg-gradient-to-b from-green-50 via-green-50 to-white p-4 md:p-8">
            {/* Decorative elements */}
            <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
            <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
            <div className="fixed bottom-20 left-1/4 w-56 h-56 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row items-center justify-between mb-8">
                        <div className="flex items-center space-x-4 mb-4 md:mb-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl shadow-lg flex items-center justify-center transform rotate-3">
                                <BookOpen className="h-8 w-8 text-white" />

                            </div>
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800">Teacher Dashboard</h1>
                                <p className="text-gray-600">Manage your assignments and quizzes</p>
                            </div>
                        </div>
                        
                        <Button 
                            onClick={() => router.push('/addingquiz')}
                            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white rounded-xl px-6 py-2 shadow-md hover:shadow-lg transition-all duration-200 transform hover:scale-105"
                        >
                            <PlusCircle className="h-5 w-5 mr-2" />
                            Create New Assignment
                        </Button>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
                        >
                            <div className="flex items-center">
                                <div className="bg-green-100 rounded-xl p-3 mr-4">
                                    <FileText className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Total Assignments</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalAssignments}</h3>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
                        >
                            <div className="flex items-center">
                                <div className="bg-green-100 rounded-xl p-3 mr-4">
                                    <List className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Total Questions</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.totalQuestions}</h3>
                                </div>
                            </div>
                        </motion.div>
                        
                        <motion.div 
                            whileHover={{ y: -5, boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.2)" }}
                            transition={{ duration: 0.2 }}
                            className="bg-white rounded-2xl p-6 shadow-md border border-green-100"
                        >
                            <div className="flex items-center">
                                <div className="bg-green-100 rounded-xl p-3 mr-4">
                                    <Calendar className="h-6 w-6 text-green-600" />
                                </div>
                                <div>
                                    <p className="text-gray-600 text-sm">Recent Activity</p>
                                    <h3 className="text-2xl font-bold text-gray-800">{stats.recentActivity}</h3>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Profile Section */}
                    <Card className="mb-8 overflow-hidden border-0 shadow-xl rounded-2xl bg-gradient-to-r from-green-50 to-emerald-50">
                        <CardContent className="p-0">
                            <div className="flex flex-col md:flex-row">
                                <div className="w-full md:w-1/3 bg-gradient-to-br from-green-400 to-emerald-600 p-8 flex flex-col justify-center items-center text-white">
                                    <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 shadow-lg border-2 border-white/40">
                                        <User className="h-12 w-12" />
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">
                                        {name ? name : "Teacher"}
                                    </h2>
                                    <p className="text-green-100 mb-4">Education Professional</p>
                                    <div className="flex items-center space-x-2">
                                        <UserCheck className="h-4 w-4" />
                                        <span>Verified Educator</span>
                                    </div>
                                </div>
                                
                                <div className="w-full md:w-2/3 p-8">
                                    <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                                        <Award className="h-5 w-5 mr-2 text-green-600" />
                                        Educator Dashboard
                                    </h3>
                                    <p className="text-gray-600 mb-6">
                                        Create, manage, and distribute assignments to your students. 
                                        Track progress and provide timely feedback.
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <FileText className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Assignment Types</h4>
                                                <p className="text-sm text-gray-500">MCQ, Essays, and more</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <Clock className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Time Management</h4>
                                                <p className="text-sm text-gray-500">Set custom time limits</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <Link2 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Easy Sharing</h4>
                                                <p className="text-sm text-gray-500">Share via link or email</p>
                                            </div>
                                        </div>
                                        
                                        <div className="flex items-center">
                                            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                                                <BarChart3 className="h-5 w-5 text-green-600" />
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-gray-800">Analytics</h4>
                                                <p className="text-sm text-gray-500">Track student performance</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Controls Section */}
                    <div className="bg-white p-6 rounded-2xl shadow-lg mb-8 border border-green-100">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                            <Search className="h-5 w-5 mr-2 text-green-600" />
                            Find Assignments
                        </h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Search className="text-gray-400 h-5 w-5" />
                                </div>
                                <Input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search assignments..."
                                    className="pl-10 h-12 rounded-xl border-green-200 focus:border-green-400 focus:ring-green-400"
                                />
                            </div>

                            <Select value={sortOption} onValueChange={(value) => setSortOption(value as 'title' | 'questions')}>
                                <SelectTrigger className="h-12 rounded-xl border-green-200 focus:border-green-400 focus:ring-green-400">
                                    <div className="flex items-center">
                                        <SortAsc className="h-5 w-5 mr-2 text-gray-500" />
                                        <SelectValue placeholder="Sort by..." />
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-white border rounded-xl shadow-lg py-1"
                                    style={{
                                        zIndex: 9999,
                                        position: 'absolute',
                                        minWidth: '200px'
                                    }}
                                >
                                    <SelectItem value="title" className="rounded-lg my-1 hover:bg-green-50">Title</SelectItem>
                                    <SelectItem value="questions" className="rounded-lg my-1 hover:bg-green-50">Number of Questions</SelectItem>
                                </SelectContent>
                            </Select>


                            <Select value={assignmentType} onValueChange={(value) => setAssignmentType(value as 'quiz' | 'essay')}>
                                <SelectTrigger className="h-12 rounded-xl border-green-200 focus:border-green-400 focus:ring-green-400">
                                    <div className="flex items-center">
                                        <FileText className="h-5 w-5 mr-2 text-gray-500" />

                                        <SelectValue placeholder="Assignment type..." />
                                    </div>
                                </SelectTrigger>
                                <SelectContent
                                    className="bg-white border rounded-xl shadow-lg py-1"
                                    style={{
                                        zIndex: 9999,
                                        position: 'absolute',
                                        minWidth: '200px'
                                    }}
                                >
                                    <SelectItem value="quiz" className="rounded-lg my-1 hover:bg-green-50">Quiz</SelectItem>
                                    <SelectItem value="essay" className="rounded-lg my-1 hover:bg-green-50">Essay</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    {/* Table Section */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg overflow-hidden border border-green-100"
                    >
                        <div className="p-6 border-b border-green-100">
                            <h3 className="text-xl font-semibold text-gray-800 flex items-center">
                                <List className="h-5 w-5 mr-2 text-green-600" />
                                Your Assignments
                            </h3>
                        </div>
                        
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow className="bg-green-50">
                                        <TableHead className="w-[40%] font-semibold text-gray-700">Title</TableHead>
                                        <TableHead className="w-[20%] font-semibold text-gray-700">Questions</TableHead>
                                        <TableHead className="w-[40%] font-semibold text-gray-700">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {isLoading ? (
                                        Array(3).fill(0).map((_, index) => (
                                            <TableRow key={`skeleton-${index}`}>
                                                <TableCell>
                                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-3/4"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-1/3"></div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="h-6 bg-gray-200 rounded animate-pulse w-2/3"></div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    ) : filteredAssignments.length > 0 ? (
                                        filteredAssignments.map((assignment, index) => (
                                            <motion.tr
                                                key={assignment._id}
                                                initial={{ opacity: 0, y: 10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                                className="border-b border-gray-100 hover:bg-green-50/50 transition-colors"
                                            >
                                                <TableCell className="font-medium text-gray-800 py-4">
                                                    {assignment.title}
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                                        {assignment.questions.length} questions
                                                    </span>
                                                </TableCell>
                                                <TableCell className="py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => fetchQuiz(assignment._id, assignmentType)}
                                                            className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 rounded-lg transition-colors"
                                                        >
                                                            <Eye className="h-4 w-4" />
                                                            <span>View</span>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => getQuizLink(assignment._id)}
                                                            className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 rounded-lg transition-colors"
                                                        >
                                                            <Link2 className="h-4 w-4" />
                                                            <span>Share</span>
                                                        </Button>

                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => editQuiz(assignment._id)}
                                                            className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:bg-green-50 border-green-200 hover:border-green-300 rounded-lg transition-colors"
                                                        >
                                                            <Edit className="h-4 w-4" />
                                                            <span>Edit</span>
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </motion.tr>
                                        ))
                                    ) : (
                                        <TableRow>
                                            <TableCell colSpan={3} className="text-center py-12 text-gray-500">
                                                <div className="flex flex-col items-center">
                                                    <FileText className="h-12 w-12 text-gray-300 mb-3" />
                                                    <p className="text-lg font-medium text-gray-500 mb-1">No assignments found</p>
                                                    <p className="text-gray-400 mb-4">Create your first assignment to get started</p>
                                                    <Button 
                                                        onClick={() => router.push('/addingquiz')}
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                    >
                                                        <PlusCircle className="h-4 w-4 mr-2" />
                                                        Create Assignment
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}