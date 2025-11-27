'use client';

import type { Selection } from '@react-types/shared';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@heroui/button';
import { Select, SelectItem } from '@heroui/select';
import { motion, Variants, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

import { API_CONFIG } from '@/config/app-config';
import { ImageLightbox } from '@/components/image-lightbox';
import { ZoomIcon } from '@/components/icons';

// Polling configuration
const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 300000;

type GenerationStep = 'idle' | 'fetching' | 'generating' | 'completed' | 'error';

// Style options
const INFOGRAPHIC_STYLES = [
  { key: 'FUN_PLAYFUL', label: 'Fun & Playful' },
  { key: 'CLEAN_MINIMALIST', label: 'Clean Minimalist' },
  { key: 'DARK_MODE_TECH', label: 'Dark Mode Tech' },
  { key: 'MODERN_EDITORIAL', label: 'Modern Editorial' },
] as const;

type InfographicStyle = (typeof INFOGRAPHIC_STYLES)[number]['key'];

// Language options
const LANGUAGE_OPTIONS = [
  { key: 'Chinese', label: '中文' },
  { key: 'English', label: 'English' },
  { key: 'Japanese', label: '日本語' },
  { key: 'Korean', label: '한국어' },
  { key: 'Spanish', label: 'Español' },
  { key: 'French', label: 'Français' },
  { key: 'German', label: 'Deutsch' },
] as const;

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

const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.9,
    transition: { duration: 0.3 },
  },
};

export function Hero() {
  const [url, setUrl] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(false);
  const [isWeChatUrl, setIsWeChatUrl] = useState(false);
  const [step, setStep] = useState<GenerationStep>('idle');
  const [error, setError] = useState<string | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [infographicStyle, setInfographicStyle] = useState<InfographicStyle>('MODERN_EDITORIAL');
  const [language, setLanguage] = useState('Chinese');

  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (pollTimeoutRef.current) clearTimeout(pollTimeoutRef.current);
    };
  }, []);

  const validateUrl = (inputUrl: string) => {
    try {
      const urlObj = new URL(inputUrl);
      const isValid = urlObj.protocol === 'http:' || urlObj.protocol === 'https:';

      setIsValidUrl(isValid);

      const isWeChat =
        urlObj.hostname === 'mp.weixin.qq.com' ||
        urlObj.hostname.endsWith('.mp.weixin.qq.com');

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

  const clearPollingRefs = () => {
    if (pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = null;
    }
    if (pollTimeoutRef.current) {
      clearTimeout(pollTimeoutRef.current);
      pollTimeoutRef.current = null;
    }
  };

  const handleGenerate = async () => {
    if (!isValidUrl) return;

    setStep('fetching');
    setError(null);
    setProgress(0);

    try {
      // Step 1: Fetch content from URL
      const fetchResponse = await fetch(API_CONFIG.ENDPOINTS.FETCH_CONTENT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      if (!fetchResponse.ok) {
        throw new Error('Failed to fetch content from URL');
      }

      const fetchData = await fetchResponse.json();
      const content = fetchData.content;

      // Step 2: Generate infographic
      setStep('generating');
      setProgress(10);

      const generateResponse = await fetch(API_CONFIG.ENDPOINTS.GENERATE_INFOGRAPHIC, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          structuralSummary: content,
          style: infographicStyle,
          language: language,
        }),
      });

      if (!generateResponse.ok) {
        throw new Error('Failed to generate infographic');
      }

      const generateResult = await generateResponse.json();

      if (generateResult.data?.id) {
        const taskId = generateResult.data.id;

        // Poll for results
        clearPollingRefs();

        pollIntervalRef.current = setInterval(async () => {
          try {
            const pollResponse = await fetch(
              `${API_CONFIG.ENDPOINTS.POLL_INFOGRAPHIC}?taskId=${taskId}`
            );

            if (!pollResponse.ok) return;

            const pollData = await pollResponse.json();

            // Update progress
            if (pollData.data?.progress) {
              setProgress(pollData.data.progress);
            }

            if (
              pollData.data?.status === 'succeeded' &&
              pollData.data?.results?.[0]?.url
            ) {
              clearPollingRefs();
              setGeneratedImageUrl(pollData.data.results[0].url);
              setStep('completed');
            } else if (pollData.data?.status === 'failed') {
              clearPollingRefs();
              setError(pollData.data?.failure_reason || 'Generation failed');
              setStep('error');
            }
          } catch (pollError) {
            console.error('Polling error:', pollError);
          }
        }, POLL_INTERVAL_MS);

        // Timeout
        pollTimeoutRef.current = setTimeout(() => {
          clearPollingRefs();
          setError('Generation timed out. Please try again.');
          setStep('error');
        }, POLL_TIMEOUT_MS);
      } else if (generateResult.data?.results?.[0]?.url) {
        // Direct result
        setGeneratedImageUrl(generateResult.data.results[0].url);
        setStep('completed');
      } else {
        throw new Error('Unexpected response format');
      }
    } catch (err) {
      console.error('Generation error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setStep('error');
    }
  };

  const handleReset = () => {
    setStep('idle');
    setUrl('');
    setError(null);
    setGeneratedImageUrl(null);
    setProgress(0);
    setIsValidUrl(false);
    setIsWeChatUrl(false);
    clearPollingRefs();
  };

  const handleDownload = async () => {
    if (!generatedImageUrl) return;

    try {
      const response = await fetch(generatedImageUrl);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');

      link.href = downloadUrl;
      link.download = `infographic-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Download error:', err);
    }
  };

  // Render different UI based on step
  const renderContent = () => {
    switch (step) {
      case 'fetching':
      case 'generating':
        return (
          <motion.div
            key="generating"
            animate="visible"
            className="w-full max-w-xl"
            exit="exit"
            initial="hidden"
            variants={scaleIn}
          >
            <div className="bg-content1 rounded-2xl shadow-xl p-8 md:p-12">
              <div className="flex flex-col items-center gap-6">
                {/* Animated loader */}
                <div className="relative w-24 h-24">
                  <div className="absolute inset-0 rounded-full border-4 border-default-200" />
                  <div
                    className="absolute inset-0 rounded-full border-4 border-success border-t-transparent animate-spin"
                    style={{ animationDuration: '1s' }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-success">
                      {step === 'fetching' ? '📄' : `${progress}%`}
                    </span>
                  </div>
                </div>

                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {step === 'fetching' ? 'Fetching Content...' : 'Creating Your Infographic...'}
                  </h3>
                  <p className="text-default-500">
                    {step === 'fetching'
                      ? 'Extracting article content from the URL'
                      : 'AI is designing your beautiful infographic'}
                  </p>
                </div>

                {/* Progress steps */}
                <div className="flex items-center gap-2 mt-4">
                  <div className={`w-3 h-3 rounded-full ${step === 'fetching' ? 'bg-success animate-pulse' : 'bg-success'}`} />
                  <div className={`w-8 h-0.5 ${step === 'generating' ? 'bg-success' : 'bg-default-200'}`} />
                  <div className={`w-3 h-3 rounded-full ${step === 'generating' ? 'bg-success animate-pulse' : 'bg-default-200'}`} />
                  <div className="w-8 h-0.5 bg-default-200" />
                  <div className="w-3 h-3 rounded-full bg-default-200" />
                </div>
                <div className="flex items-center justify-between w-40 text-xs text-default-400">
                  <span>Fetch</span>
                  <span>Generate</span>
                  <span>Done</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 'completed':
        return (
          <motion.div
            key="completed"
            animate="visible"
            className="w-full max-w-4xl"
            exit="exit"
            initial="hidden"
            variants={scaleIn}
          >
            <div className="bg-content1 rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col items-center gap-6">
                {/* Success badge */}
                <div className="flex items-center gap-2 text-success">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      clipRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      fillRule="evenodd"
                    />
                  </svg>
                  <span className="font-semibold">Infographic Created!</span>
                </div>

                {/* Generated image with lightbox */}
                {generatedImageUrl && (
                  <ImageLightbox alt="Generated Infographic" src={generatedImageUrl}>
                    <div className="relative w-full rounded-xl overflow-hidden border border-default-200 shadow-lg group cursor-pointer">
                      {/* Image container - auto height based on image aspect ratio */}
                      <div className="relative w-full">
                        <Image
                          alt="Generated Infographic"
                          className="w-full h-auto object-contain"
                          height={600}
                          src={generatedImageUrl}
                          unoptimized
                          width={1200}
                        />
                      </div>
                      
                      {/* Hover overlay with zoom icon */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 shadow-lg transform scale-90 group-hover:scale-100 transition-transform duration-300">
                          <ZoomIcon className="w-8 h-8 text-gray-800" />
                        </div>
                      </div>
                      
                      {/* Click hint */}
                      <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center gap-1.5">
                        <ZoomIcon className="w-3.5 h-3.5" />
                        <span>Click to zoom</span>
                      </div>
                    </div>
                  </ImageLightbox>
                )}

                {/* Action buttons */}
                <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md">
                  <Button
                    className="flex-1 font-semibold"
                    color="success"
                    size="lg"
                    startContent={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    onPress={handleDownload}
                  >
                    Download
                  </Button>
                  <Button
                    className="flex-1 font-semibold"
                    color="default"
                    size="lg"
                    variant="bordered"
                    startContent={
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                        <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    }
                    onPress={handleReset}
                  >
                    Generate Another
                  </Button>
                </div>

                {/* Note about image expiry */}
                <p className="text-xs text-default-400 text-center">
                  💡 Images expire in 2 hours. Please download to keep.
                </p>
              </div>
            </div>
          </motion.div>
        );

      case 'error':
        return (
          <motion.div
            key="error"
            animate="visible"
            className="w-full max-w-xl"
            exit="exit"
            initial="hidden"
            variants={scaleIn}
          >
            <div className="bg-content1 rounded-2xl shadow-xl p-8">
              <div className="flex flex-col items-center gap-6">
                <div className="w-16 h-16 rounded-full bg-danger/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-danger" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-bold text-foreground mb-2">Something went wrong</h3>
                  <p className="text-default-500">{error}</p>
                </div>
                <Button
                  color="primary"
                  size="lg"
                  onPress={handleReset}
                >
                  Try Again
                </Button>
              </div>
            </div>
          </motion.div>
        );

      default: // idle
        return (
          <motion.div
            key="idle"
            animate="visible"
            className="w-full max-w-xl bg-content1 rounded-xl shadow-lg p-6 md:p-8"
            exit="exit"
            initial="hidden"
            variants={fadeUp}
          >
            <div className="flex flex-col gap-4">
              {/* URL Input */}
              <div className="flex flex-col w-full h-14 md:h-16">
                <div className="flex w-full flex-1 items-stretch rounded-lg h-full border-2 border-default-200 focus-within:ring-2 focus-within:ring-success focus-within:border-success">
                  <div className="text-default-400 flex items-center justify-center pl-4">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <input
                    className="flex-1 bg-transparent px-3 text-sm md:text-base font-normal leading-normal text-foreground placeholder:text-default-400 focus:outline-none"
                    placeholder="Paste your article URL here..."
                    type="url"
                    value={url}
                    onChange={e => handleUrlChange(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && isValidUrl) {
                        handleGenerate();
                      }
                    }}
                  />
                  {isWeChatUrl && (
                    <div className="flex items-center justify-center pr-4">
                      <svg
                        className="h-6 w-6 text-success"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M12 2C6.486 2 2 6.041 2 11.021C2 14.125 3.653 16.892 6.241 18.539L5.01 22L9.279 20.027C10.154 20.158 11.063 20.223 12 20.223C17.514 20.223 22 16.203 22 11.223C22 6.242 17.514 2 12 2ZM9.898 12.879C9.898 13.521 9.388 14.031 8.746 14.031C8.104 14.031 7.594 13.521 7.594 12.879V12.783C7.594 12.141 8.104 11.631 8.746 11.631C9.388 11.631 9.898 12.141 9.898 12.783V12.879ZM16.398 12.879C16.398 13.521 15.888 14.031 15.246 14.031C14.604 14.031 14.094 13.521 14.094 12.879V12.783C14.094 12.141 14.604 11.631 15.246 11.631C15.888 11.631 16.398 12.141 16.398 12.783V12.879Z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Style and Language Selectors */}
              <div className="grid grid-cols-2 gap-3">
                <Select
                  aria-label="Infographic Style"
                  classNames={{
                    trigger: 'h-12 bg-default-100 border-2 border-default-200 hover:border-default-300',
                    value: 'text-sm',
                  }}
                  placeholder="Select style"
                  selectedKeys={[infographicStyle]}
                  size="md"
                  variant="flat"
                  onSelectionChange={(keys: Selection) => {
                    if (keys === 'all') return;
                    const key = Array.from(keys)[0];
                    if (typeof key === 'string') {
                      setInfographicStyle(key as InfographicStyle);
                    }
                  }}
                >
                  {INFOGRAPHIC_STYLES.map(styleOption => (
                    <SelectItem key={styleOption.key}>{styleOption.label}</SelectItem>
                  ))}
                </Select>

                <Select
                  aria-label="Language"
                  classNames={{
                    trigger: 'h-12 bg-default-100 border-2 border-default-200 hover:border-default-300',
                    value: 'text-sm',
                  }}
                  placeholder="Select language"
                  selectedKeys={[language]}
                  size="md"
                  variant="flat"
                  onSelectionChange={(keys: Selection) => {
                    if (keys === 'all') return;
                    const key = Array.from(keys)[0];
                    if (typeof key === 'string') {
                      setLanguage(key);
                    }
                  }}
                >
                  {LANGUAGE_OPTIONS.map(langOption => (
                    <SelectItem key={langOption.key}>{langOption.label}</SelectItem>
                  ))}
                </Select>
              </div>

              {/* Generate Button */}
              <Button
                className="w-full h-12 px-5 bg-success text-white text-base font-bold leading-normal tracking-wide"
                isDisabled={!isValidUrl}
                size="lg"
                onPress={handleGenerate}
              >
                Generate Infographic
              </Button>
            </div>
          </motion.div>
        );
    }
  };

  return (
    <section className="w-full min-h-screen snap-start flex items-center justify-center overflow-hidden">
      <div className="container mx-auto max-w-2xl px-4 sm:px-6 py-6 md:py-8 w-full">
        <motion.div
          animate="visible"
          className="flex flex-col items-center justify-center text-center gap-8"
          initial="hidden"
          variants={staggerContainer}
        >
          {step === 'idle' && (
            <motion.div className="flex flex-col gap-4" variants={fadeUp}>
              <h1 className="text-4xl font-black leading-tight tracking-tighter md:text-5xl">
                Turn your URLs into clean infographics in seconds.
              </h1>
              <h2 className="text-base font-normal leading-normal text-default-500 md:text-lg">
                Support WeChat Articles, Blogs, and News.
              </h2>
            </motion.div>
          )}

          <AnimatePresence mode="wait">
            {renderContent()}
          </AnimatePresence>

          {step === 'idle' && (
            <motion.p
              className="text-default-400 text-sm font-normal leading-normal"
              variants={fadeUp}
            >
              Powered by Nano Banana Pro
            </motion.p>
          )}
        </motion.div>
      </div>
    </section>
  );
}
