'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '../../context/QuizContext';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../../components/ui/table';
import { Separator } from '../../components/ui/separator';
import { Download, ArrowLeft, Eye, Search, SortAsc, SortDesc, AlertTriangle } from 'lucide-react';
import { ScrollArea } from '../../components/ui/scroll-area';
import { Input } from '../../components/ui/input';
import { Progress } from '../../components/ui/progress';

import { Users, Trophy, Clock, BarChart3 } from 'lucide-react';

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
const StatsCard = ({ icon: Icon, label, value, bgColor }: {
  icon: any;
  label: string;
  value: string | number;
  bgColor: string;
}) => (
  <div className={`${bgColor} p-4 rounded-lg flex items-center gap-3`}>
    <div className="p-2 bg-white/90 rounded-lg">
      <Icon className="w-5 h-5 text-blue-600" />
    </div>
    <div>
      <p className="text-sm text-gray-600">{label}</p>
      <p className="text-xl font-bold text-blue-700">{value}</p>
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
    <SortAsc className="ml-1 w-4 h-4 text-blue-600" />
  ) : (
    <SortDesc className="ml-1 w-4 h-4 text-blue-600" />
  );
};
// Helper functions for score colors
function getScoreColor(score: number): string {
  if (score >= 80) return 'bg-green-500';
  if (score >= 60) return 'bg-blue-500';
  if (score >= 40) return 'bg-yellow-500';
  return 'bg-red-500';
}

function getScoreTextColor(score: number): string {
  if (score >= 80) return 'text-green-700';
  if (score >= 60) return 'text-blue-700';
  if (score >= 40) return 'text-yellow-700';
  return 'text-red-700';
}
export default function ViewResult() {
  const { id } = useParams();
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { quiz } = useQuiz();
  const [averageScore, setAverageScore] = useState(0);
  const [averageTime, setAverageTime] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [violationSummary, setViolationSummary] = useState<ViolationSummary[]>([]);
  const [totalViolations, setTotalViolations] = useState(0);

  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuizResult | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

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

  const handleSort = (key: keyof QuizResult) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc',
    });
  };

  const filteredResults = quizResults
    .filter(result =>
      result.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.userId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      result.score.toString().includes(searchTerm)
    )
    .sort((a, b) => {
      if (!sortConfig.key) return 0;
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
    const getViolationStyle = (count: number): string => {
      if (count === 0) return 'bg-green-100 text-green-800';
      if (count <= 5) return 'bg-yellow-100 text-yellow-800';
      return 'bg-red-100 text-red-800';
    };
    
  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      let apiUrl;

      if (typeof window !== 'undefined') {
        apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:4000'
          : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
      }

      try {
        const response = await fetch(`${apiUrl}/api/v1/results/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setQuizResults(data.results);

        if (data.results.length > 0) {
          const totalQ = quiz?.questions.length || 3;  // Default to 3 if quiz is undefined
          setTotalQuestions(totalQ);

          const avgScore = data.results.reduce((acc: number, curr: QuizResult) => acc + curr.score, 0) / data.results.length;
          setAverageScore(Math.round(avgScore));

          const avgTime = data.results.reduce((acc: number, curr: QuizResult) => acc + curr.timeTaken, 0) / data.results.length;
          setAverageTime(Number(avgTime.toFixed(1)));

          // **Calculate Pass Rate Correctly**
          const passThreshold = 0.4; // 40%
          const passingStudents: number = data.results.filter((result: QuizResult) => (result.score / totalQ) >= passThreshold).length;
          const passRate = ((passingStudents / data.results.length) * 100).toFixed(2); // Keep two decimal places

          console.log("Corrected Pass Rate:", passRate);
        }
      } catch (error) {
        console.error('Failed to fetch quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, quiz?.questions.length]);
  useEffect(() => {
    const fetchResultsAndViolations = async () => {
      const token = localStorage.getItem('token');
      let apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

      try {
        // Fetch quiz results
        const resultsResponse = await fetch(`${apiUrl}/api/v1/results/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Fetch violations summary
        const violationsResponse = await fetch(`${apiUrl}/api/v1/violations/${id}/summary`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!resultsResponse.ok || !violationsResponse.ok) {
          throw new Error('Failed to fetch data');
        }

        const resultsData = await resultsResponse.json();
        const violationsData = await violationsResponse.json();

        

        
        setViolationSummary(violationsData.summary);
        const total = violationsData.summary.reduce(
          (sum: number, student: ViolationSummary) => sum + student.totalViolations, 
          0
        );
        setTotalViolations(total);

        // Calculate other stats...
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResultsAndViolations();
  }, [id]);
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/90">
            <CardHeader>
              <div className="animate-pulse h-8 w-48 bg-blue-200 rounded mb-4" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse flex space-x-4">
                    <div className="h-4 bg-blue-200 rounded w-1/4" />
                    <div className="h-4 bg-blue-200 rounded w-1/4" />
                    <div className="h-4 bg-blue-200 rounded w-1/4" />
                    <div className="h-4 bg-blue-200 rounded w-1/4" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
  const getViolationCount = (userId: string): number => {
    const studentViolation = violationSummary.find(v => v._id === userId);
    return studentViolation?.totalViolations || 0;
  };
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border border-indigo-100">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                size="icon"
                onClick={handleGoBack}
                className="hover:bg-blue-50"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </Button>
              <CardTitle className="text-3xl font-bold text-center mx-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                {quiz ? quiz.title : 'Loading...'}
              </CardTitle>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
              <StatsCard
                icon={Users}
                label="Total Students"
                value={quizResults.length}
                bgColor="bg-blue-50"
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
                bgColor="bg-yellow-50"
              />
              <StatsCard
                icon={BarChart3}
                label="Pass Rate"
                value={`${Math.round((quizResults.filter(r => (r.score / totalQuestions) * 100 >= 40).length / quizResults.length) * 100)}%`}
                bgColor="bg-purple-50"
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
                  className="pl-9 bg-white border-indigo-100 focus:border-blue-300"
                />
              </div>
              <Button
                variant="outline"
                onClick={handleDownloadExcel}
                className="border-blue-200 hover:bg-blue-100 text-blue-700"
              >
                <Download className="h-4 w-4 mr-2" />
                Export Results
              </Button>
            </div>
          </CardHeader>

          <Separator className="bg-indigo-100" />

          <CardContent className="p-8">
            <ScrollArea className="h-[60vh] rounded-lg border border-indigo-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableHead
                      className="font-semibold text-blue-700 cursor-pointer"
                      onClick={() => handleSort('registrationNumber')}
                    >
                      <div className="flex items-center">
                        Student
                        <SortIcon column="registrationNumber" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-blue-700 cursor-pointer"
                      onClick={() => handleSort('score')}
                    >
                      <div className="flex items-center">
                        Score
                        <SortIcon column="score" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead
                      className="font-semibold text-blue-700 cursor-pointer"
                      onClick={() => handleSort('timeTaken')}
                    >
                      <div className="flex items-center">
                        Time Taken
                        <SortIcon column="timeTaken" sortConfig={sortConfig} />
                      </div>
                    </TableHead>
                    <TableHead className="font-semibold text-blue-700 cursor-pointer">
          <div className="flex items-center">
            Violations
            <SortIcon column="violationCount" sortConfig={sortConfig} />
          </div>
        </TableHead>
                    <TableHead className="font-semibold text-blue-700 text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResults.map((result) => (
                    <TableRow key={result._id} className="hover:bg-blue-50/50 transition-colors">
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
              <span className={`px-2.5 py-0.5 rounded-full text-sm font-medium ${
                getViolationStyle(getViolationCount(result.userId))
              }`}>
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
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700"
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

          <Separator className="bg-indigo-100" />

          <CardFooter className="p-8 flex justify-between items-center bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="text-sm text-gray-600">
              Showing <span className="font-medium text-blue-600">{filteredResults.length}</span> results
              {searchTerm && (
                <> filtered from <span className="font-medium text-blue-600">{quizResults.length}</span> total results</>
              )}
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}

