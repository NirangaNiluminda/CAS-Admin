'use client';

import React from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter

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

      <button onClick={handleGoBack} className="px-2 py-1 left-[604px] top-[683px] absolute bg-[#0cdc09] rounded-[10px] flex justify-center items-center gap-2.5">
        <div className="text-black text-2xl font-bold font-['Inter'] tracking-[3.60px]">
          Go Back
        </div>
      </button>
    </div>
  );
}