'use client';

import { Button } from '@heroui/button';
import Image from 'next/image';

interface ResultDisplayProps {
  title: string;
  imageUrl: string;
  onDownload: () => void;
  onNewGeneration: () => void;
}

export function ResultDisplay({
  title,
  imageUrl,
  onDownload,
  onNewGeneration,
}: ResultDisplayProps) {
  return (
    <div className='flex flex-col min-h-screen'>
      <main className='flex flex-1 flex-col items-center py-10 sm:py-16 px-4'>
        <div className='w-full max-w-4xl'>
          {/* Page Heading */}
          <div className='mb-8 text-center'>
            <p className='text-default-500 text-base font-normal leading-normal'>
              Infographic Result
            </p>
            <h1 className='text-foreground text-3xl sm:text-4xl font-black tracking-tighter mt-1'>
              {title}
            </h1>
          </div>

          {/* Infographic Preview */}
          <div className='w-full shadow-medium rounded-xl border border-default-200 bg-content1'>
            <div className='w-full gap-1 overflow-hidden bg-content1 p-2 sm:p-4 rounded-xl flex'>
              <div className='w-full bg-center bg-no-repeat bg-cover rounded-lg flex-1 relative aspect-[2/3]'>
                <Image
                  fill
                  alt={`Generated infographic about ${title}`}
                  className='object-contain'
                  src={imageUrl}
                />
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Floating Action Bar */}
      <div className='sticky bottom-0 z-10 w-full flex justify-center p-4'>
        <div className='flex flex-col sm:flex-row flex-wrap gap-3 p-3 max-w-lg w-full justify-center bg-content1/95 backdrop-blur-sm shadow-large rounded-xl border border-default-200'>
          <Button
            className='flex items-center justify-center gap-2 grow bg-primary text-white'
            size='lg'
            startContent={
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
            onClick={onDownload}
          >
            Download Infographic
          </Button>
          <Button
            className='flex items-center justify-center gap-2 grow'
            size='lg'
            startContent={
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
            }
            variant='bordered'
            onClick={onNewGeneration}
          >
            Paste Another URL
          </Button>
        </div>
      </div>
    </div>
  );
}
