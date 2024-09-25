'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";

export default function ViewQuiz() {
  const router = useRouter(); // Initialize useRouter
  const handleCheck = () => {
    router.push('/viewanswer'); // Navigate to the viewquiz page
  };
  const handleGoBack = () => {
    router.push('/dashboard');
  };

  const rows = [
    { name: 'Perera A.B.C.', marks: 18 },
    { name: 'Perera D.E.F.', marks: 10 },
    { name: 'Perera G.H.I.', marks: 12 },
    { name: 'Perera J.K.L.', marks: 19 },
  ]
  return (
    <div className="w-full h-full px-[20px] py-[39px] bg-white flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center text-black text-[32px] font-bold font-['Inter']">
          Quiz for Module A.B.C.
        </div>
        <Table aria-label="Example table with dynamic content" className='w-full items-center'>
          <TableHeader>
            <TableColumn key={`student`}>Student</TableColumn>
            <TableColumn key={`marks`}>Marks</TableColumn>
            <TableColumn key={`check`}>Check</TableColumn>
          </TableHeader>
          <TableBody>
            {rows.map((student, index) => (
              <TableRow key={student.name}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.marks}</TableCell>
                <TableCell>
                  <Button onClick={handleCheck} color="success" variant="ghost" >
                    Check
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button className="px-4 py-2" color="success" variant="ghost" onClick={handleGoBack}>
          Go Back
        </Button>
      </div>
    </div>
  );
}


