'use client';
import React, { useEffect, useState } from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { useAdmin } from '../context/AdminContext'; // Import useAdmin from AdminContext
import Navbar from '../components/Navbar/Navbar';

const Page = () => {
    const router = useRouter();
    const { admin } = useAdmin(); // Extract the admin object from AdminContext
    const [name, setName] = useState('');
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
                                    <TableRow key={assignment._id}>
                                        <TableCell>{assignment.title}</TableCell>
                                        <TableCell>{assignment.questions.length}</TableCell>
                                        <TableCell>
                                            <Button color="success" variant="ghost">
                                                View Quiz
                                            </Button>
                                        </TableCell>
                                        <TableCell> </TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
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
