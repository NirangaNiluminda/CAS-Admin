'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Separator } from '../../components/ui/separator';
import { Download, ArrowLeft, Eye, Search, SortAsc, SortDesc, AlertTriangle, TvMinimalIcon } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Input } from '../../components/ui/input';
import { Users, Trophy, Clock, BarChart3 } from 'lucide-react';

// Add SWR for data fetching and caching
import useSWR from 'swr';

interface QuizResult {
  _id: string;
  registrationNumber: string;
  score: number;
  timeTaken: number;
  userId: string;
  violationCount?: number;
}

interface ViolationSummary {
  _id: string;  // studentId
  studentName: string;
  totalViolations: number;
  violationTypes: string[];
}

// Create a custom fetcher function
const fetcher = async (url: string) => {
  const token = localStorage.getItem('token');
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    throw new Error(`Error: ${response.statusText}`);
  }
  
  return response.json();
};

// Create a function to get API URL
const getApiUrl = () => {
  if (typeof window !== 'undefined') {
    return window.location.hostname === 'localhost'
      ? 'http://localhost:4000'
      : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
  }
  return '';
};

const StatsCard = ({ icon: Icon, label, value, bgColor }: {
  icon: any;
  label: string;
  value: string | number;
  bgColor: string;
}) => (
  <div className={`${bgColor} p-4 rounded-lg flex items-center gap-3 border border-green-200`}>
    <div className="p-2 bg-white/90 rounded-lg">
      <Icon className="w-5 h-5 text-green-600" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold text-green-700">{value}</p>
    </div>
  </div>
);

const SortIcon = ({ column, sortConfig }: {
  column: keyof QuizResult;
  sortConfig: {
    key: keyof QuizResult | null;
    direction: 'asc' | 'desc'
  };
}) => {
  if (sortConfig.key !== column) return null;
  return sortConfig.direction === 'asc' ? (
    <SortAsc className="ml-1 w-4 h-4 text-green-600" />
  ) : (
    <SortDesc className="ml-1 w-4 h-4 text-green-600" />
  );
};

// Helper functions for score colors
function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-green-400';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-green-600';
  if (score >= 40) return 'text-yellow-700';
  return 'text-red-700';
}

function getViolationStyle(count: number): string {
  if (count === 0) return 'bg-green-100 text-green-800';
  if (count <= 5) return 'bg-yellow-100 text-yellow-800';
  return 'bg-red-100 text-red-800';
}

export default function ViewResult() {
  const { id } = useParams();
  const router = useRouter();
  const { quiz } = useQuiz();
  const [searchTerm, setSearchTerm] = useState('');
  const [totalQuestions, setTotalQuestions] = useState(0);
  const apiUrl = getApiUrl();

  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuizResult | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // Use SWR for caching and data fetching
  const { data: resultsData, error: resultsError, isLoading: isResultsLoading } = 
    useSWR(`${apiUrl}/api/v1/results/${id}`, fetcher, {
      revalidateOnFocus: false,  // Don't refetch when window gets focus
      dedupingInterval: 60000,   // Dedupe requests within 1 minute
      focusThrottleInterval: 60000  // Throttle focus events to 1 minute
    });

  const { data: violationsData, error: violationsError, isLoading: isViolationsLoading } = 
    useSWR(`${apiUrl}/api/v1/violations/${id}/summary`, fetcher, {
      revalidateOnFocus: false,
      dedupingInterval: 60000,
      focusThrottleInterval: 60000
    });

  // Derived state
  const quizResults = resultsData?.results || [];
  const violationSummary = violationsData?.summary || [];
  const totalViolations = violationSummary.reduce(
    (sum: number, student: ViolationSummary) => sum + student.totalViolations, 0
  );
  
  const averageScore = quizResults.length > 0 
    ? Math.round(quizResults.reduce((acc: number, curr: QuizResult) => acc + curr.score, 0) / quizResults.length)
    : 0;

  const averageTime = quizResults.length > 0
    ? Number((quizResults.reduce((acc: number, curr: QuizResult) => acc + curr.timeTaken, 0) / quizResults.length).toFixed(1))
    : 0;

  const loading = isResultsLoading || isViolationsLoading;
  const error = resultsError || violationsError;

  // Set total questions when quiz data is available
  useEffect(() => {
    if (quiz?.questions?.length) {
      setTotalQuestions(quiz.questions.length);
    }
  }, [quiz]);

  const handleGoBack = () => {
    router.push('/viewquiz');
  };

  const handleDownloadExcel = async () => {
    if (!quiz) {
      console.error('Quiz data is not available');
      return;
    }

    const assignmentId = quiz._id;
    const token = localStorage.getItem('token');

    try {
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

  const handleSort = (key: keyof QuizResult) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const getViolationCount = useCallback((userId: string): number => {
    const studentViolation: ViolationSummary | undefined = violationSummary.find((v: ViolationSummary) => v._id === userId);
    return studentViolation?.totalViolations || 0;
  }, [violationSummary]);

  interface SortConfig {
    key: keyof QuizResult | null;
    direction: 'asc' | 'desc';
  }

  const filteredResults: QuizResult[] = quizResults
    .filter((result: QuizResult) =>
      result.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.score.toString().includes(searchTerm)
    )
    .sort((a: QuizResult, b: QuizResult) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue !== undefined && bValue !== undefined) {
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 border border-green-200 shadow-lg">
            <CardHeader>
              <div className="animate-pulse h-8 w-48 bg-green-200 rounded mb-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="h-4 bg-green-200 rounded w-1/4" />
                    <div className="h-4 bg-green-200 rounded w-1/4" />
                    <div className="h-4 bg-green-200 rounded w-1/4" />
                    <div className="h-4 bg-green-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/90 p-8 text-center border border-green-200 shadow-lg">
            <CardTitle className="text-red-600 mb-4">Error Loading Data</CardTitle>
            <p className="text-gray-700">There was a problem fetching the quiz results. Please try again later.</p>
            <Button className="mt-4 bg-green-600 hover:bg-green-700 text-white" onClick={handleGoBack}>Go Back</Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border border-green-200">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoBack}
                className="hover:bg-green-50"
              >
                <ArrowLeft className="h-5 w-5 text-green-600" />
              </Button>
              <CardTitle className="text-3xl font-bold text-center mx-auto bg-gradient-to-r from-green-600 to-green-700 text-transparent bg-clip-text">
                {quiz ? quiz.title : 'Loading...'}
              </CardTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.push('/dashboard')}
                className="hover:bg-green-50"
              >
                <TvMinimalIcon className="h-5 w-5 text-green-600" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <StatsCard
                icon={Users}
                label="Total Students"
                value={quizResults.length}
                bgColor="bg-green-50"
              />
              <StatsCard
                icon={Trophy}
                label="Average Score"
                value={`${averageScore}`}
                bgColor="bg-green-50"
              />
              <StatsCard
                icon={Clock}
                label="Average Time"
                value={`${averageTime} min`}
                bgColor="bg-green-50"
              />
              <StatsCard
                icon={BarChart3}
                label="Pass Rate"
                value={`${Math.round((quizResults.filter((r: QuizResult) => (r.score / totalQuestions) * 100 >= 40).length / quizResults.length) * 100)}%`}
                bgColor="bg-green-50"
              />
            </div>
            <div className="flex items-center justify-between mt-6 gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search students..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9 bg-white border-green-200 focus:border-green-300"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadExcel}
                className="border-green-200 hover:bg-green-100 text-green-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>

          <Separator className="bg-green-100" />

          <CardContent className="p-8">
            <ScrollArea className="h-[60vh] rounded-lg border border-green-200 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-green-50 to-green-100">
                    <TableHead
                      className="font-semibold text-green-700 cursor-pointer"
                      onClick={() => handleSort('registrationNumber')}
                    >
                      <div className="flex items-center">
                        Student
                        <SortIcon column="registrationNumber" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-green-700 cursor-pointer"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center">
                        Score
                        <SortIcon column="score" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-green-700 cursor-pointer"
                      onClick={() => handleSort('timeTaken')}
                    >
                      <div className="flex items-center">
                        Time Taken
                        <SortIcon column="timeTaken" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 cursor-pointer">
                      <div className="flex items-center">
                        Violations
                        <SortIcon column="violationCount" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-green-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result: QuizResult) => (
                    <TableRow key={result._id} className="hover:bg-green-50/50 transition-colors">
                      <TableCell className="font-medium text-gray-700">
                        {result.registrationNumber}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium" style={{ color: getScoreTextColor(result.score) }}>
                            {result.score}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-600">
                        {result.timeTaken.toFixed(1)} min
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${getViolationStyle(getViolationCount(result.userId))}`}>
                            {getViolationCount(result.userId)}
                          </span>
                          {getViolationCount(result.userId) > 5 && (
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => quiz && router.push(`/viewResult/${quiz._id}/student/${result.userId}`)}
                          className="bg-green-100 hover:bg-green-200 text-green-700"
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </ScrollArea>
          </CardContent>

          <Separator className="bg-green-100" />

          <CardFooter className="p-8 flex justify-between items-center bg-gradient-to-r from-green-50 to-green-100">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-green-600">{filteredResults.length}</span> results
              {searchTerm && (
                <> filtered from <span className="font-medium text-green-600">{quizResults.length}</span> total results</>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}