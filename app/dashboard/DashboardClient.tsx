'use client';

import { useState, useEffect, useRef } from 'react';
import { Card } from '@heroui/card';

import { ErrorBoundary } from '@/components/error-boundary';
import { useSession } from '@/lib/auth-client';
import { InfographicSettingsPanel } from '@/components/dashboard/InfographicSettingsPanel';
import { GeneratedGallery } from '@/components/dashboard/GeneratedGallery';
import { GeneratingState } from '@/components/dashboard/generating/GeneratingState';
import { API_CONFIG } from '@/config/app-config';
import { type InfographicStyle } from '@/lib/infographic-styles';

// Polling configuration
const POLL_INTERVAL_MS = 3000; // 3 seconds
const POLL_TIMEOUT_MS = 300000; // 5 minutes

type GeneratedItem = { id: string; url: string };

export function DashboardClient() {
  const { data: session } = useSession();

  // Generation states
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  // Infographic generation states
  const [url, setUrl] = useState<string>('');
  const [infographicStyle, setInfographicStyle] =
    useState<InfographicStyle>('MODERN_EDITORIAL');
  const [language, setLanguage] = useState<string>('English');
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);

  // Ref to track polling interval for cleanup
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const pollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Helper function to clear polling refs
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

  const canGenerate = !!fetchedContent;

  // Cleanup polling intervals on component unmount
  useEffect(() => {
    return () => {
      clearPollingRefs();
    };
  }, []);

  // Load existing generations on component mount
  useEffect(() => {
    if (session?.user.id) {
      loadExistingGenerations();
    }
  }, [session?.user.id]);

  const loadExistingGenerations = async () => {
    try {
      setIsLoadingExisting(true);
      const response = await fetch(API_CONFIG.ENDPOINTS.USER_GENERATIONS);

      if (response.ok) {
        const data = await response.json();
        // Convert generations to items format
        const existingItems: GeneratedItem[] = data.generations.flatMap(
          (gen: { id: string; imageUrls: string[] }) =>
            gen.imageUrls.map((url: string, idx: number) => ({
              id: `${gen.id}-${idx}`,
              url: url,
            }))
        );

        setItems(existingItems);
      }
    } catch (error) {
      console.error('Error loading existing generations:', error);
    } finally {
      setIsLoadingExisting(false);
    }
  };

  const handleFetchContent = async () => {
    if (!url) return;

    setIsFetchingContent(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.FETCH_CONTENT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch content from URL');
      }

      const data = await response.json();

      setFetchedContent(data.content);
    } catch (err) {
      console.error('Fetch content error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to fetch content. Please try again.';

      setError(errorMessage);
    } finally {
      setIsFetchingContent(false);
    }
  };

  // Helper function to add a generated infographic to the gallery
  const addInfographicToGallery = (id: string, url: string) => {
    const newItem = { id, url };

    setItems(prev => [newItem, ...prev]);
    setIsGenerating(false);
  };

  const handleGenerateInfographic = async () => {
    if (!fetchedContent) return;

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch(API_CONFIG.ENDPOINTS.GENERATE_INFOGRAPHIC, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          structuralSummary: fetchedContent,
          style: infographicStyle,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate infographic');
      }

      const result = await response.json();

      // The API returns an ID for polling in result.data.id
      console.log('Generate infographic result:', result);

      if (result.data?.id) {
        const taskId = result.data.id;

        console.log('Infographic task started with ID:', taskId);

        // Clear any existing polling intervals
        clearPollingRefs();

        // Poll for results
        pollIntervalRef.current = setInterval(async () => {
          try {
            const pollResponse = await fetch(
              `${API_CONFIG.ENDPOINTS.POLL_INFOGRAPHIC}?taskId=${taskId}`
            );

            if (!pollResponse.ok) {
              console.error('Poll request failed:', pollResponse.status);
              return;
            }

            const pollData = await pollResponse.json();

            console.log('Poll response:', pollData);

            if (
              pollData.data?.status === 'succeeded' &&
              pollData.data?.results?.[0]?.url
            ) {
              console.log(
                'Infographic succeeded! URL:',
                pollData.data.results[0].url
              );
              clearPollingRefs();
              addInfographicToGallery(taskId, pollData.data.results[0].url);
            } else if (pollData.data?.status === 'failed') {
              console.error(
                'Infographic failed:',
                pollData.data?.failure_reason
              );
              clearPollingRefs();
              setError(
                pollData.data?.failure_reason || 'Infographic generation failed'
              );
              setIsGenerating(false);
            } else if (
              pollData.data?.status === 'pending' ||
              pollData.data?.status === 'running'
            ) {
              console.log(
                'Infographic still in progress, status:',
                pollData.data?.status
              );
            } else {
              console.warn(
                'Unexpected poll response status:',
                pollData.data?.status,
                pollData
              );
            }
          } catch (pollError) {
            console.error('Polling error:', pollError);
          }
        }, POLL_INTERVAL_MS);

        // Stop polling after timeout
        pollTimeoutRef.current = setTimeout(() => {
          clearPollingRefs();
          setError('Infographic generation timed out. Please try again.');
          setIsGenerating(false);
        }, POLL_TIMEOUT_MS);
      } else if (result.data?.results?.[0]?.url) {
        // Direct result returned (without polling, already completed)
        console.log(
          'Infographic completed immediately! URL:',
          result.data.results[0].url
        );
        addInfographicToGallery(
          result.data.id || `infographic-${Date.now()}`,
          result.data.results[0].url
        );
      } else {
        console.error('Unexpected response format:', result);
        throw new Error('Unexpected response format from API');
      }
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate infographic. Please try again.';

      setError(errorMessage);
      setIsGenerating(false);
    }
  };

  return (
    <ErrorBoundary>
      <section className='w-full min-h-screen'>
        <div className='w-full px-6 py-8'>
          <div className='container mx-auto max-w-7xl'>
            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              <div className='lg:col-span-4 xl:col-span-3'>
                <div className='lg:sticky lg:top-20 flex flex-col gap-6'>
                  <Card className='bg-content1/60 border border-default-100'>
                    <div className='p-6 flex flex-col gap-6'>
                      <InfographicSettingsPanel
                        canGenerate={canGenerate}
                        isFetchingContent={isFetchingContent}
                        isGenerating={isGenerating}
                        language={language}
                        style={infographicStyle}
                        url={url}
                        onFetchContent={handleFetchContent}
                        onGenerateInfographic={handleGenerateInfographic}
                        onLanguageChange={setLanguage}
                        onStyleChange={setInfographicStyle}
                        onUrlChange={setUrl}
                      />
                      {error && (
                        <div className='text-danger text-sm p-4 bg-danger-50 rounded-lg'>
                          {error}
                        </div>
                      )}
                      {fetchedContent && (
                        <div className='text-success text-sm p-4 bg-success-50 rounded-lg'>
                          ✓ Content fetched successfully!
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>

              <div className='lg:col-span-8 xl:col-span-9'>
                {isGenerating ? (
                  <GeneratingState
                    onCancel={() => {
                      clearPollingRefs();
                      setIsGenerating(false);
                      setError(null);
                    }}
                  />
                ) : (
                  <GeneratedGallery
                    isLoadingExisting={isLoadingExisting}
                    items={items}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
