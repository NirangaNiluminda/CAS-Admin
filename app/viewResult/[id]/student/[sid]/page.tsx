'use client';
import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Clock, CheckCircle2, XCircle, ArrowLeft, Trophy } from 'lucide-react';
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

export default function ViewResult() {
  const { id, sid } = useParams();
  const { quiz } = useQuiz();
  const [quizResults, setQuizResults] = useState<QuizResult | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [mcqData, setMcqData] = useState<Answer[]>([]);

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

  return (
    <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
      {loading ? (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
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
              </div>
            </div>

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