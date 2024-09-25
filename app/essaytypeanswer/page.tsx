'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';

export default function EssayPrompt() {
  const router = useRouter();

  const handleGoBack = () => {
    router.push('/viewanswer');
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-white">
      <div className="text-center text-black text-2xl font-medium mb-8">
        Write an essay on............
      </div>
      <div className="w-[1030px] h-[541px] bg-[#eaeaea] rounded-[10px] mb-8"></div>
      <Button className="px-4 py-2" color="success" variant="ghost" onClick={handleGoBack}>
        Go Back
      </Button>
    </div>
  );
}
