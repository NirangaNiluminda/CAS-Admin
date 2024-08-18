'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation'; // Import useRouter
export default function ViewQuiz() {
    const router = useRouter(); // Initialize useRouter
    const handleCheck = () => {
        router.push('/viewanswer'); // Navigate to the viewquiz page
      };
  return (
    <div className="w-full h-full px-[20px] py-[39px] bg-white flex justify-center items-center">
      <div className="flex flex-col items-center gap-8">
        <div className="text-center text-black text-[32px] font-bold font-['Inter']">
          Quiz for Module A.B.C.
        </div>
        <div className="bg-[#ededed] w-[1200px] p-4 rounded-lg shadow-md">
          <div className="flex flex-col">
            <div className="flex justify-between text-black text-2xl font-bold font-['Inter'] mb-2">
              <div className="w-[300px]">Student</div>
              <div className="w-[70px] text-center">Marks</div>
              <div className="w-[100px] text-center">Check</div>
            </div>
            <div className="flex flex-col">
              {[
                { name: 'Perera A.B.C.', marks: 18 },
                { name: 'Perera D.E.F.', marks: 10 },
                { name: 'Perera G.H.I.', marks: 12 },
                { name: 'Perera J.K.L.', marks: 19 },
              ].map((student, index) => (
                <div key={index} className="flex justify-between text-black text-2xl font-medium font-['Inter'] border-b py-2">
                  <div className="w-[300px]">{student.name}</div>
                  <div className="w-[70px] text-center">{student.marks}</div>
                  <div className="w-[100px] text-center">
                    <Button onClick={handleCheck} color="primary" variant="flat" >
                      Check
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


