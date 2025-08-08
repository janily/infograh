"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Input, Textarea } from "@heroui/input";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Select, SelectItem } from "@heroui/select";
import type { Selection } from "@react-types/shared";
import { generateWithFal, uploadToFal } from "@/lib/fal-client";
import { ALL_CATEGORIES, PROMPT_LIBRARY, type PromptCategory } from "@/lib/prompt-presets";
import { ErrorBoundary } from "@/components/error-boundary";
import { SafeImage } from "@/components/safe-image";
import { ImageLightbox } from "@/components/image-lightbox";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@heroui/spinner";
import { useCreditsStore } from "@/lib/credits-store";

type GeneratedItem = { id: string; url: string };

export function DashboardClient() {
  const { data: session } = useSession();
  const { credits, decrementCredits } = useCreditsStore();
  const fileRef = useRef<HTMLInputElement | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [referenceUrl, setReferenceUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [items, setItems] = useState<GeneratedItem[]>([]);
  const [category, setCategory] = useState<PromptCategory>("Professional");
  const [prompt, setPrompt] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loadingSpinners, setLoadingSpinners] = useState<string[]>([]);
  const [isLoadingExisting, setIsLoadingExisting] = useState(true);

  const canGenerate = useMemo(() => {
    return !!previewUrl && credits !== null && credits > 0;
  }, [previewUrl, credits]);

  // Load existing generations on component mount
  useEffect(() => {
    if (session?.user.id) {
      loadExistingGenerations();
    }
  }, [session?.user.id]);

  const loadExistingGenerations = async () => {
    try {
      setIsLoadingExisting(true);
      const response = await fetch('/api/user/generations');
      if (response.ok) {
        const data = await response.json();
        // Convert generations to items format
        const existingItems: GeneratedItem[] = data.generations.flatMap((gen: any) => 
          gen.imageUrls.map((url: string, idx: number) => ({
            id: `${gen.id}-${idx}`,
            url: url
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



  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];
    if (!file) {
      setPreviewUrl(null);
      setReferenceUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    uploadToFal(file)
      .then((remoteUrl) => setReferenceUrl(remoteUrl))
      .catch(() => setReferenceUrl(null));
  };

  const handleGenerate = async () => {
    if (!canGenerate) return;
    
    // Double-check credits before starting
    if (credits === null || credits <= 0) {
      setError("Insufficient credits. Please purchase more credits to continue generating images.");
      return;
    }
    
    setIsGenerating(true);
    setError(null);
    
    // Create single loading spinner
    const spinnerId = `loading-${Date.now()}`;
    setLoadingSpinners([spinnerId]);
    
    try {
      const categoryPresets = PROMPT_LIBRARY[category] || [];
      const randomPreset = categoryPresets[Math.floor(Math.random() * categoryPresets.length)];
      const promptToUse = prompt && prompt.trim().length > 0 ? prompt : randomPreset?.prompt || "";
      if (!prompt || prompt.trim().length === 0) setPrompt(promptToUse);

      const result = await generateWithFal({
        prompt: promptToUse,
        numImages: 1, // Always generate single image
        imageSize: "square_hd",
        style: "AUTO",
        renderingSpeed: "BALANCED",
        referenceImageUrl: referenceUrl ?? undefined,
      });
      
      if (result?.images && Array.isArray(result.images) && result.images.length > 0) {
        const newItem = { id: `${result.requestId}-0`, url: result.images[0].url };
        setItems((prev) => [newItem, ...prev]); // Add to beginning for newest first
        setLoadingSpinners([]); // Clear loading spinners

        // Record the generation in the database
        try {
          const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: promptToUse,
              category,
              numImages: 1,
              imageUrls: [result.images[0].url],
              imageSize: "square_hd",
              style: "AUTO",
              renderingSpeed: "BALANCED",
              falRequestId: result.requestId,
            }),
          });

          if (response.ok) {
            // Decrement credits in store
            decrementCredits(1);
          } else if (response.status === 402) {
            throw new Error("Insufficient credits. Please purchase more credits to continue generating images.");
          }
        } catch (dbError) {
          console.error("Error recording generation:", dbError);
          // Don't throw here as the generation was successful, just the recording failed
        }
      } else {
        throw new Error("Invalid response from FAL API");
      }
    } catch (err) {
      console.error("Generation error:", err);
      const errorMessage = err instanceof Error ? err.message : "Failed to generate images. Please try again.";
      setError(errorMessage);
    } finally {
      setIsGenerating(false);
      setLoadingSpinners([]); // Clear loading spinners on error too
    }
  };

  const handleClear = () => {
    setItems([]);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <section className="w-full">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="lg:sticky lg:top-20 flex flex-col gap-6">
                <Card className="bg-content1/60 border border-default-100">
                <CardHeader className="text-large font-semibold">Upload</CardHeader>
                <CardBody className="flex flex-col gap-6">
                    <Input ref={fileRef as any} type="file" accept="image/*" aria-label="Upload your image" onChange={handleFileChange} />

                    {previewUrl && (
                      <div className="flex justify-center">
                        <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-default-100 bg-content2/50">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={previewUrl} alt="Preview" className="object-contain object-center w-full h-full" />
                        </div>
                      </div>
                    )}

                    {error && (
                      <Card className="border-danger-200 bg-danger-50">
                        <CardBody className="text-center">
                          <p className="text-danger text-sm">{error}</p>
                        </CardBody>
                      </Card>
                    )}

                  <div className="flex w-full flex-wrap md:flex-nowrap gap-4">
                    <Select
                      className="max-w-xs"
                      label="Category"
                      selectedKeys={[category]}
                      onSelectionChange={(keys: Selection) => {
                        const key = Array.from(keys as Set<string>)[0] as PromptCategory;
                        setCategory(key);
                        setPrompt("");
                      }}
                    >
                      {ALL_CATEGORIES.map((cat) => (
                        <SelectItem key={cat}>{cat}</SelectItem>
                      ))}
                    </Select>
                  </div>

                  <Textarea aria-label="Custom prompt" label="Prompt" minRows={3} value={prompt} onChange={(e) => setPrompt(e.target.value)} />

                  <Button 
                    color="primary" 
                    size="lg" 
                    isDisabled={!canGenerate || isGenerating} 
                    onPress={handleGenerate}
                  >
                    {isGenerating 
                      ? "Generating…" 
                      : !previewUrl 
                        ? "Upload image to generate" 
                        : credits === null || credits <= 0 
                          ? "No credits available" 
                          : "Generate"
                    }
                  </Button>
                  
                  {/* Show credits warning when low */}
                  {credits !== null && credits <= 0 && (
                    <div className="text-center">
                      <p className="text-danger text-sm mb-2">You have no credits remaining.</p>
                      <Button 
                        as={Link} 
                        href="/#pricing" 
                        color="primary" 
                        size="sm"
                        variant="flat"
                      >
                        Buy Credits
                      </Button>
                    </div>
                  )}
                  <Button variant="light" size="sm" onPress={handleClear} isDisabled={items.length === 0}>
                    Clear results
                  </Button>
                </CardBody>
                </Card>
              </div>
            </div>

          <div className="lg:col-span-8 xl:col-span-9">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Loading spinners for images being generated */}
              {loadingSpinners.map((spinnerId) => (
                <div key={spinnerId} className="relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center">
                  <Spinner size="lg" color="primary" />
                </div>
              ))}

              {/* Generated images */}
              {items.map((it) => (
                <ErrorBoundary key={it.id} fallback={
                  <Card className="aspect-square">
                    <CardBody className="flex items-center justify-center">
                      <p className="text-danger text-sm">Failed to load image</p>
                    </CardBody>
                  </Card>
                }>
                  <ImageLightbox src={it.url} alt="Generated image">
                    <div className="relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 group">
                      <SafeImage src={it.url} alt="Generated" fill className="object-contain object-center transition-transform group-hover:scale-105" />
                      
                      {/* Hover overlay */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2">
                          <svg
                            className="w-6 h-6 text-gray-800"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </ImageLightbox>
                </ErrorBoundary>
              ))}

              {/* Loading state for existing images */}
              {isLoadingExisting && (
                <>
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={`loading-${i}`} className="relative aspect-square overflow-hidden rounded-xl border border-default-100 bg-content2/50 flex items-center justify-center">
                      <Spinner size="lg" color="default" />
                    </div>
                  ))}
                </>
              )}

              {/* Empty state */}
              {!isLoadingExisting && items.length === 0 && loadingSpinners.length === 0 && (
                <div className="col-span-full">
                  <div className="min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center">
                    <p className="text-default-500 text-sm">Your generated images will appear here. Upload an image and click Generate to create unique variations. Each generation creates one unique image.</p>
                    <div className="grid grid-cols-3 gap-4 w-full max-w-xl">
                      {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} aria-hidden className="relative aspect-square rounded-xl border-2 border-dashed border-default-200 bg-content2/40" />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
    </ErrorBoundary>
  );
}


