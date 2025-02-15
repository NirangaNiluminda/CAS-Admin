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

//         const result = await response.json();
//         setQuizResults(result.results); // Store the results array
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
//                 <th className="py-2 px-4 text-left">Action</th> {/* Added Action column */}
//               </tr>
//             </thead>
//             <tbody>
//               {quizResults.map((result) => (
//                 <tr key={result._id} className="border-b">
//                   <td className="py-2 px-4">{result.registrationNumber}</td>
//                   <td className="py-2 px-4">{result.score}</td>
//                   <td className="py-2 px-4">{result.timeTaken.toFixed(2)}</td>
//                   <td className="py-2 px-4">
//                     {/* Button for navigating to result details */}
//                     <Button
//                       className="px-4 py-2"
//                       color="primary"
//                       variant="flat"
//                       onClick={() => quiz && router.push(`/viewResult/${quiz._id}/student/${userId._id}`)} // Just navigate to the result page
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

export default function ViewResult() {
  const { id } = useParams(); // Get quiz ID from URL
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { quiz } = useQuiz();
 
  const [searchTerm, setSearchTerm] = useState('');  // State for search term'

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
    <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
     
      <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
      {loading ? (
        <p>Loading results...</p>
      ) : quizResults.length > 0 ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="py-2 px-4 text-left">Student</th>
                <th className="py-2 px-4 text-left">Score</th>
                <th className="py-2 px-4 text-left">Time Taken (minutes)</th>
                <th className="py-2 px-4 text-left">ID</th>
                <th className="py-2 px-4 text-left">Action</th> {/* Added Action column */}
              </tr>
            </thead>
            <tbody>
              {quizResults.map((result) => (

                <tr key={result._id} className="border-b">
                  <td className="py-2 px-4">{result.registrationNumber}</td>
                  <td className="py-2 px-4">{result.score}</td>
                  <td className="py-2 px-4">{result.timeTaken.toFixed(2)}</td>
                  <td className="py-2 px-4">{result.userId}</td>
                  <td className="py-2 px-4">
                    {/* Button for navigating to result details */}
                    <Button
                      className="px-4 py-2"
                      color="primary"
                      variant="flat"
                      onClick={() => quiz && router.push(`/viewResult/${quiz._id}/student/${result.userId}`)} // Use result.userId instead of result._id
                    >
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>No results found.</p>
      )}
      <button
        onClick={() => router.push('/dashboard')}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
      >
        Back to Dashboard
      </button>
    </div>
  );
}
