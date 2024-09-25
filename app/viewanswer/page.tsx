'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/table';

export default function AnswerScript() {
  const router = useRouter(); // Initialize useRouter
  const handleViewHere = () => {
    router.push('/essaytypeanswer'); // Navigate to the viewquiz page
  };

  const questions = [
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Choose from the below.....',
    'Write an essay on............',
  ]

  const Q = [
    { name: 'Choose from the below.....', answer: 'a', type: 'MCQ' },
    { name: 'Choose from the below.....', answer: 'b', type: 'MCQ' },
    { name: 'Choose from the below.....', answer: 'd', type: 'MCQ' },
    { name: 'Write an essay on............', answer: '', type: 'essay' },
  ]

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center text-black text-2xl font-medium font-['Inter'] mb-4">
        Student 1’s answer script
      </div>
      <div className="w-3/4">
        <Table aria-label="Example table with dynamic content" className='w-full'>
          <TableHeader>
            <TableColumn key={`student`}>Question</TableColumn>
            <TableColumn key={`marks`}>Answer</TableColumn>
            <TableColumn key={`type`}>Type</TableColumn>
            <TableColumn key={`check`}>Check</TableColumn>
          </TableHeader>
          <TableBody>
            {Q.map((question, index) => (
              <TableRow key={question.name}>
                <TableCell>{question.name}</TableCell>
                <TableCell>{question.answer}</TableCell>
                <TableCell>{question.type}</TableCell>
                <TableCell>
                  {question.type === 'essay' && (
                    <Button color="success" variant="ghost" onClick={handleViewHere}>
                      Check
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <Button className="mt-8" color="success" variant="ghost" onClick={() => router.push('/viewquiz')}>
        OK
      </Button>
    </div>
  );
}
