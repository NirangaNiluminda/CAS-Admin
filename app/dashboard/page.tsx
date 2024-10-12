'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../context/AdminContext'; // Import useAdmin from AdminContext
import Navbar from '../components/Navbar/Navbar';
import { useQuiz } from '../context/QuizContext';

const Page = () => {
    const router = useRouter();
    const { admin } = useAdmin(); // Extract the admin object from AdminContext
    const [name, setName] = useState('');
    const [isCopied, setIsCopied] = useState(false);
    const { setQuiz } = useQuiz();
    interface Assignment {
        _id: string;
        title: string;
        questions: { length: number }[];
    }

    const [assignments, setAssignments] = useState<Assignment[]>([]); // State to hold assignments

    // Fetch assignments when the admin is available
    useEffect(() => {
        const fetchAssignments = async () => {
            if (admin && admin._id) {
                try {
                    const response = await fetch(`http://localhost:4000/api/v1/teacher/${admin._id}`);
                    const data = await response.json();
                    if (data.success) {
                        setAssignments(data.assignments); // Set the assignments from API
                    }
                    console.log(`admin: ${admin._id}`);
                    console.log(`assignments:`, data.assignments);
                } catch (error) {
                    console.error('Failed to fetch assignments', error);
                }
            }
        };

        fetchAssignments();
    }, [admin]); // Run effect only when admin changes

    useEffect(() => {
        if (admin?.name) {
            setName(admin.name); // Set the admin's name from context if available
        }
    }, [admin]);

    const fetchQuiz = async (id: string) => {
        try {
            const response = await fetch(`http://localhost:4000/api/v1/${id}`); // Fetch the quiz using the quiz ID
            const data = await response.json();
            if (data.success) {
                setQuiz(data.assignment);
                console.log(data.assignment);
                router.push(`/viewquiz`);
            }
        } catch (error) {
            console.error('Failed to fetch quiz', error);
        }
    };

    const getQuizLink = (id: string) => {
        const URL = `http://localhost:3002/signin/${id}`;
        console.log(URL);

        // Copy the URL to the clipboard
        navigator.clipboard.writeText(URL).then(() => {
            console.log('Link copied to clipboard!');
            setIsCopied(true);
        }).catch(err => {
            console.error('Failed to copy link: ', err);
        });

        return URL;
    }


    return (
        <>
            <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-16 pb-10 sm:pb-16 bg-white flex justify-center items-center">
                <div className="w-full sm:w-auto sm:grow shrink basis-0 self-stretch py-6 bg-[#f4f4f4] rounded-3xl border-2 border-[#0cdc09] flex flex-col justify-center items-center gap-14">
                    <div className="w-32 sm:w-44 h-32 sm:h-44 bg-[#aeaeae] rounded-full shadow flex flex-col justify-center items-center gap-6">
                        <div className="text-center text-black text-2xl sm:text-3xl font-bold font-['Inter']">Welcome</div>
                        <div className="text-center text-black text-lg sm:text-xl font-medium font-['Inter']">
                            {name ? `Mr. ${name}` : "Mr. A.B.C. Perera"} {/* Display the admin's name */}
                        </div>
                    </div>
                    {/* Display the fetched assignments */}
                    <Table aria-label="Assignments Table" className='w-full items-center'>
                        <TableHeader>
                            <TableColumn>TITLE</TableColumn>
                            <TableColumn>QUESTIONS</TableColumn>
                            <TableColumn>VIEW QUIZ</TableColumn>
                            <TableColumn>GET PUBLIC LINK</TableColumn>
                            <TableColumn key={`status`}>
                                <svg width="37" height="37" viewBox="0 0 37 37" fill="none" className='cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg' onClick={() => router.push('/addingquiz')}>
                                    <g id="plus-circle-svgrepo-com 1">
                                        <path id="Vector" d="M13.875 18.5H23.125" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Vector_2" d="M18.5 13.875V23.125" stroke="green" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        <path id="Vector_3" d="M32.375 18.5C32.375 26.163 26.163 32.375 18.5 32.375C10.8371 32.375 4.625 26.163 4.625 18.5C4.625 10.8371 10.8371 4.625 18.5 4.625C26.163 4.625 32.375 10.8371 32.375 18.5Z" stroke="green" strokeWidth="4" />
                                    </g>
                                </svg>
                            </TableColumn>
                        </TableHeader>
                        <TableBody>
                            {assignments.length > 0 ? (
                                assignments.map(assignment => (
                                    <TableRow key={assignment._id} style={{ borderBottom: '1px solid #E2E8F0' }}>
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.questions.length}</TableCell>
                                        <TableCell>
                                            <Button color="success" variant="ghost" onClick={async () => await fetchQuiz(assignment._id)}>
                                                View Quiz
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            <Button color="success" variant="ghost" onClick={() => getQuizLink(assignment._id)}>
                                                {isCopied === true ? 'Link Copied!' : 'Get Link'}
                                            </Button>
                                        </TableCell>
                                        <TableCell><svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M18 2L22 6M2 22L3.2764 17.3199C3.35968 17.0145 3.40131 16.8619 3.46523 16.7195C3.52199 16.5931 3.59172 16.4729 3.67332 16.3609C3.76521 16.2348 3.87711 16.1229 4.1009 15.8991L14.4343 5.56569C14.6323 5.36768 14.7313 5.26867 14.8455 5.23158C14.9459 5.19895 15.0541 5.19895 15.1545 5.23158C15.2687 5.26867 15.3677 5.36768 15.5657 5.56569L18.4343 8.43431C18.6323 8.63232 18.7313 8.73133 18.7684 8.84549C18.8011 8.94591 18.8011 9.05409 18.7684 9.15451C18.7313 9.26867 18.6323 9.36768 18.4343 9.56569L8.1009 19.8991C7.87711 20.1229 7.76521 20.2348 7.63908 20.3267C7.52709 20.4083 7.40692 20.478 7.28052 20.5348C7.13815 20.5987 6.98548 20.6403 6.68014 20.7236L2 22Z" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                                        </svg>
                                        </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell>No assignments found</TableCell>
                                    <TableCell>No assignments found</TableCell>
                                    <TableCell>No assignments found</TableCell>
                                    <TableCell>No assignments found</TableCell>
                                    <TableCell>No assignments found</TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </>
    );
};

export default Page;
