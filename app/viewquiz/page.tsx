// 'use client';

// import React, { useEffect, useState } from 'react';
// import { Button } from '@nextui-org/button';
// import { useRouter, useParams } from 'next/navigation';
// import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
// import { useQuiz } from '../context/QuizContext';

// interface Quiz {
//   _id: string;
//   title: string;
//   description: string;
//   questions: {
//     questionText: string;
//     options: {
//       text: string;
//       isCorrect: boolean;
//       _id: string;
//     }[];
//   }[];
// }

// export default function ViewQuiz() {
//   const router = useRouter();
//   const { id } = useParams(); // Catch the quiz ID from the URL
//   const { quiz } = useQuiz();

//   const handleCheck = () => {
//     router.push(`/viewanswer/${id}`); // Navigate to the answer page using the quiz ID
//   };

//   const handleGoBack = () => {
//     router.push('/dashboard');
//   };

//   const handleDownloadExcel = async () => {
//     if (!quiz) {
//       console.error('Quiz data is not available');
//       return;
//     }

//     const assignmentId = quiz._id;
//     const token = localStorage.getItem('token');

//     try {
//       let apiUrl;
//       // Determine the correct API URL based on the hostname
//       if (typeof window !== 'undefined') {
//         if (window.location.hostname === 'localhost') {
//           apiUrl = 'http://localhost:4000';
//         } else {
//           apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
//           console.log('Deployment URL:', apiUrl);
//         }
//       }
//       const response = await fetch(`${apiUrl}/api/v1/downloadExcel/${assignmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       // Assuming the API returns a file for download
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Quiz_${id}.xlsx`; // Customize the filename
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       console.error("Failed to download Excel:", error);
//     }
//   };

//   const handleFulDownloadExcel = async () => {
//     if (!quiz) {
//       console.error('Quiz data is not available');
//       return;
//     }

//     const assignmentId = quiz._id;
//     const token = localStorage.getItem('token');
//     let apiUrl;
//     if (typeof window !== 'undefined') {
//       if (window.location.hostname === 'localhost') {
//         apiUrl = 'http://localhost:4000';
//       } else {
//         apiUrl = process.env.NEXT_PUBLIC_DEPLOYMENT_URL;
//         console.log('Deployment URL:', apiUrl);
//       }
//     }
//     try {
//       const response = await fetch(`${apiUrl}/api/v1/downloadFullExcel/${assignmentId}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${token}`,
//         },
//       });

//       if (!response.ok) {
//         throw new Error(`Error: ${response.statusText}`);
//       }

//       // Assuming the API returns a file for download
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = `Quiz_${id}.xlsx`; // Customize the filename
//       document.body.appendChild(a);
//       a.click();
//       a.remove();
//     } catch (error) {
//       console.error("Failed to download Excel:", error);
//     }
//   };

//   return (
//     <div className="w-full h-full px-[20px] py-[39px] bg-white flex justify-center items-center">
//       <div className="flex flex-col items-center gap-8">
//         <div className="text-center text-black text-[32px] font-bold font-['Inter']">
//           {quiz ? quiz.title : 'Loading...'}
//         </div>
//         {quiz ? (
//           <Table aria-label="Quiz Table" className="w-full items-center">
//             <TableHeader>
//               <TableColumn key="question">Question</TableColumn>
//               <TableColumn key="options">Options</TableColumn>
//               <TableColumn key="check">Check</TableColumn>
//             </TableHeader>
//             <TableBody>
//               {quiz.questions.map((question) => (
//                 <TableRow key={question.questionText} style={{ borderBottom: '1px solid #E2E8F0' }}>
//                   <TableCell>{question.questionText}</TableCell>
//                   <TableCell>
//                     <ul>
//                       {question.options.map(option => (
//                         <li key={option._id}>
//                           {option.text} {option.isCorrect ? '(Correct)' : ''}
//                         </li>
//                       ))}
//                     </ul>
//                   </TableCell>
//                   <TableCell>
//                     <Button onClick={handleCheck} color="success" variant="ghost">
//                       Check
//                     </Button>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         ) : (
//           <div>Loading Quiz...</div>
//         )}


//         <div className="flex gap-4">
//           <Button className="px-4 py-2" color="primary" variant="flat" onClick={handleDownloadExcel}>
//             Download Excel
//           </Button>
//           <Button className="px-4 py-2" color="primary" variant="flat" onClick={handleFulDownloadExcel}>
//             Download Full Results
//           </Button>
//         </div>
//         <Button className="px-4 py-2" color="success" variant="ghost" onClick={handleGoBack}>
//           Go Back
//         </Button>
//         <Button
//           className="px-4 py-2"
//           color="primary"
//           variant="flat"
//           onClick={() => quiz && router.push(`/viewResult/${quiz._id}`)}
//         >
//           View Results
//         </Button>


//       </div>
//     </div>
//   );
// }

'use client';

import React from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useQuiz } from '../context/QuizContext';
import { Button } from '@nextui-org/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '../components/ui/card';
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '../components/ui/table';
import { Separator } from '../components/ui/separator';
import { Download, ArrowLeft, Eye, FileSpreadsheet, CheckCircle2, AlertCircle, BookOpen } from 'lucide-react';
import { ScrollArea } from '../components/ui/scroll-area';
import { Skeleton } from '../components/ui/skeleton';
import { Badge } from '../components/ui/badge';

interface Quiz {
  _id: string;
  title: string;
  description: string;
  questions: {
    questionText: string;
    options: {
      text: string;
      isCorrect: boolean;
      _id: string;
    }[];
  }[];
}

export default function ViewQuiz() {
  const router = useRouter();
  const { id } = useParams();
  const { quiz } = useQuiz();

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

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="backdrop-blur-sm bg-white/80">
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <Card className="backdrop-blur-sm bg-white/90 shadow-xl border border-indigo-100">
          <CardHeader className="space-y-4 pb-8">
            <div className="flex items-center justify-between">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={handleGoBack}
                className="absolute left-4 hover:bg-blue-50 border-0"
              >
                <ArrowLeft className="h-5 w-5 text-blue-600" />
              </Button>
              <div className="text-center mx-auto">
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                  {quiz.title}
                </CardTitle>
                <Badge variant="outline" className="mt-2">
                  <BookOpen className="h-4 w-4 mr-1" />
                  {quiz.questions.length} Questions
                </Badge>
              </div>
            </div>
            {quiz.description && (
              <CardDescription className="text-center mt-2 text-gray-600">
                {quiz.description}
              </CardDescription>
            )}
          </CardHeader>
          
          <Separator className="bg-indigo-100" />
          
          <CardContent className="p-8">
            <ScrollArea className="h-[60vh] rounded-lg border border-indigo-100 bg-white">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gradient-to-r from-blue-50 to-indigo-50">
                    <TableHead className="w-[50px] font-semibold text-blue-700">No.</TableHead>
                    <TableHead className="font-semibold text-blue-700">Question</TableHead>
                    <TableHead className="font-semibold text-blue-700">Options</TableHead>
                    <TableHead className="w-[120px] font-semibold text-blue-700 text-center">Correct Answer</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {quiz.questions.map((question, index) => (
                    <TableRow key={index} className="hover:bg-blue-50/50 transition-colors">
                      <TableCell className="font-medium text-blue-600">
                        {index + 1}
                      </TableCell>
                      <TableCell className="text-gray-700">
                        {question.questionText}
                      </TableCell>
                      <TableCell className="max-w-xl">
                        <div className="grid grid-cols-1 gap-2">
                          {question.options.map((option, optIndex) => (
                            <div 
                              key={option._id}
                              className={`p-2 rounded-md text-sm ${
                                option.isCorrect 
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

          <Separator className="bg-indigo-100" />
          
          <CardFooter className="p-8 flex flex-wrap gap-4 justify-center bg-gradient-to-r from-blue-50 to-indigo-50 rounded-bl-md rounded-br-md">
            <Button
              variant="bordered"
              onClick={handleDownloadExcel}
              className="border-blue-200 hover:bg-blue-100 text-blue-700"
            >
              <Download className="h-4 w-4 mr-2" />
              Download Results
            </Button>
            <Button
              variant="bordered"
              onClick={handleFullDownloadExcel}
              className="border-blue-200 hover:bg-blue-100 text-blue-700"
            >
              <FileSpreadsheet className="h-4 w-4 mr-2" />
              Download Full Results
            </Button>
            <Button
              variant="solid"
              onClick={() => router.push(`/viewResult/${quiz._id}`)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Eye className="h-4 w-4 mr-2" />
              View Results
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}