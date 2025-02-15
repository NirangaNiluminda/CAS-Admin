// 'use client';

// import React, { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useParams } from 'next/navigation'; // Import useParams for extracting params from URL

// export default function ViewResult() {
//   const { quizId, studentId } = useParams(); // Use useParams to get quizId and studentId from the URL
//   const [result, setResult] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     // Ensure quizId and studentId are available before making the API call
//     if (!quizId || !studentId) return;

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
//         const response = await fetch(`${apiUrl}/api/v1/viewResult/${quizId}/student/${studentId}`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         });

//         if (!response.ok) {
//           throw new Error(`Error: ${response.statusText}`);
//         }

//         const data = await response.json();
//         setResult(data.results); // Store the result
//       } catch (error) {
//         console.error('Failed to fetch result:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchResults();
//   }, [quizId, studentId]); // Trigger re-fetch if quizId or studentId change

//   if (!quizId || !studentId) {
//     return <p>Loading...</p>; // Render loading state or wait for parameters
//   }

//   return (
//     <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
//       <h1 className="text-2xl font-bold mb-6">Student Result</h1>
//       {loading ? (
//         <p>Loading result...</p>
//       ) : result ? (
//         <div className="w-full">
//           <h2 className="text-xl mb-4">Results for Student {studentId}</h2>
//           <p className="mb-4">Score: {result.score}</p>
//           <p className="mb-4">Time Taken: {result.timeTaken.toFixed(2)} minutes</p>
//           <p className="mb-4">Submitted At: {new Date(result.submittedAt).toLocaleString()}</p>

//           <h3 className="text-lg font-semibold mt-6 mb-4">Answers</h3>
//           <ul className="list-none">
//             {result.answers.map((answer) => (
//               <li key={answer._id} className="mb-2">
//                 <strong>Question ID:</strong> {answer.questionId} <br />
//                 <strong>Selected Option ID:</strong> {answer.selectedOption}
//               </li>
//             ))}
//           </ul>
//         </div>
//       ) : (
//         <p>No result found.</p>
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
import { useRouter, useParams } from 'next/navigation';

interface Answer {
  questionId: string;
  selectedOption: string;
  _id: string;
}
export default function ViewResult() {
  const { id, sid } = useParams(); // Get quiz and student IDs from the URL
  const [quizResults, setQuizResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [mcqData, setMcqData] = useState<Answer[]>([]);


  //   const [result, setResult] = useState(null);
  //   const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      const token = localStorage.getItem('token');
      let apiUrl;

      if (typeof window !== 'undefined') {
        apiUrl = window.location.hostname === 'localhost'
          ? 'http://localhost:4000' // Express.js backend
          : process.env.NEXT_PUBLIC_DEPLOYMENT_URL; // Express.js URL in production
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
        console.log('Fetched Data:', data.results); // Log fetched data
        setQuizResults(data.results); // Set the state
        setMcqData(data.results.answers); //get the answers array only
        console.log('Quiz Results11111:', setQuizResults);
      } catch (error) {
        console.error('Failed to fetch quiz results:', error);
      } finally {
        setLoading(false);
      }
    };
    console.log('Quiz Results22222:', setQuizResults);
    fetchResults();
    console.log('Quiz Results3333:', setQuizResults);
  }, [id, sid]); // Dependencies to refetch when IDs change

  useEffect(() => {
    console.log('Updated quizResults:', quizResults); // Log updates to quizResults
  }, [quizResults]);


  return (
    <div className="w-full h-full px-8 py-12 bg-white flex flex-col items-center">
      <h1 className="text-2xl font-bold mb-6">Quiz Results</h1>
      {loading ? (
        <p>Loading results...</p>
      ) : quizResults ? (
        <div className="w-full overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-100 border-b">
                <th className="border px-4 py-2">Question ID</th>
                <th className="border px-4 py-2">Selected Option</th>
                <th className="border px-4 py-2">Answer ID</th>
              </tr>
            </thead>
            <tbody>
              {mcqData.map((answer) => (
                <tr key={answer._id} className="text-center">
                  <td className="border px-4 py-2">{answer.questionId}</td>
                  <td className="border px-4 py-2">{answer.selectedOption}</td>
                  <td className="border px-4 py-2">{answer._id}</td>
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

