'use client'

import React from 'react'
import { useParams } from 'react-router-dom';
import { useEssay } from '../context/EssayContext';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';

const Page = () => {
    const router = useRouter();
    const { id } = useParams(); // Catch the quiz ID from the URL
    const { essay } = useEssay();

    console.log(essay);

    const handleGoBack = () => {
        router.push('/dashboard');
    }

    return (
        <div className="w-full h-full px-[20px] py-[39px] bg-white flex justify-center items-center">
            <div className="flex flex-col items-center gap-8">
                <div className="text-center text-black text-[32px] font-bold font-['Inter']">
                    {essay ? essay.title : 'Loading...'}
                </div>
                {essay ? (
                    <Table aria-label="Quiz Table" className="w-full items-center">
                    <TableHeader>
                      <TableColumn key="question">Question</TableColumn>
                      <TableColumn key="answer">Answer</TableColumn>
                      <TableColumn key="check">Check</TableColumn>
                    </TableHeader>
                    <TableBody>
                        {essay.questions.map((question) => (
                            <TableRow key={question.questionText} style={{ borderBottom: '1px solid #E2E8F0' }}>
                            <TableCell>{question.questionText}</TableCell>
                            <TableCell>{question.answer}</TableCell>
                            <TableCell>
                                <Button color='success' variant='ghost'>check</Button>
                            </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                    </Table>
                ) : (
                    <div>Loading Assignment....</div>
                )}
                <Button className='px-4 py-2' color='success' variant='ghost' onClick={handleGoBack}>Go Back</Button>
            </div>
        </div>
    )
}

export default Page