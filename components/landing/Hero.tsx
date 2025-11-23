'use client';

import { useState } from 'react';
import { Button } from '@heroui/button';
import { Input } from '@heroui/input';
import { motion, Variants } from 'framer-motion';
import { useRouter } from 'next/navigation';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  },
};

const staggerContainer: Variants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08, delayChildren: 0.1 } },
};

export function Hero() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isWeChatUrl, setIsWeChatUrl] = useState(false);
  const router = useRouter();

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
      setIsValidUrl(isValid);
      
      // Check if it's a WeChat URL - validate the hostname specifically
      const isWeChat = urlObj.hostname === 'mp.weixin.qq.com' || urlObj.hostname.endsWith('.mp.weixin.qq.com');
      setIsWeChatUrl(isWeChat);
      
      return isValid;
    } catch {
      setIsValidUrl(false);
      setIsWeChatUrl(false);
      return false;
    }
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    if (value.trim()) {
      validateUrl(value.trim());
    } else {
      setIsValidUrl(false);
      setIsWeChatUrl(false);
    }
  };

  const handleGenerate = () => {
    if (isValidUrl) {
      // Navigate to generating page with URL parameter
      router.push(`/dashboard?url=${encodeURIComponent(url)}`);
    }
  };

  return (
    <section className='w-full min-h-screen snap-start flex items-center justify-center overflow-hidden'>
      <div className='container mx-auto max-w-2xl px-4 sm:px-6 py-6 md:py-8 w-full'>
        <motion.div
          animate='visible'
          className='flex flex-col items-center justify-center text-center gap-8'
          initial='hidden'
          variants={staggerContainer}
        >
          <motion.div className='flex flex-col gap-4' variants={fadeUp}>
            <h1 className='text-4xl font-black leading-tight tracking-tighter md:text-5xl'>
              Turn your URLs into clean infographics in seconds.
            </h1>
            <h2 className='text-base font-normal leading-normal text-default-500 md:text-lg'>
              Support WeChat Articles, Blogs, and News.
            </h2>
          </motion.div>

          <motion.div
            className='w-full max-w-xl bg-content1 rounded-xl shadow-lg p-6 md:p-8'
            variants={fadeUp}
          >
            <div className='flex flex-col gap-4'>
              <div className='flex flex-col w-full h-14 md:h-16'>
                <div className='flex w-full flex-1 items-stretch rounded-lg h-full border-2 border-default-200 focus-within:ring-2 focus-within:ring-success focus-within:border-success'>
                  <div className='text-default-400 flex items-center justify-center pl-4'>
                    <svg
                      className='w-6 h-6'
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
                  </div>
                  <input
                    className='flex-1 bg-transparent px-3 text-sm md:text-base font-normal leading-normal text-foreground placeholder:text-default-400 focus:outline-none'
                    placeholder='Paste your article URL here...'
                    type='url'
                    value={url}
                    onChange={e => handleUrlChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && isValidUrl) {
                        handleGenerate();
                      }
                    }}
                  />
                  {isWeChatUrl && (
                    <div className='flex items-center justify-center pr-4'>
                      <svg
                        className='h-6 w-6 text-success'
                        fill='currentColor'
                        viewBox='0 0 24 24'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path d='M12 2C6.486 2 2 6.041 2 11.021C2 14.125 3.653 16.892 6.241 18.539L5.01 22L9.279 20.027C10.154 20.158 11.063 20.223 12 20.223C17.514 20.223 22 16.203 22 11.223C22 6.242 17.514 2 12 2ZM9.898 12.879C9.898 13.521 9.388 14.031 8.746 14.031C8.104 14.031 7.594 13.521 7.594 12.879V12.783C7.594 12.141 8.104 11.631 8.746 11.631C9.388 11.631 9.898 12.141 9.898 12.783V12.879ZM16.398 12.879C16.398 13.521 15.888 14.031 15.246 14.031C14.604 14.031 14.094 13.521 14.094 12.879V12.783C14.094 12.141 14.604 11.631 15.246 11.631C15.888 11.631 16.398 12.141 16.398 12.783V12.879Z' />
                      </svg>
                    </div>
                  )}
                </div>
              </div>
              <Button
                className='w-full h-12 px-5 bg-success text-white text-base font-bold leading-normal tracking-wide'
                isDisabled={!isValidUrl}
                size='lg'
                onClick={handleGenerate}
              >
                Generate Infographic
              </Button>
            </div>
          </motion.div>

          <motion.p
            className='text-default-400 text-sm font-normal leading-normal'
            variants={fadeUp}
          >
            Powered by Nano Banana Pro
          </motion.p>
        </motion.div>
      </div>
    </section>
  );
}
