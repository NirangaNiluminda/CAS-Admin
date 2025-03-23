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
import { PlusCircle, Eye, Link2, Edit, Search, SortAsc } from 'lucide-react';
import { toast } from "sonner";
import { Breadcrumbs } from '../components/ui/Breadcrumbs';
interface Assignment {
    _id: string;
    title: string;
    questions: { length: number }[];
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

    useEffect(() => {
        const fetchAssignments = async () => {
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
                        setAssignments(assignmentType === 'quiz' ? data.assignments : data.essayAssignments);
                    }
                } catch (error) {
                    console.error('Failed to fetch assignments', error);
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
        }
    };

    const getQuizLink = (id: string) => {
        const URL = `http://localhost:3001/signin/${id}`;
        navigator.clipboard.writeText(URL)
            .then(() => {
                // Show toast notification using sonner
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
        <div className="min-h-screen bg-gradient-to-b from-green-50 to-white p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                <Breadcrumbs items={[]} />
                <Card className="border-green-200 shadow-lg">
                    <CardContent className="p-6">
                        {/* Profile Section */}
                        <div className="flex flex-col items-center mb-8 space-y-4">
                            <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                                <h1 className="text-xl md:text-2xl font-bold text-white">
                                    {name ? name.charAt(0) : "A"}
                                </h1>
                            </div>
                            <div className="text-center">
                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
                                    Welcome Back
                                </h2>
                                <p className="text-lg md:text-xl text-gray-600">
                                    {name ? `Mr. ${name}` : "Mr. A.B.C. Perera"}
                                </p>
                            </div>
                        </div>

                        {/* Controls Section */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                            <div className="relative">
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
                                <Select value={sortOption} onValueChange={(value) => setSortOption(value as 'title' | 'questions')}>
                                    <SelectTrigger className="w-full">
                                        <SortAsc className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Sort by..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border rounded-md shadow-lg py-1"
                                        style={{
                                            zIndex: 9999,
                                            position: 'absolute',
                                            minWidth: '200px' /* Increase minimum width */
                                        }}
                                    >
                                        <SelectItem value="title">Title</SelectItem>
                                        <SelectItem value="questions" className="whitespace-nowrap">Number of Questions</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>



                            <div className="relative">
                                <Select value={assignmentType} onValueChange={(value) => setAssignmentType(value as 'quiz' | 'essay')}>
                                    <SelectTrigger className="w-full">
                                        <SortAsc className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Assignment type..." />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-white border rounded-md shadow-lg py-1"
                                        style={{
                                            zIndex: 9999,
                                            position: 'absolute',
                                            minWidth: '200px' /* Increase minimum width */
                                        }}
                                    >
                                        <SelectItem value="quiz">Quiz</SelectItem>
                                        <SelectItem value="essay">Essay</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Table Section */}
                        <div className="rounded-lg border overflow-hidden">
                            <div className="overflow-x-auto">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[40%]">Title</TableHead>
                                            <TableHead className="w-[20%]">Questions</TableHead>
                                            <TableHead className="w-[30%]">Actions</TableHead>
                                            <TableHead className="w-[10%] text-right">
                                                <TooltipProvider>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <Button
                                                                onClick={() => router.push('/addingquiz')}
                                                                variant="outline"
                                                                size="icon"
                                                                className="hover:bg-green-50"
                                                            >
                                                                <PlusCircle className="h-5 w-5 text-green-600" />
                                                            </Button>
                                                        </TooltipTrigger>
                                                        <TooltipContent>
                                                            <p>Add new assignment</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {filteredAssignments.length > 0 ? (
                                            filteredAssignments.map((assignment) => (
                                                <TableRow key={assignment._id} className="hover:bg-gray-50">
                                                    <TableCell className="font-medium">{assignment.title}</TableCell>
                                                    <TableCell>{assignment.questions.length}</TableCell>
                                                    <TableCell>
                                                        <div className="flex items-center space-x-2">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => fetchQuiz(assignment._id, assignmentType)}
                                                                className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:border-green-300 transition-colors"
                                                            >
                                                                <Eye className="h-4 w-4" />
                                                                <span className="hidden sm:inline">View</span>
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => getQuizLink(assignment._id)}
                                                                className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:border-green-300 transition-colors"
                                                            >
                                                                <Link2 className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Share</span>
                                                            </Button>

                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => editQuiz(assignment._id)}
                                                                className="flex items-center gap-1 text-gray-700 hover:text-green-700 hover:border-green-300 transition-colors"
                                                            >
                                                                <Edit className="h-4 w-4" />
                                                                <span className="hidden sm:inline">Edit</span>
                                                            </Button>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell></TableCell>
                                                </TableRow>
                                            ))
                                        ) : (
                                            <TableRow>
                                                <TableCell colSpan={4} className="text-center py-8 text-gray-500">
                                                    No assignments found
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}