'use client';

import { useMemo, useState, useEffect } from 'react';
import { Card } from '@heroui/card';
import { Button } from '@heroui/button';

import { generateWithFal, type ImageSize } from '@/lib/fal-client';
import { PROMPT_LIBRARY, type PromptCategory } from '@/lib/prompt-presets';
import { ErrorBoundary } from '@/components/error-boundary';
import { useSession } from '@/lib/auth-client';
import { useCreditsStore } from '@/lib/credits-store';
import { ImageUploadSection } from '@/components/dashboard/ImageUploadSection';
import { GenerationSettingsPanel } from '@/components/dashboard/GenerationSettingsPanel';
import { InfographicSettingsPanel } from '@/components/dashboard/InfographicSettingsPanel';
import { GeneratedGallery } from '@/components/dashboard/GeneratedGallery';
import { FirstTimeUserModal } from '@/components/first-time-user-modal';
import { API_CONFIG, CREDITS_CONFIG } from '@/config/app-config';

type GeneratedItem = { id: string; url: string };
type GenerationMode = 'headshot' | 'infographic';
type InfographicStyle =
  | 'FUN_PLAYFUL'
  | 'CLEAN_MINIMALIST'
  | 'DARK_MODE_TECH'
  | 'MODERN_EDITORIAL';

export function DashboardClient() {
  const { data: session } = useSession();
  const { creditInfo, fetchCredits } = useCreditsStore();

  // Mode selection
  const [mode, setMode] = useState<GenerationMode>('headshot');

  // Headshot generation states
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [category, setCategory] = useState<PromptCategory>('Professional');
  const [imageSize, setImageSize] = useState<ImageSize>(
    CREDITS_CONFIG.DEFAULT_IMAGE_SIZE
  );
  const [prompt, setPrompt] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [loadingSpinners, setLoadingSpinners] = useState<string[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  // Infographic generation states
  const [url, setUrl] = useState<string>('');
  const [infographicStyle, setInfographicStyle] =
    useState<InfographicStyle>('MODERN_EDITORIAL');
  const [language, setLanguage] = useState<string>('English');
  const [fetchedContent, setFetchedContent] = useState<string | null>(null);
  const [isFetchingContent, setIsFetchingContent] = useState<boolean>(false);

  const canGenerate = useMemo(() => {
    if (mode === 'headshot') {
      return (
        !!previewUrl &&
        !!referenceUrl &&
        creditInfo !== null &&
        creditInfo.total > 0
      );
    } else {
      return !!fetchedContent;
    }
  }, [mode, previewUrl, referenceUrl, creditInfo, fetchedContent]);

  // Load existing generations and credits on component mount
  useEffect(() => {
    if (session?.user.id) {
      loadExistingGenerations();
      fetchCredits();
    }
  }, [session?.user.id]);

  // Auto-populate prompt when category changes
  useEffect(() => {
    if (category && mode === 'headshot') {
      loadRandomPrompt();
    }
  }, [category, mode]);

  const loadRandomPrompt = () => {
    const categoryPresets = PROMPT_LIBRARY[category] || [];

    if (categoryPresets.length > 0) {
      const randomPreset =
        categoryPresets[Math.floor(Math.random() * categoryPresets.length)];

      setPrompt(randomPreset?.prompt || '');
    }
  };

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

  const handleGenerateInfographic = async () => {
    if (!fetchedContent) return;

    setIsGenerating(true);
    setError(null);

    const spinnerId = `loading-${Date.now()}`;

    setLoadingSpinners([spinnerId]);

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

      // The API returns an ID, we might need to poll for results
      // For now, we'll handle the result based on the API response structure
      if (result.data?.id) {
        // Task ID returned, would need polling logic here
        console.log('Infographic task started with ID:', result.data.id);
        setError(
          'Infographic generation started. Polling for results not yet implemented.'
        );
      } else if (result.data?.results?.[0]?.url) {
        // Direct result returned
        const newItem = {
          id: result.data.id || `infographic-${Date.now()}`,
          url: result.data.results[0].url,
        };

        setItems(prev => [newItem, ...prev]);
      }

      setLoadingSpinners([]);
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate infographic. Please try again.';

      setError(errorMessage);
    } finally {
      setIsGenerating(false);
      setLoadingSpinners([]);
    }
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;

    // Ensure we have a reference image
    if (!referenceUrl) {
      setError(
        'Please upload an image first. A reference image is required for generation.'
      );

      return;
    }

    // Double-check credits before starting
    if (creditInfo === null || creditInfo.total <= 0) {
      setError(
        'Insufficient credits. Please purchase more credits to continue generating images.'
      );

      return;
    }

    setIsGenerating(true);
    setError(null);

    // Create single loading spinner
    const spinnerId = `loading-${Date.now()}`;

    setLoadingSpinners([spinnerId]);

    try {
      const promptToUse = prompt.trim() || 'professional headshot';

      const result = await generateWithFal({
        prompt: promptToUse,
        numImages: 1, // Always generate single image
        imageSize: imageSize,
        style: 'REALISTIC',
        renderingSpeed: 'BALANCED',
        referenceImageUrl: referenceUrl, // Always required now
      });

      if (
        result?.images &&
        Array.isArray(result.images) &&
        result.images.length > 0
      ) {
        const newItem = {
          id: `${result.requestId}-0`,
          url: result.images[0].url,
        };

        setItems(prev => [newItem, ...prev]); // Add to beginning for newest first
        setLoadingSpinners([]); // Clear loading spinners

        // Record the generation in the database
        try {
          const response = await fetch(API_CONFIG.ENDPOINTS.RECORD_GENERATION, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: promptToUse,
              category,
              numImages: CREDITS_CONFIG.DEFAULT_NUM_IMAGES,
              imageUrls: [result.images[0].url],
              imageSize: imageSize,
              style: 'REALISTIC',
              renderingSpeed: CREDITS_CONFIG.DEFAULT_RENDERING_SPEED,
              falRequestId: result.requestId,
            }),
          });

          if (response.ok) {
            // Refresh credits from server to get accurate breakdown
            await fetchCredits();
          } else if (response.status === 402) {
            throw new Error(
              'Insufficient credits. Please purchase more credits to continue generating images.'
            );
          }
        } catch (dbError) {
          console.error('Error recording generation:', dbError);
          // Don't throw here as the generation was successful, just the recording failed
        }
      } else {
        throw new Error('Invalid response from FAL API');
      }
    } catch (err) {
      console.error('Generation error:', err);
      const errorMessage =
        err instanceof Error
          ? err.message
          : 'Failed to generate images. Please try again.';

      setError(errorMessage);
    } finally {
      setIsGenerating(false);
      setLoadingSpinners([]); // Clear loading spinners on error too
    }
  };

  return (
    <ErrorBoundary>
      {session?.user.id && <FirstTimeUserModal userId={session.user.id} />}
      <section className='w-full min-h-screen'>
        <div className='w-full px-6 py-8'>
          <div className='container mx-auto max-w-7xl'>
            {/* Mode Switcher */}
            <div className='mb-6 flex justify-center gap-4'>
              <Button
                color={mode === 'headshot' ? 'primary' : 'default'}
                size='lg'
                variant={mode === 'headshot' ? 'solid' : 'bordered'}
                onPress={() => setMode('headshot')}
              >
                Headshot Generator
              </Button>
              <Button
                color={mode === 'infographic' ? 'primary' : 'default'}
                size='lg'
                variant={mode === 'infographic' ? 'solid' : 'bordered'}
                onPress={() => setMode('infographic')}
              >
                Infographic Generator
              </Button>
            </div>

            <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
              <div className='lg:col-span-4 xl:col-span-3'>
                <div className='lg:sticky lg:top-20 flex flex-col gap-6'>
                  {mode === 'headshot' && (
                    <>
                      <ImageUploadSection
                        error={error}
                        previewUrl={previewUrl}
                        onPreviewChange={setPreviewUrl}
                        onReferenceChange={setReferenceUrl}
                      />
                      <Card className='bg-content1/60 border border-default-100'>
                        <div className='p-6 flex flex-col gap-6'>
                          <GenerationSettingsPanel
                            canGenerate={canGenerate}
                            category={category}
                            credits={creditInfo?.total ?? null}
                            imageSize={imageSize}
                            isGenerating={isGenerating}
                            prompt={prompt}
                            onCategoryChange={setCategory}
                            onGenerate={handleGenerate}
                            onImageSizeChange={setImageSize}
                            onLoadRandomPrompt={loadRandomPrompt}
                            onPromptChange={setPrompt}
                          />
                        </div>
                      </Card>
                    </>
                  )}

                  {mode === 'infographic' && (
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
                  )}
                </div>
              </div>

              <div className='lg:col-span-8 xl:col-span-9'>
                <GeneratedGallery
                  isLoadingExisting={isLoadingExisting}
                  items={items}
                  loadingSpinners={loadingSpinners}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </ErrorBoundary>
  );
}
