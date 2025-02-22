'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, CheckCircle2, XCircle, ArrowLeft, Trophy, AlertTriangle, ChevronUp, ChevronDown } from 'lucide-react';
import { useQuiz } from '../../../../context/QuizContext';

interface Answer {
  questionId: string;
  selectedOption: string;
  selectedOptionText: string;
  questionText: string;
  _id: string;
  isCorrect?: boolean; // Added isCorrect property
}

interface QuizResult {
  score: number;
  timeTaken: number;
  answers: Answer[];
  submittedAt: string;
}
interface Violation {
  type: string;
  timestamp: Date;
  count?: number;
  key?: string;
}

interface ViolationData {
  _id: string;
  studentId: string;
  quizId: string;
  violation: Violation;
  createdAt: Date;
}

export default function ViewResult() {
  const { id, sid } = useParams();
  const { quiz } = useQuiz();
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [mcqData, setMcqData] = useState<Answer[]>([]);
  const [violations, setViolations] = useState<ViolationData[]>([]);
  const [showAllViolations, setShowAllViolations] = useState(false);
  const [showAllTimeline, setShowAllTimeline] = useState(false);
  const INITIAL_DISPLAY_COUNT = 3;
  const handleGoBack = () => {
    if (quiz) {
      router.push(`/viewResult/${quiz._id}`);
    }
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
        const response = await fetch(`${apiUrl}/api/v1/viewResult/${id}/student/${sid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();

        // Calculate if each answer is correct based on the score
        // Since score is 3 and we have 3 questions, each correct answer contributes 1 point
        // Filter out duplicate questions by keeping only the first occurrence of each questionId
        const uniqueAnswers = data.results.answers.reduce((acc: Answer[], current: Answer) => {
          const exists = acc.find(item => item.questionId === current.questionId);
          if (!exists) {
            acc.push(current);
          }
          return acc;
        }, []);

        // Process the unique answers
        const processedAnswers = uniqueAnswers.map((answer: Answer, index: number) => ({
          ...answer,
          isCorrect: index < data.results.score // Assuming score represents number of correct answers
        }));

        const processedResults = {
          ...data.results,
          answers: processedAnswers,
        };

        setQuizResults(processedResults);
        setMcqData(processedAnswers);
      } catch (error) {
        console.error('Failed to fetch quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id, sid]);
  useEffect(() => {
    const fetchViolations = async () => {
      const token = localStorage.getItem('token');
      let apiUrl = window.location.hostname === 'localhost'
        ? 'http://localhost:4000'
        : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;

      try {
        const response = await fetch(`${apiUrl}/api/v1/violations/${id}/student/${sid}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }

        const data = await response.json();
        setViolations(data.violations);
      } catch (error) {
        console.error('Failed to fetch violations:', error);
      }
    };

    fetchViolations();
  }, [id, sid]);
  const groupViolationsByType = (violations: ViolationData[]) => {
    return violations.reduce((acc, violation) => {
      const type = violation.violation.type;
      if (!acc[type]) {
        acc[type] = 0;
      }
      acc[type]++;
      return acc;
    }, {} as Record<string, number>);
  };
  return (
    <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
      {loading ? (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-pulse text-gray-500">Loading results...</div>
        </div>
      ) : quizResults ? (
        <div className="min-h-screen p-8">
          <div className="max-w-6xl mx-auto">
            {/* Header Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Quiz Results</h1>
                <button onClick={handleGoBack} className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors">
                  <ArrowLeft size={20} />
                  Back
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-blue-50 p-4 rounded-lg flex items-center gap-3">
                  <Trophy className="text-blue-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Score</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {(quizResults.score / mcqData.length * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
                  <Clock className="text-green-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Time Taken</p>
                    <p className="text-2xl font-bold text-green-600">
                      {quizResults.timeTaken.toFixed(2)} min
                    </p>
                  </div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg flex items-center gap-3">
                  <CheckCircle2 className="text-purple-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Questions</p>
                    <p className="text-2xl font-bold text-purple-600">{mcqData.length}</p>
                  </div>
                </div>
                <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
                  <AlertTriangle className="text-red-500" size={24} />
                  <div>
                    <p className="text-sm text-gray-600">Violations</p>
                    <p className="text-2xl font-bold text-red-600">{violations.length}</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Violations Section */}
            {violations.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Violation Details</h2>

                {/* Violation Types Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(groupViolationsByType(violations))
                    .slice(0, showAllViolations ? undefined : INITIAL_DISPLAY_COUNT)
                    .map(([type, count]) => (
                      <div key={type} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-700 font-medium">{type}</span>
                          <span className="bg-red-100 text-red-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                            {count} times
                          </span>
                        </div>
                      </div>
                    ))}
                </div>

                {/* Show More/Less Violations Button */}
                {Object.keys(groupViolationsByType(violations)).length > INITIAL_DISPLAY_COUNT && (
                  <button
                    onClick={() => setShowAllViolations(!showAllViolations)}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
                  >
                    {showAllViolations ? (
                      <>
                        Show Less <ChevronUp size={16} />
                      </>
                    ) : (
                      <>
                        Show More ({Object.keys(groupViolationsByType(violations)).length - INITIAL_DISPLAY_COUNT} more)
                        <ChevronDown size={16} />
                      </>
                    )}
                  </button>
                )}

                {/* Detailed Timeline */}
                <div className="mt-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Violation Timeline</h3>
                    <button
                      onClick={() => setShowAllTimeline(!showAllTimeline)}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      {showAllTimeline ? 'Show Recent Only' : 'Show All'}
                    </button>
                  </div>

                  <div className="space-y-4">
                    {/* Timeline Summary Card */}
                    <div className="bg-gray-50 p-4 rounded-lg mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-700">Total Violations</span>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full font-medium">
                          {violations.length}
                        </span>
                      </div>
                      <div className="mt-2 text-sm text-gray-600">
                        Last violation: {new Date(violations[0]?.violation.timestamp).toLocaleString()}
                      </div>
                    </div>

                    {/* Detailed Timeline Items */}
                    <div className="space-y-3">
                      {violations
                        .slice(0, showAllTimeline ? undefined : INITIAL_DISPLAY_COUNT)
                        .map((violation, index) => (
                          <div
                            key={violation._id}
                            className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="min-w-[100px] text-sm text-gray-500">
                              {new Date(violation.violation.timestamp).toLocaleTimeString()}
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-gray-900">{violation.violation.type}</p>
                                {violation.violation.count && (
                                  <span className="text-sm text-gray-500">
                                    (Occurrence #{violation.violation.count})
                                  </span>
                                )}
                              </div>
                              {violation.violation.key && (
                                <p className="text-sm text-gray-500 mt-1">Key: {violation.violation.key}</p>
                              )}
                            </div>
                            <div className="text-xs text-gray-400">
                              {new Date(violation.violation.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        ))}
                    </div>

                    {/* Show More/Less Timeline Button */}
                    {violations.length > INITIAL_DISPLAY_COUNT && (
                      <button
                        onClick={() => setShowAllTimeline(!showAllTimeline)}
                        className="w-full mt-4 py-2 text-blue-600 hover:text-blue-800 font-medium flex items-center justify-center gap-2 border border-blue-200 rounded-lg hover:bg-blue-50 transition-colors"
                      >
                        {showAllTimeline ? (
                          <>
                            Show Less <ChevronUp size={16} />
                          </>
                        ) : (
                          <>
                            Show More ({violations.length - INITIAL_DISPLAY_COUNT} more) <ChevronDown size={16} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}
            {/* Results Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Question
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Selected Answer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {mcqData.map((answer, index) => (
                      <tr key={answer._id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {answer.questionText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {answer.selectedOptionText}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {answer.isCorrect ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-green-100 text-green-800">
                              <CheckCircle2 size={14} />
                              Correct
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-sm bg-red-100 text-red-800">
                              <XCircle size={14} />
                              Incorrect
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p>No results found.</p>
      )}
    </div>
  );
}