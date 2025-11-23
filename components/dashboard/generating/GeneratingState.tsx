'use client';

import { useEffect, useState } from 'react';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';
import { motion } from 'framer-motion';

interface GeneratingStateProps {
  onCancel?: () => void;
}

const STATUS_MESSAGES = [
  { phase: 1, message: 'Fetching article content...' },
  { phase: 1, message: 'Connecting to WeChat...' },
  { phase: 2, message: 'Nano Banana Pro is reading...' },
  { phase: 2, message: 'Extracting key insights...' },
  { phase: 3, message: 'Structuring the layout...' },
  { phase: 3, message: 'Visualizing data points...' },
  { phase: 4, message: 'Polishing the pixels...' },
];

export function GeneratingState({ onCancel }: GeneratingStateProps) {
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Cycle through messages every 2 seconds
    const messageInterval = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % STATUS_MESSAGES.length);
    }, 2000);

    // Update progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) return 90; // Cap at 90% until actual completion
        return prev + Math.random() * 15;
      });
    }, 500);

    return () => {
      clearInterval(messageInterval);
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className='flex flex-1 justify-center items-center py-10 px-4 sm:px-6 lg:px-8'>
      <div className='w-full max-w-lg mx-auto'>
        <Card className='bg-content1 border border-default-200 shadow-sm'>
          <div className='p-8 flex flex-col items-center justify-start gap-8 text-center'>
            <div className='relative w-24 h-24 flex items-center justify-center text-success'>
              <motion.div
                animate={{ rotate: 360 }}
                className='text-6xl'
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'linear',
                }}
              >
                <svg
                  className='w-24 h-24'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={2}
                  viewBox='0 0 24 24'
                  xmlns='http://www.w3.org/2000/svg'
                >
                  <path
                    d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </motion.div>
            </div>
            <div className='flex flex-col items-center justify-center gap-4 w-full'>
              <h1 className='text-2xl font-bold leading-tight tracking-tight text-foreground'>
                Generating Your Infographic...
              </h1>
              <motion.p
                key={currentMessageIndex}
                animate={{ opacity: 1, y: 0 }}
                className='text-base font-normal leading-normal text-default-500'
                initial={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3 }}
              >
                {STATUS_MESSAGES[currentMessageIndex].message}
              </motion.p>
              <div className='w-full flex flex-col gap-3 pt-2'>
                <div className='rounded-full bg-success/20 h-2'>
                  <motion.div
                    animate={{ width: `${progress}%` }}
                    className='h-2 rounded-full bg-success'
                    initial={{ width: '0%' }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
              </div>
            </div>
            {onCancel && (
              <Button
                className='text-default-600 hover:bg-default-100'
                size='lg'
                variant='light'
                onClick={onCancel}
              >
                Cancel Generation
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
