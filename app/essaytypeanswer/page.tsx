'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@nextui-org/button';

export default function EssayPrompt() {
  const router = useRouter(); // Initialize useRouter
  const handleGoBack = () => {
    router.push('/viewanswer'); // Navigate to the viewquiz page
  };
  return (
    <div className="w-[1366px] h-[768px] relative bg-white">
      <div className="left-[540px] top-[35px] absolute text-center text-black text-2xl font-medium font-['Inter']">
        Write an essay on............
      </div>
      <div className="w-[1030px] h-[541px] left-[168px] top-[113px] absolute bg-[#eaeaea] rounded-[10px]" />
      <Button className="mt-8 px-2 py-1 left-[604px] top-[683px] absolute flex justify-center items-center gap-2.5" color="success" variant="ghost" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}