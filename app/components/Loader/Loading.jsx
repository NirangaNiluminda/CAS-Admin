import React from 'react'
import './loading.css'
import { motion } from 'framer-motion'

const draw = {
    hidden: { pathLength: 0, opacity: 0 },
    visible: (i) => {
        const delay = 1 + i * 0.5;
        return {
            pathLength: 1,
            opacity: 1,
            transition: {
                pathLength: {
                    delay, type: "spring", duration: 1.5, bounce: 0, repeat: Infinity,
                    repeatType: 'loop',
                },
                opacity: {
                    delay, duration: 0.01, repeat: Infinity,
                    repeatType: 'loop',
                }
            }
        };
    }
};

const Loading = () => {
    return (
        <div className='loader'>
            <motion.svg
                width="200"
                height="200"
                viewBox="0 0 100 600"
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', top: '10%', left: '5%', transform: 'translate(-10%, -5%)' }}
            >
                <motion.polygon
                    points="150,50  100,150  200,150" // Triangle points
                    stroke="#00ff55"
                    strokeWidth="5"
                    fill="none"
                    variants={draw}
                    custom={2}
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 2.5 }}
                />
            </motion.svg>
        </div>
    )
}

export default Loading