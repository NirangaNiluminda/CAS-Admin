'use client';
import React from 'react';
import { Table, TableHeader, TableBody, TableColumn, TableRow, TableCell } from "@nextui-org/table";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

const rows = [
    { key: '1', title: 'Module A.B.C', students: '58', status: 'View Quiz' },
    { key: '2', title: 'Module D.E.F', students: '42', status: 'View Quiz' },
    { key: '3', title: 'Module G.H.I', students: '32', status: 'View Quiz' },
    { key: '4', title: 'Module J.K.L', students: '24', status: 'View Quiz' },
];

const Page = () => {
    const router = useRouter(); // Initialize the router for navigation

    const handleViewQuiz = () => {
        router.push('/viewquiz'); // Navigate to the quiz viewing page
    };

    return (
        <div className="w-full max-w-screen-lg mx-auto px-4 sm:px-6 md:px-8 pt-10 sm:pt-16 pb-10 sm:pb-16 bg-white flex justify-center items-center">
            <div className="w-full sm:w-auto sm:grow shrink basis-0 self-stretch py-6 bg-[#f4f4f4] rounded-3xl border-2 border-[#0cdc09] flex flex-col justify-center items-center gap-14">
                <div className="w-32 sm:w-44 h-32 sm:h-44 bg-[#aeaeae] rounded-full shadow flex flex-col justify-center items-center gap-6">
                    <div className="text-center text-black text-2xl sm:text-3xl font-bold font-['Inter']">Welcome</div>
                    <div className="text-center text-black text-lg sm:text-xl font-medium font-['Inter']">Mr. A.B.C. Perera</div>
                </div>
                <Table aria-label="Example table with dynamic content" className='w-full items-center'>
                    <TableHeader>
                        <TableColumn key={`title`}>TITLE</TableColumn>
                        <TableColumn key={`students`}>STUDENTS</TableColumn>
                        <TableColumn key={`status`}>
                            <svg width="37" height="37" viewBox="0 0 37 37" fill="none" className='cursor-pointer transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg' onClick={() => router.push('/addingquiz')}>
                                <g id="plus-circle-svgrepo-com 1">
                                    <path id="Vector" d="M13.875 18.5H23.125" stroke="green" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    <path id="Vector_2" d="M18.5 13.875V23.125" stroke="green" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
                                    <path id="Vector_3" d="M32.375 18.5C32.375 26.163 26.163 32.375 18.5 32.375C10.8371 32.375 4.625 26.163 4.625 18.5C4.625 10.8371 10.8371 4.625 18.5 4.625C26.163 4.625 32.375 10.8371 32.375 18.5Z" stroke="green" stroke-width="4" />
                                </g>
                            </svg>
                        </TableColumn>
                    </TableHeader>
                    <TableBody>
                        {rows.map(row => (
                            <TableRow key={row.key}>
                                <TableCell>{row.title}</TableCell>
                                <TableCell>{row.students}</TableCell>
                                <TableCell>
                                    <Button color="success" variant="ghost" onClick={handleViewQuiz}>
                                        {row.status}
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default Page;
