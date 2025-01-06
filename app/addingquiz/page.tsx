'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { Checkbox } from '@nextui-org/checkbox';
import { useAdmin } from '../context/AdminContext';
import axios from 'axios';

export default function QuizForm() {
  const { admin } = useAdmin(); // Retrieve the admin's info
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('Test your basic math skills');
  const [questions, setQuestions] = useState([
    { question: '', answers: ['', '', '', ''], correct: [false, false, false, false] },
  ]);
  const [timeLimit, setTimeLimit] = useState(10);
  const [password, setPassword] = useState('');
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

  const handlePasswordChange = (value: string) => {
    setPassword(value);
  };

  const handleCheckboxChange = (qIndex: number, aIndex: number, isChecked: boolean) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correct[aIndex] = isChecked;
    setQuestions(updatedQuestions);
  };

  const validateForm = () => {
    if (!title.trim()) {
      alert('Quiz title is required.');
      return false;
    }
    if (questions.some((q) => !q.question.trim())) {
      alert('Each question must have text.');
      return false;
    }
    if (questions.some((q) => q.answers.some((answer) => !answer.trim()))) {
      alert('All answers must have text.');
      return false;
    }
    if (questions.some((q) => !q.correct.includes(true))) {
      alert('Each question must have at least one correct answer.');
      return false;
    }
    if (!password.trim()) {
      alert('Password is required.');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    const quizData = {
      title,
      description,
      timeLimit: timeLimit.toString(),
      questions: questions.map((q) => ({
        questionText: q.question,
        options: q.answers.map((answer, idx) => ({
          text: answer,
          isCorrect: q.correct[idx],
        })),
      })),
      teacherId: admin?._id,
      password,
    };

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('No authentication token found. Please login.');
        router.push('/login');
        return;
      }
      console.log(quizData);

      const response = await axios.post('http://localhost:4000/api/v1/create-assignment', quizData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      alert('Quiz created successfully!');
      console.log(response);
      router.push('/dashboard');
    } catch (error) {
      console.error('Error creating quiz:', error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          alert('Please login to access this resource');
          router.push('/login');
        } else if (error.response?.status === 400) {
          alert('Bad Request: Please check the data you are sending.');
        } else {
          alert(`Error: ${error.response?.data?.message || error.message}`);
        }
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8 bg-white rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6">Create a Quiz</h1>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Quiz Title"
          className="w-full p-4 bg-gray-100 rounded-lg"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Quiz Description"
          className="w-full p-4 bg-gray-100 rounded-lg"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <label className="block text-sm font-semibold mb-2">Time Limit (Minutes):</label>
          <input
            type="number"
            value={timeLimit}
            onChange={(e) => setTimeLimit(Number(e.target.value))}
            className="p-2 bg-gray-100 rounded-lg"
            min="1"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold mb-2">Password:</label>
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => handlePasswordChange(e.target.value)}
            className="w-full p-4 bg-gray-100 rounded-lg"
          />
        </div>
      </div>

      {questions.map((q, qIndex) => (
        <div key={qIndex} className="mt-8">
          <h2 className="text-xl font-semibold">Question {qIndex + 1}</h2>
          <input
            type="text"
            placeholder="Enter Question"
            className="w-full p-4 bg-gray-100 rounded-lg"
            value={q.question}
            onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
          />
          <div className="mt-4 space-y-2">
            {q.answers.map((answer, aIndex) => (
              <div key={aIndex} className="flex items-center space-x-4">
                <input
                  type="text"
                  placeholder={`Answer ${aIndex + 1}`}
                  className="flex-1 p-4 bg-gray-100 rounded-lg"
                  value={answer}
                  onChange={(e) => handleAnswerChange(qIndex, aIndex, e.target.value)}
                />
                <Checkbox
                  isSelected={q.correct[aIndex]}
                  onChange={(e) => handleCheckboxChange(qIndex, aIndex, e.target.checked)}
                >
                  Correct
                </Checkbox>
              </div>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-8 flex gap-4">
        <Button color="success" variant="ghost" onClick={handleSubmit}>
          Create
        </Button>
        <button
          onClick={addQuestion}
          className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add More Questions
        </button>
        <Button color="danger" variant="ghost" onClick={handleCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
