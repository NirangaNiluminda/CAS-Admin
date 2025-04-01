'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';
import { Button } from '@nextui-org/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { Download, ArrowLeft, Eye, FileSpreadsheet, BookOpen, User, Calendar, Clock, Check, X, Share2, Printer, Info, HelpCircle, BarChart3, Loader } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Progress } from "../components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../components/ui/tooltip";
import { motion } from "framer-motion";
import { useAdmin } from '../context/AdminContext';
import { Breadcrumbs } from '../components/ui/Breadcrumbs';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  createdAt?: string;
  timeLimit?: number;
  authorName?: string;
  authorId?: string;
  difficulty?: string;
  category?: string;
  totalAttempts?: number;
  averageScore?: number;
  questions: {
    questionText: string;
    options: {
      text: string;
      isCorrect: boolean;
      _id: string;
    }[];
  }[];
}

interface QuizStats {
  totalStudents: number;
  completedAttempts: number;
  averageScore: number;
  highestScore: number;
  completionRate: number;
  activeStudents: number;
}

export default function ViewQuiz() {
  const router = useRouter();
  const { admin } = useAdmin();
  const [name, setName] = useState('');
  const { id } = useParams();
  const { quiz } = useQuiz();
  const [activeTab, setActiveTab] = useState("overview");
  const [isStatsLoading, setIsStatsLoading] = useState(true);
  const [quizStats, setQuizStats] = useState<QuizStats>({
    totalStudents: 0,
    completedAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    completionRate: 0,
    activeStudents: 0
  });

  useEffect(() => {
    if (admin?.name) {
      setName(admin.name);
    }
  }, [admin]);

  // Consolidated useEffect for fetching quiz statistics
  useEffect(() => {
    // Fetch quiz statistics
    const fetchQuizStats = async () => {
      if (!quiz) return;
      
      setIsStatsLoading(true);
  
      try {
        let apiUrl;
        if (typeof window !== 'undefined') {
          apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:4000'
            : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
        }
  
        // Use the endpoint that doesn't require authorization
        const response = await fetch(`${apiUrl}/api/v1/stats/${quiz._id}`);
  
        if (response.ok) {
          const data = await response.json();
          console.log("Quiz stats data:", data);
          
          // Consistent calculation of total students and completion rate
          const activeCount = data.activeCount || 0;
          const completedCount = data.completedCount || 0;
          const totalStudents = activeCount + completedCount;
          const calculatedCompletionRate = totalStudents > 0 
            ? Math.round((completedCount / totalStudents) * 100) 
            : 0;
  
          // Update all stats in a single state update
          setQuizStats({
            totalStudents: totalStudents,
            completedAttempts: completedCount,
            averageScore: data.averageScore || 0,
            highestScore: data.highestScore || 0,
            completionRate: data.completionRate || calculatedCompletionRate,
            activeStudents: activeCount
          });
        }
      } catch (error) {
        console.error("Failed to fetch quiz statistics:", error);
      } finally {
        setIsStatsLoading(false);
      }
    };
  
    fetchQuizStats();
    
    // Set up interval to refresh stats every 10 seconds for live updates
    const statsInterval = setInterval(fetchQuizStats, 10000);
    
    return () => {
      clearInterval(statsInterval);
    };
  }, [quiz]);

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const handleDownloadExcel = async () => {
    if (!quiz) {
      console.error('Quiz data is not available');
      return;
    }

    const assignmentId = quiz._id;
    const token = localStorage.getItem('token');

    try {
      let apiUrl;
      if (typeof window !== 'undefined') {
        apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:4000'
          : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
      }
      const response = await fetch(`${apiUrl}/api/v1/downloadExcel/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quiz_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Failed to download Excel:", error);
    }
  };

  const handleFullDownloadExcel = async () => {
    if (!quiz) {
      console.error('Quiz data is not available');
      return;
    }

    const assignmentId = quiz._id;
    const token = localStorage.getItem('token');
    let apiUrl;
    if (typeof window !== 'undefined') {
      apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
    }
    try {
      const response = await fetch(`${apiUrl}/api/v1/downloadFullExcel/${assignmentId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quiz_${id}.xlsx`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (error) {
      console.error("Failed to download Excel:", error);
    }
  };

  const handlePrintQuiz = () => {
    window.print();
  };

  const handleShareQuiz = () => {
    const quizUrl = `http://localhost:3001/signin/${quiz._id}`;
    navigator.clipboard.writeText(quizUrl)
      .then(() => {
        // You would use your toast system here
        console.log("Quiz link copied to clipboard");
      })
      .catch(err => {
        console.error("Failed to copy link: ", err);
      });
  };

  const formatDate = (dateString: string | undefined): string => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  interface DifficultyColors {
    [key: string]: string;
  }

  const getDifficultyColor = (difficulty: string | undefined): string => {
    const difficultyColors: DifficultyColors = {
      easy: 'bg-green-100 text-green-700 border-green-200',
      medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      hard: 'bg-red-100 text-red-700 border-red-200',
    };

    return difficultyColors[difficulty?.toLowerCase() || ''] || 'bg-blue-100 text-blue-700 border-blue-200';
  };

  // Loading skeleton for the entire component
  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Breadcrumbs items={[{ label: 'Loading Quiz...' }]} />
          <Card className="backdrop-blur-sm bg-white/80 border-green-200 shadow-lg">
            <CardHeader>
              <Skeleton className="h-8 w-[250px]" />
              <Skeleton className="h-4 w-[300px]" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-[90%]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      {/* Decorative elements */}
      <div className="fixed top-20 left-20 w-64 h-64 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
      <div className="fixed top-40 right-20 w-72 h-72 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>

      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Breadcrumbs items={[{ label: quiz.title }]} />
          <Card className="backdrop-blur-sm bg-white/90 shadow-xl border border-green-200">
            <CardHeader className="space-y-4 pb-8">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleGoBack}
                  className="absolute left-4 hover:bg-green-50 border-0"
                >
                  <ArrowLeft className="h-5 w-5 text-green-600" />
                </Button>
                <div className="text-center mx-auto">
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-green-500 to-green-700 text-transparent bg-clip-text">
                    {quiz.title}
                  </CardTitle>
                  <div className="flex justify-center gap-2 mt-2">
                    <Badge variant="outline" className="text-green-700 border-green-300 bg-green-50">
                      <BookOpen className="h-4 w-4 mr-1" />
                      {quiz.questions.length} Questions
                    </Badge>
                    {quiz.difficulty && (
                      <Badge variant="outline" className={`${getDifficultyColor(quiz.difficulty)}`}>
                        {quiz.difficulty}
                      </Badge>
                    )}
                    {quiz.category && (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {quiz.category}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {quiz.description && (
                <CardDescription className="text-center mt-2 text-gray-600">
                  {quiz.description}
                </CardDescription>
              )}
            </CardHeader>

            {/* Enhanced Profile Section */}
            <div className="px-8 pb-6">
              <div className="rounded-xl bg-gradient-to-r from-green-50 to-emerald-50 p-6 border border-green-100 shadow-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-16 w-16 border-2 border-green-200 shadow-sm">
                      <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${name || 'Teacher'}`} />
                      <AvatarFallback className="bg-green-100 text-green-700">
                        {(name || 'T').charAt(0)}
                      </AvatarFallback>
                    </Avatar>

                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">
                        {name || "Teacher"}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1 text-green-600" />
                          <span>Created: {formatDate(quiz.createdAt)}</span>
                        </div>
                        {quiz.timeLimit && (
                          <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-green-600" />
                            <span>Time limit: {quiz.timeLimit} min</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-9 border border-green-200 hover:bg-green-100 text-green-700"
                            onClick={handleShareQuiz}
                          >
                            <Share2 className="h-4 w-4 mr-2" />
                            Share
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Copy quiz link to clipboard</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-9 border border-green-200 hover:bg-green-100 text-green-700"
                            onClick={handlePrintQuiz}
                          >
                            <Printer className="h-4 w-4 mr-2" />
                            Print
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Print quiz details</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            className="h-9 border border-green-200 hover:bg-green-100 text-green-700"
                            onClick={() => router.push(`/edit/${quiz._id}`)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Edit this quiz</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats Summary */}
            <div className="px-8 pb-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {/* Live Active Sessions Card */}
                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-yellow-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-yellow-100 rounded-lg p-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                    </div>
                    <Badge variant="outline" className="bg-yellow-50 text-yellow-600 flex items-center">
                      Live
                      {isStatsLoading && (
                        <div className="ml-2 h-3 w-3 rounded-full bg-yellow-500 animate-pulse"></div>
                      )}
                    </Badge>
                  </div>
                  {isStatsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold text-gray-800">{quizStats.activeStudents}</h4>
                  )}
                  <p className="text-sm text-gray-500">Currently taking</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-green-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-green-100 rounded-lg p-2">
                      <User className="h-5 w-5 text-green-600" />
                    </div>
                    <Badge variant="outline" className="bg-green-50 text-green-600 flex items-center">
                      Students
                      {isStatsLoading && (
                        <div className="ml-2 h-3 w-3 rounded-full bg-green-500 animate-pulse"></div>
                      )}
                    </Badge>
                  </div>
                  {isStatsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold text-gray-800">{quizStats.totalStudents}</h4>
                  )}
                  <p className="text-sm text-gray-500">Total students</p>
                </motion.div>

                <motion.div
                  whileHover={{ y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white rounded-xl p-4 shadow-sm border border-green-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="bg-blue-100 rounded-lg p-2">
                      <Check className="h-5 w-5 text-blue-600" />
                    </div>
                    <Badge variant="outline" className="bg-blue-50 text-blue-600 flex items-center">
                      Completion
                      {isStatsLoading && (
                        <div className="ml-2 h-3 w-3 rounded-full bg-blue-500 animate-pulse"></div>
                      )}
                    </Badge>
                  </div>
                  {isStatsLoading ? (
                    <Skeleton className="h-8 w-16 mt-1" />
                  ) : (
                    <h4 className="text-2xl font-bold text-gray-800">{quizStats.completedAttempts}</h4>
                  )}
                  <p className="text-sm text-gray-500">Completed attempts</p>
                </motion.div>
              </div>
            </div>

            <Separator className="bg-green-100" />

            {/* Tabs Section */}
            <div className="px-8 pt-6">
              <Tabs defaultValue="overview" className="w-full" onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 lg:grid-cols-3 mb-6">
                  <TabsTrigger value="overview" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                    <Info className="h-4 w-4 mr-2" />
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="questions" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                    <BookOpen className="h-4 w-4 mr-2" />
                    Questions
                  </TabsTrigger>
                  <TabsTrigger value="results" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-700">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Results
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="mt-0">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="md:col-span-2 space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quiz Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div>
                              <h4 className="text-sm font-medium text-gray-500">Description</h4>
                              <p className="text-gray-700">{quiz.description || "No description provided"}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Created</h4>
                                <p className="text-gray-700">{formatDate(quiz.createdAt)}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Time Limit</h4>
                                <p className="text-gray-700">{quiz.timeLimit ? `${quiz.timeLimit} minutes` : "No limit"}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Questions</h4>
                                <p className="text-gray-700">{quiz.questions.length}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-500">Category</h4>
                                <p className="text-gray-700">{quiz.category || "Uncategorized"}</p>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Completion Rate</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-sm text-gray-500">Progress</span>
                              {isStatsLoading ? (
                                <Skeleton className="h-4 w-16" />
                              ) : (
                                <span className="text-sm font-medium">{quizStats.completionRate}%</span>
                              )}
                            </div>
                            {isStatsLoading ? (
                              <Skeleton className="h-2 w-full" />
                            ) : (
                              <Progress value={quizStats.completionRate} className="h-2" />
                            )}
                            <p className="text-sm text-gray-500 mt-2">
                              {isStatsLoading ? (
                                <Skeleton className="h-4 w-full" />
                              ) : (
                                `${quizStats.completedAttempts} out of ${quizStats.totalStudents} students have completed this quiz.`
                              )}
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </div>

                    <div className="space-y-4">
                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2">
                            <Button
                              variant="ghost"
                              className="w-full justify-start border border-green-200 hover:bg-green-100 text-green-700 mb-2"
                              onClick={() => router.push(`/edit/${quiz._id}`)}
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              Edit Quiz
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start border border-green-200 hover:bg-green-100 text-green-700 mb-2"
                              onClick={() => router.push(`/viewResult/${quiz._id}`)}
                            >
                              <BarChart3 className="h-4 w-4 mr-2" />
                              View Results
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start border border-green-200 hover:bg-green-100 text-green-700 mb-2"
                              onClick={handleDownloadExcel}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Results
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start border border-green-200 hover:bg-green-100 text-green-700 mb-2"
                              onClick={handleFullDownloadExcel}
                            >
                              <Download className="h-4 w-4 mr-2" />
                              Download Full Results
                            </Button>
                            <Button
                              variant="ghost"
                              className="w-full justify-start border border-green-200 hover:bg-green-100 text-green-700"
                              onClick={handleShareQuiz}
                            >
                              <Share2 className="h-4 w-4 mr-2" />
                              Share Quiz
                            </Button>
                          </div>
                        </CardContent>
                      </Card>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">Quiz ID</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="p-3 bg-gray-50 rounded-md font-mono text-sm break-all">
                            {quiz._id}
                          </div>
                          <p className="text-xs text-gray-500 mt-2">Use this ID when reporting issues or requesting support.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="questions" className="mt-0">
                  <CardContent className="p-0">
                    <ScrollArea className="h-[60vh] rounded-lg border border-green-200 bg-white">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-gradient-to-r from-green-50 to-green-100">
                            <TableHead className="w-[50px] font-semibold text-green-700">No.</TableHead>
                            <TableHead className="font-semibold text-green-700">Question</TableHead>
                            <TableHead className="font-semibold text-green-700">Options</TableHead>
                            <TableHead className="w-[120px] font-semibold text-green-700 text-center">Correct Answer</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {quiz.questions.map((question, index) => (
                            <TableRow key={index} className="hover:bg-green-50/50 transition-colors">
                              <TableCell className="font-medium text-green-600">
                                {index + 1}
                              </TableCell>
                              <TableCell className="text-gray-700">
                                {question.questionText}
                              </TableCell>
                              <TableCell className="max-w-xl">
                                <div className="grid grid-cols-1 gap-2">
                                  {question.options.map((option) => (
                                    <div
                                      key={option._id}
                                      className={`p-2 rounded-md text-sm ${option.isCorrect
                                        ? 'bg-green-50 text-green-700 border border-green-200'
                                        : 'bg-gray-50 text-gray-600 border border-gray-200'
                                        }`}
                                    >
                                      {option.text}
                                    </div>
                                  ))}
                                </div>
                              </TableCell>
                              <TableCell className="text-center">
                                {question.options.find(opt => opt.isCorrect)?.text}
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </ScrollArea>
                  </CardContent>
                </TabsContent>

                <TabsContent value="results" className="mt-0">
                  <div className="text-center p-12">
                    <Button
                      variant="solid"
                      onClick={() => router.push(`/viewResult/${quiz._id}`)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      <BarChart3 className="h-4 w-4 mr-2" />
                      View Detailed Results
                    </Button>
                    <p className="text-sm text-gray-500 mt-4">
                      View comprehensive student performance analytics and individual responses
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <Separator className="bg-green-100 mt-6" />


          </Card>
        </motion.div>
      </div>
    </div>
  );
}