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
import { PlusCircle, Eye, Link2, Edit, Search, SortAsc, FileText, Clock, ChevronDown, MoreVertical, Filter, ArrowUpRight, Menu } from 'lucide-react';
import { toast } from "sonner";

interface Assignment {
    _id: string;
    title: string;
    questions: { length: number }[];
    batch?: string;
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
    const [loading, setLoading] = useState(true);
    const [batchFilter, setBatchFilter] = useState('all');
    const [isMobileView, setIsMobileView] = useState(false);

    // Available batch options
    const batchOptions = ['23rd', '24th', '25th'];

    // Helper to get a random batch
    const getRandomBatch = () => {
        return batchOptions[Math.floor(Math.random() * batchOptions.length)];
    };

    // Handle screen size changes
    useEffect(() => {
        const handleResize = () => {
            setIsMobileView(window.innerWidth < 768);
        };
        
        // Set initial value
        handleResize();
        
        // Add event listener
        window.addEventListener('resize', handleResize);
        
        // Clean up
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
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
                        // Add batch information to each assignment for demonstration
                        const assignmentsWithBatch = (assignmentType === 'quiz' ? data.assignments : data.essayAssignments)
                            .map((assignment: Assignment) => ({
                                ...assignment,
                                batch: getRandomBatch(),
                                createdAt: new Date(Date.now() - Math.random() * 10000000000).toISOString()
                            }));
                        setAssignments(assignmentsWithBatch);
                    }
                } catch (error) {
                    console.error('Failed to fetch assignments', error);
                    toast.error("Failed to load assignments");
                } finally {
                    setLoading(false);
                }
            } else {
                setLoading(false);
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

    // Format date to readable format
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const filteredAssignments = Array.isArray(assignments)
        ? assignments
            .filter(assignment =>
                assignment.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
                (batchFilter === 'all' || assignment.batch === batchFilter)
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

    // Get batch color for badges
    const getBatchColor = (batch: string) => {
        switch(batch) {
            case '23rd': return 'bg-blue-100 text-blue-800';
            case '24th': return 'bg-purple-100 text-purple-800';
            case '25th': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    // Get batch count for statistics
    const getBatchCount = (batchName: string) => {
        return assignments.filter(a => a.batch === batchName).length;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-2 sm:p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Card className="border-green-200 shadow-lg mb-4 sm:mb-8">
                    <CardContent className="p-3 sm:p-6">
                        {/* Profile Section - Responsive */}
                        <div className="flex flex-col items-center mb-4 sm:mb-8 space-y-2 sm:space-y-4">
                            <div className="w-16 h-16 sm:w-24 sm:h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                                    {name ? name.charAt(0) : "A"}
                                </h1>
                            </div>
                            <div className="text-center">
                                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
                                    Welcome Back
                                </h2>
                                <p className="text-base sm:text-lg md:text-xl text-gray-600">
                                    {name ? `Mr. ${name}` : "Mr. A.B.C. Perera"}
                                </p>
                            </div>
                        </div>

                        {/* Stats Cards - Responsive Grid */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-8">
                            <Card className="border border-blue-200 shadow-sm bg-white">
                                <CardContent className="p-3 sm:p-6 flex items-center">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-blue-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <FileText className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs sm:text-sm">23rd Batch</p>
                                        <h3 className="text-xl sm:text-2xl font-bold">{getBatchCount('23rd')}</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-purple-200 shadow-sm bg-white">
                                <CardContent className="p-3 sm:p-6 flex items-center">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-purple-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <Clock className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs sm:text-sm">24th Batch</p>
                                        <h3 className="text-xl sm:text-2xl font-bold">{getBatchCount('24th')}</h3>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border border-green-200 shadow-sm bg-white sm:col-span-2 md:col-span-1">
                                <CardContent className="p-3 sm:p-6 flex items-center">
                                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-full bg-green-100 flex items-center justify-center mr-3 sm:mr-4">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-gray-500 text-xs sm:text-sm">25th Batch</p>
                                        <h3 className="text-xl sm:text-2xl font-bold">{getBatchCount('25th')}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Controls Section - Responsive Stack */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 mb-4 sm:mb-8">
                            <div className="relative col-span-1 sm:col-span-2 md:col-span-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    type="text"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    placeholder="Search assignments..."
                                    className="pl-10"
                                />
                            </div>

                            <div className="relative">
                                <Select value={assignmentType} onValueChange={(value) => setAssignmentType(value as 'quiz' | 'essay')}>
                                    <SelectTrigger className="w-full">
                                        <FileText className="h-4 w-4 mr-2 text-gray-500" />
                                        <SelectValue placeholder="Assignment type..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border rounded-md shadow-lg py-1"
                                        style={{
                                            zIndex: 9999,
                                            position: 'absolute',
                                            minWidth: '200px'
                                        }}
                                    >
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="essay">Essay</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="relative">
                                <Select value={batchFilter} onValueChange={setBatchFilter}>
                                    <SelectTrigger className="w-full">
                                        <Filter className="h-4 w-4 mr-2 text-gray-500" />
                                        <SelectValue placeholder="Filter by batch..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border rounded-md shadow-lg py-1"
                                        style={{
                                            zIndex: 9999,
                                            position: 'absolute',
                                            minWidth: '200px'
                                        }}
                                    >
                                        <SelectItem value="all">All Batches</SelectItem>
                                        <SelectItem value="23rd">23rd Batch</SelectItem>
                                        <SelectItem value="24th">24th Batch</SelectItem>
                                        <SelectItem value="25th">25th Batch</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table Section - Responsive */}
                        <div className="rounded-lg border overflow-hidden">
                            <div className="bg-white py-3 sm:py-4 px-3 sm:px-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-b gap-3">
                                <h2 className="text-lg sm:text-xl font-semibold text-gray-800">Assignment List</h2>
                                <Button 
                                    onClick={() => router.push('/addingquiz')}
                                    className="bg-green-600 hover:bg-green-700 text-white w-full sm:w-auto"
                                >
                                    <PlusCircle className="h-4 w-4 mr-2" />
                                    New Assignment
                                </Button>
                            </div>
                            <div className="overflow-x-auto">
                                {loading ? (
                                    <div className="flex justify-center items-center p-8">
                                        <div className="h-8 w-8 border-4 border-t-green-600 border-r-green-600 border-b-green-200 border-l-green-200 rounded-full animate-spin"></div>
                                        <span className="ml-3 text-gray-500">Loading assignments...</span>
                                    </div>
                                ) : (
                                    <>
                                        {/* Desktop Table View */}
                                        <div className="hidden md:block">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="bg-gray-50">
                                                        <TableHead className="w-[30%]">Title</TableHead>
                                                        <TableHead className="w-[15%]">Type</TableHead>
                                                        <TableHead className="w-[15%]">Questions</TableHead>
                                                        <TableHead className="w-[15%]">Batch</TableHead>
                                                        <TableHead className="w-[15%]">Created</TableHead>
                                                        <TableHead className="w-[10%] text-right">Actions</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {filteredAssignments.length > 0 ? (
                                                        filteredAssignments.map((assignment) => (
                                                            <TableRow 
                                                                key={assignment._id} 
                                                                className="hover:bg-gray-50 cursor-pointer"
                                                                onClick={() => fetchQuiz(assignment._id, assignmentType)}
                                                            >
                                                                <TableCell className="font-medium text-green-700">
                                                                    <div className="flex items-center">
                                                                        {assignment.title}
                                                                        <ArrowUpRight className="h-4 w-4 ml-1 text-gray-400" />
                                                                    </div>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignmentType === 'quiz' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                                                                        {assignmentType === 'quiz' ? 'Quiz' : 'Essay'}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>{assignment.questions.length}</TableCell>
                                                                <TableCell>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchColor(assignment.batch || '')}`}>
                                                                        {assignment.batch}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell className="text-gray-500 text-sm">
                                                                    {assignment.createdAt ? formatDate(assignment.createdAt) : 'N/A'}
                                                                </TableCell>
                                                                <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
                                                                    <div className="flex items-center justify-end space-x-2">
                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                fetchQuiz(assignment._id, assignmentType);
                                                                            }}
                                                                            className="text-blue-600 border-blue-200 hover:bg-blue-50"
                                                                        >
                                                                            <Eye className="h-4 w-4" />
                                                                        </Button>

                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                editQuiz(assignment._id);
                                                                            }}
                                                                            className="text-amber-600 border-amber-200 hover:bg-amber-50"
                                                                        >
                                                                            <Edit className="h-4 w-4" />
                                                                        </Button>

                                                                        <Button
                                                                            variant="outline"
                                                                            size="sm"
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                getQuizLink(assignment._id);
                                                                            }}
                                                                            className="text-green-600 border-green-200 hover:bg-green-50"
                                                                        >
                                                                            <Link2 className="h-4 w-4" />
                                                                        </Button>
                                                                    </div>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                                                                {searchTerm || batchFilter !== 'all' ? 'No assignments match your search criteria' : 'No assignments found'}
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>
                                        </div>

                                        {/* Mobile Card View */}
                                        <div className="md:hidden">
                                            {filteredAssignments.length > 0 ? (
                                                <div className="divide-y">
                                                    {filteredAssignments.map((assignment) => (
                                                        <div 
                                                            key={assignment._id}
                                                            className="p-4 hover:bg-gray-50 cursor-pointer"
                                                            onClick={() => fetchQuiz(assignment._id, assignmentType)}
                                                        >
                                                            <div className="flex justify-between items-start mb-2">
                                                                <div className="font-medium text-green-700 flex items-center">
                                                                    {assignment.title}
                                                                    <ArrowUpRight className="h-4 w-4 ml-1 text-gray-400" />
                                                                </div>
                                                                <div 
                                                                    className="flex space-x-1" 
                                                                    onClick={(e) => e.stopPropagation()}
                                                                >
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            fetchQuiz(assignment._id, assignmentType);
                                                                        }}
                                                                        className="h-8 w-8 p-0 text-blue-600 border-blue-200"
                                                                    >
                                                                        <Eye className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            editQuiz(assignment._id);
                                                                        }}
                                                                        className="h-8 w-8 p-0 text-amber-600 border-amber-200"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </Button>
                                                                    <Button
                                                                        variant="outline"
                                                                        size="sm"
                                                                        onClick={(e) => {
                                                                            e.stopPropagation();
                                                                            getQuizLink(assignment._id);
                                                                        }}
                                                                        className="h-8 w-8 p-0 text-green-600 border-green-200"
                                                                    >
                                                                        <Link2 className="h-4 w-4" />
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                            <div className="grid grid-cols-2 gap-2 text-sm">
                                                                <div className="flex items-center">
                                                                    <span className="text-gray-500 mr-2">Type:</span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${assignmentType === 'quiz' ? 'bg-indigo-100 text-indigo-800' : 'bg-pink-100 text-pink-800'}`}>
                                                                        {assignmentType === 'quiz' ? 'Quiz' : 'Essay'}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="text-gray-500 mr-2">Questions:</span>
                                                                    <span>{assignment.questions.length}</span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="text-gray-500 mr-2">Batch:</span>
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getBatchColor(assignment.batch || '')}`}>
                                                                        {assignment.batch}
                                                                    </span>
                                                                </div>
                                                                <div className="flex items-center">
                                                                    <span className="text-gray-500 mr-2">Created:</span>
                                                                    <span className="text-gray-700 text-xs">
                                                                        {assignment.createdAt ? formatDate(assignment.createdAt) : 'N/A'}
                                                                    </span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            ) : (
                                                <div className="text-center py-8 text-gray-500">
                                                    {searchTerm || batchFilter !== 'all' ? 'No assignments match your search criteria' : 'No assignments found'}
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}