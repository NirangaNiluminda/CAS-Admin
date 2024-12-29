'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '@nextui-org/button';
import { useRouter, useParams } from 'next/navigation';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { useQuiz } from '../context/QuizContext';

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
  const { id } = useParams(); // Catch the quiz ID from the URL
  const {quiz} = useQuiz();

  const handleCheck = () => {
    router.push(`/viewanswer/${id}`); // Navigate to the answer page using the quiz ID
  };

  const handleGoBack = () => {
    router.push('/dashboard');
  };

  return (
    <div className="w-full h-full px-[20px] py-[39px] bg-white flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center text-black text-[32px] font-bold font-['Inter']">
          {quiz ? quiz.title : 'Loading...'}
        </div>
        {quiz ? (
          <Table aria-label="Quiz Table" className="w-full items-center">
            <TableHeader>
              <TableColumn key="question">Question</TableColumn>
              <TableColumn key="options">Options</TableColumn>
              <TableColumn key="check">Check</TableColumn>
            </TableHeader>
            <TableBody>
              {quiz.questions.map((question) => (
                <TableRow key={question.questionText} style={{borderBottom: '1px solid #E2E8F0'}}>
                  <TableCell>{question.questionText}</TableCell>
                  <TableCell>
                    <ul>
                      {question.options.map(option => (
                        <li key={option._id}>
                          {option.text} {option.isCorrect ? '(Correct)' : ''}
                        </li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell>
                    <Button onClick={handleCheck} color="success" variant="ghost">
                      Check
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div>Loading Quiz...</div>
        )}
        <Button className="px-4 py-2" color="success" variant="ghost" onClick={handleGoBack}>
          Go Back
        </Button>
      </div>
    </div>
  );
}
