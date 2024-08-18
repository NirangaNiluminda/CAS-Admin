'use client';

import React from 'react';
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation'; // Import useRouter
export default function AnswerScript() {
    const router = useRouter(); // Initialize useRouter
    const handleViewHere = () => {
        router.push('/essaytypeanswer'); // Navigate to the viewquiz page
      };
  return (
    <div className="w-[1366px] h-[768px] relative bg-white flex flex-col items-center">
      <div className="absolute text-center text-black text-2xl font-medium font-['Inter'] top-8">
        Student 1’s answer script
      </div>

      <div className="bg-[#f4f4f4] w-full p-8 space-y-4 mt-8">
        {[
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
        ].map((question, index) => (
          <div key={index} className="flex justify-between text-black text-2xl font-medium font-['Inter'] items-center">
            <div className="w-[673px]">{question}</div>
            <div className="text-black text-2xl font-medium font-['Inter']">
              {index < 9 ? (index % 2 === 0 ? '0.4' : 'No') : (
                <Button onClick={handleViewHere} color="primary" variant="flat" className="text-sm">
                  View Here
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Button className="mt-8" color="success" variant="flat">
        OK
      </Button>
    </div>
  );
}