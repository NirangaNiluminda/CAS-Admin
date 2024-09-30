'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';

export default function QuizForm() {
  const [questions, setQuestions] = useState([{ question: '', answer: '' }]);
  const [timeLimit, setTimeLimit] = useState(10); // Default time limit is 10 minutes
  const router = useRouter(); // Initialize useRouter

  const addQuestion = () => {
    setQuestions([...questions, { question: '', answer: '' }]);
  };

  const handleCancel = () => {
    router.push('/dashboard'); // Navigate to the dashboard page
  };

  return (
    <div className="w-[1366px] h-[768px] pl-[217px] pr-[218px] pt-[41px] pb-[42px] bg-white justify-center items-center inline-flex">
      <div className="grow shrink basis-0 self-stretch flex-col justify-center items-center gap-[35px] inline-flex">
        <div className="w-[855px] h-[97px] p-6 flex-col justify-start items-start gap-2.5 flex">
          <div className="self-stretch grow shrink basis-0 justify-between items-center inline-flex">
            <input
              type="text"
              placeholder="Quiz Title"
              className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
            />
            <select className="px-6 py-1.5 p-4 bg-[#0cdc09] text-xl font-bold text-black rounded-lg">
              <option>Type</option>
              <option>MCQ</option>
              <option>Essay</option>
            </select>
          </div>

          {/* Input for setting the time limit in minutes */}
          <div className="mt-4">
            <label htmlFor="timeLimit" className="text-xl font-semibold">Time Limit (Minutes):</label>
            <input
              type="number"
              name="timeLimit"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="ml-4 w-[100px] h-[40px] p-2 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
              min="1" // Minimum time limit of 1 minute
            />
          </div>
        </div>

        {questions.map((q, index) => (
          <div key={index} className="self-stretch h-[129px] flex-col justify-start items-start gap-8 flex mt-8">
            <div className="self-stretch text-black text-2xl font-semibold">Question {index + 1}</div>
            <div className="self-stretch justify-start items-center gap-[187px] inline-flex">
              <input
                type="text"
                placeholder="Question"
                className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                value={q.question}
                onChange={(e) => {
                  const newQuestions = [...questions];
                  newQuestions[index].question = e.target.value;
                  setQuestions(newQuestions);
                }}
              />
              <div className="flex flex-col space-y-4"> {/* Column to group rows */}
                {/* Row 1 */}
                <div className='flex flex-row space-x-4'>
                  <input
                    type="text"
                    placeholder="Answers"
                    className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                    value={q.answer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].answer = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                  <Checkbox />
                </div>

                {/* Row 2 */}
                <div className='flex flex-row space-x-4'>
                  <input
                    type="text"
                    placeholder="Answers"
                    className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                    value={q.answer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].answer = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                  <Checkbox />
                </div>

                {/* Row 3 */}
                <div className='flex flex-row space-x-4'>
                  <input
                    type="text"
                    placeholder="Answers"
                    className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                    value={q.answer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].answer = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                  <Checkbox />
                </div>

                {/* Row 4 */}
                <div className='flex flex-row space-x-4'>
                  <input
                    type="text"
                    placeholder="Answers"
                    className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                    value={q.answer}
                    onChange={(e) => {
                      const newQuestions = [...questions];
                      newQuestions[index].answer = e.target.value;
                      setQuestions(newQuestions);
                    }}
                  />
                  <Checkbox />
                </div>
              </div>

            </div>
          </div>
        ))}

        <div className="gap-[62px] inline-flex">
          <Button color="success" variant="ghost">Create</Button>
          <div className="flex items-center gap-[25px]">
            <button onClick={addQuestion} className="text-2xl font-medium text-black">
              Add More Questions
            </button>
          </div>
          <Button color="success" variant="ghost" onClick={handleCancel}>Cancel</Button>
        </div>
      </div>
    </div>
  );
}
