// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { useQuiz } from '@/app/context/QuizContext';
// import { Button } from '@nextui-org/button';

// export default function ViewResult() {
//   const { id } = useParams(); // Get quiz ID from URL
//   const [quizResults, setQuizResults] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const router = useRouter();
//   const { quiz } = useQuiz();
 
//   const [searchTerm, setSearchTerm] = useState('');  // State for search term'

//   useEffect(() => {
//     const fetchResults = async () => {
//       const token = localStorage.getItem('token');
//       let apiUrl;

//       if (typeof window !== 'undefined') {
//         apiUrl =
//           window.location.hostname === 'localhost'
//             ? 'http://localhost:4000'
//             : process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
//       }

//       try {
//         const response = await fetch(`${apiUrl}/api/v1/results/${id}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setQuizResults(data.results); // Store the results array
//         console.log('Quiz Results:',data._id);
//       } catch (error) {
//         console.error('Failed to fetch quiz results:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [id]);

//   return (
//     <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
     
//       <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
//       {loading ? (
//         <p>Loading results...</p>
//       ) : quizResults.length > 0 ? (
//         <div className="w-full overflow-x-auto">
//           <table className="min-w-full bg-white border border-gray-300">
//             <thead>
//               <tr className="bg-gray-100 border-b">
//                 <th className="py-2 px-4 text-left">Student</th>
//                 <th className="py-2 px-4 text-left">Score</th>
//                 <th className="py-2 px-4 text-left">Time Taken (minutes)</th>
//                 <th className="py-2 px-4 text-left">ID</th>
//                 <th className="py-2 px-4 text-left">Action</th> {/* Added Action column */}
//               </tr>
//             </thead>
//             <tbody>
//               {quizResults.map((result) => (

//                 <tr key={result._id} className="border-b">
//                   <td className="py-2 px-4">{result.registrationNumber}</td>
//                   <td className="py-2 px-4">{result.score}</td>
//                   <td className="py-2 px-4">{result.timeTaken.toFixed(2)}</td>
//                   <td className="py-2 px-4">{result.userId}</td>
//                   <td className="py-2 px-4">
//                     {/* Button for navigating to result details */}
//                     <Button
//                       className="px-4 py-2"
//                       color="primary"
//                       variant="flat"
//                       onClick={() => quiz && router.push(`/viewResult/${quiz._id}/student/${result.userId}`)} // Use result.userId instead of result._id
//                     >
//                       View Details
//                     </Button>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       ) : (
//         <p>No results found.</p>
//       )}
//       <button
//         onClick={() => router.push('/dashboard')}
//         className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
//       >
//         Back to Dashboard
//       </button>
//     </div>
//   );
// }
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/app/context/QuizContext';
import { Button } from '@nextui-org/button';
import { Search, ArrowLeft, Download, SortAsc, SortDesc } from 'lucide-react';

const SortIcon = ({ column, sortConfig }: { column: keyof QuizResult, sortConfig: { key: keyof QuizResult | null, direction: 'asc' | 'desc' } }) => {
  return (
    <>
      {sortConfig.key === column ? (
        sortConfig.direction === 'asc' ? (
          <SortAsc className="ml-1 w-4 h-4" />
        ) : (
          <SortDesc className="ml-1 w-4 h-4" />
        )
      ) : null}
    </>
  );
};
import { Result } from 'postcss';
interface QuizResult {
  _id: string;
  registrationNumber: string;
  score: number;
  timeTaken: number;
  userId: string;
}

export default function ViewResult() {
  const { id } = useParams(); // Get quiz ID from URL
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { quiz } = useQuiz();
  
  
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{
    key: keyof QuizResult | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });
  

  const handleDownloadExcel = async () => {
    if (!quiz) {
      console.error('Quiz data is not available');
      return;
    }

    const assignmentId = quiz._id;
    const token = localStorage.getItem('token');

    try {
      let apiUrl;
      // Determine the correct API URL based on the hostname
      if (typeof window !== 'undefined') {
        if (window.location.hostname === 'localhost') {
          apiUrl = 'http://localhost:4000';
        } else {
          apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
          console.log('Deployment URL:', apiUrl);
        }
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

      // Assuming the API returns a file for download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Quiz_${id}.xlsx`; // Customize the filename
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
      direction: 
        sortConfig.key === key && sortConfig.direction === 'asc' 
          ? 'desc' 
          : 'asc',
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


  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      let apiUrl;

      if (typeof window !== 'undefined') {
        apiUrl =
          window.location.hostname === 'localhost'
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
        setQuizResults(data.results); // Store the results array
        console.log('Quiz Results:',data._id);
      } catch (error) {
        console.error('Failed to fetch quiz results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Quiz Results</h2>
            <button
              onClick={() => router.push('/dashboard')}
              className="inline-flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Search and Actions */}
        <div className="px-6 py-4 border-b border-gray-200 bg-gray-50">
          <div className="flex items-center justify-between">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleDownloadExcel}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Results
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('registrationNumber')}
                >
                  <div className="flex items-center">
                    Student
                    <SortIcon column="registrationNumber" sortConfig={sortConfig} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('score')}
                >
                  <div className="flex items-center">
                    Score
                    <SortIcon column="score" sortConfig={sortConfig} />
                  </div>
                </th>
                <th 
                  scope="col" 
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort('timeTaken')}
                >
                  <div className="flex items-center">
                    Time Taken
                    <SortIcon column="timeTaken" sortConfig={sortConfig} />
                  </div>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredResults.map((result) => (
                <tr 
                  key={result._id}
                  className={`${
                    (result._id) ? 'bg-blue-50' : ''
                  } hover:bg-gray-50 transition-colors duration-150 ease-in-out`}
                >
                  
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{result.registrationNumber}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="bg-blue-600 h-2.5 rounded-full" 
                          style={{ width: `${result.score}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-900">{result.score}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {result.timeTaken.toFixed(1)} min
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {result.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      className="text-blue-600 hover:text-blue-900 font-medium"
                      onClick={() => quiz && router.push(`/viewResult/${quiz._id}/student/${result.userId}`)}
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-700">
            Showing <span className="font-medium">{filteredResults.length}</span> results
            {searchTerm && (
              <> filtered from <span className="font-medium">{Result.length}</span> total results</>
            )}
          </div>
        </div>
      </div>
    </div>
  </div>
    
  );
}
