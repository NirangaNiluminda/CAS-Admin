'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';

export default function QuizForm() {
  const { admin } = useAdmin(); // Retrieve the admin's info
  const [title, setTitle] = useState(''); // Title for the quiz
  const [description, setDescription] = useState('Test your basic math skills'); // Default description
  const [questions, setQuestions] = useState([
    { question: '', answers: ['', '', '', ''], correct: [false, false, false, false] },
  ]);
  const [timeLimit, setTimeLimit] = useState(10); // Default time limit is 10 minutes
  const router = useRouter();

  const addQuestion = () => {
    setQuestions([
      ...questions,
      { question: '', answers: ['', '', '', ''], correct: [false, false, false, false] },
    ]);
  };

  const handleCancel = () => {
    router.push('/dashboard'); // Navigate to the dashboard page
  };

  const handleQuestionChange = (index: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value;
    setQuestions(updatedQuestions);
  };

  const handleAnswerChange = (qIndex: number, aIndex: number, value: string) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answers[aIndex] = value;
    setQuestions(updatedQuestions);
  };

  const handleCheckboxChange = (qIndex: number, aIndex: number, isChecked: boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correct[aIndex] = isChecked;
    setQuestions(updatedQuestions);
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Create the data structure to match the backend API's expected payload
    const quizData = {
      title,
      description,
      timeLimit: timeLimit.toString(), // Convert time limit to string
      questions: questions.map(q => ({
        questionText: q.question,
        options: q.answers.map((answer, idx) => ({
          text: answer,
          isCorrect: q.correct[idx],
        })),
      })),
      teacherId: admin?._id, // Admin ID
    };

    console.log(quizData);

    try {
      // Send the data to the backend
      const response = await axios.post('http://localhost:4000/api/v1/create', quizData);
      console.log('Quiz created:', response.data);
      alert('Quiz created successfully!');
      router.push('/dashboard'); // Redirect to dashboard after success
    } catch (error) {
      alert(`Error creating quiz: ${error}`);
      console.error('Error creating quiz:', error);
    }
  };

  return (
    <div className="w-[1366px] h-[768px] pl-[217px] pr-[218px] pt-[41px] pb-[42px] bg-white flex justify-center items-center">
      <div className="flex flex-col gap-[35px]">
        <div className="w-[855px] h-[97px] p-6 flex-col gap-2.5 flex">
          <div className="flex justify-between items-center">
            <input
              type="text"
              placeholder="Quiz Title"
              className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <select className="px-6 py-1.5 p-4 bg-[#0cdc09] text-xl font-bold text-black rounded-lg">
              <option>Type</option>
              <option>MCQ</option>
              <option>Essay</option>
            </select>
          </div>

          {/* Time Limit Input */}
          <div className="mt-4">
            <label htmlFor="timeLimit" className="text-xl font-semibold">
              Time Limit (Minutes):
            </label>
            <input
              type="number"
              name="timeLimit"
              id="timeLimit"
              value={timeLimit}
              onChange={(e) => setTimeLimit(Number(e.target.value))}
              className="ml-4 w-[100px] h-[40px] p-2 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
              min="1"
            />
          </div>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="w-full flex flex-col gap-8 mt-8">
            <div className="text-2xl font-semibold text-black">Question {qIndex + 1}</div>
            <input
              type="text"
              placeholder="Enter Question"
              className="w-[855px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
              value={q.question}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
            />
            <div className="flex flex-col space-y-4">
              {q.answers.map((answer, aIndex) => (
                <div key={aIndex} className="flex flex-row items-center space-x-4">
                  <input
                    type="text"
                    placeholder={`Answer ${aIndex + 1}`}
                    className="w-[372px] h-[58px] p-4 bg-[#a8f3a7] text-xl font-thin text-black rounded-lg"
                    value={answer}
                    onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                  />
                  <Checkbox
                    isSelected={q.correct[aIndex]}
                    onChange={(e) => handleCheckboxChange(qIndex, aIndex, e.target.checked)}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="flex gap-10 mt-8">
          <Button color="success" variant="ghost" onClick={handleSubmit}>
            Create
          </Button>
          <button onClick={addQuestion} className="text-2xl font-medium text-black">
            Add More Questions
          </button>
          <Button color="success" variant="ghost" onClick={handleCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
