'use client';

import React from 'react';
import { Card, CardBody } from '@heroui/card';
import { Spinner } from '@heroui/spinner';

import { ErrorBoundary } from '@/components/error-boundary';
import { SafeImage } from '@/components/safe-image';
import { ImageLightbox } from '@/components/image-lightbox';
import { ZoomIcon } from '@/components/icons';
import { RetentionNotice } from '@/components/dashboard/RetentionNotice';

type GeneratedItem = { id: string; url: string };

interface GeneratedGalleryProps {
  items: GeneratedItem[];
  isLoadingExisting: boolean;
}

export function GeneratedGallery({
  items,
  isLoadingExisting,
}: GeneratedGalleryProps) {
  const showEmptyState = !isLoadingExisting && items.length === 0;

  return (
    <>
      <RetentionNotice />

      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
        {/* Generated images */}
        {items.map(item => (
          <ErrorBoundary
            key={item.id}
            fallback={
              <Card className='aspect-square'>
                <CardBody className='flex items-center justify-center'>
                  <p className='text-danger text-sm'>Failed to load image</p>
                </CardBody>
              </Card>
            }
          >
            <ImageLightbox alt='Generated infographic' src={item.url}>
              <div className='relative aspect-[3/4] overflow-hidden rounded-xl border border-default-100 bg-content2/50 group'>
                <SafeImage
                  fill
                  alt='Generated infographic'
                  className='object-contain object-center transition-transform group-hover:scale-105'
                  src={item.url}
                />

                {/* Hover overlay with zoom icon */}
                <div className='absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100'>
                  <div className='bg-white/90 backdrop-blur-sm rounded-full p-3'>
                    <ZoomIcon className='w-6 h-6 text-gray-800' />
                  </div>
                </div>
              </div>
            </ImageLightbox>
          </ErrorBoundary>
        ))}

        {/* Loading state for existing images */}
        {isLoadingExisting && (
          <div className='col-span-full flex items-center justify-center py-12'>
            <div className='flex flex-col items-center gap-3'>
              <Spinner color='primary' size='lg' />
              <p className='text-default-500 text-sm'>Loading your infographics...</p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {showEmptyState && (
          <div className='col-span-full'>
            <div className='min-h-[50vh] flex flex-col items-center justify-center gap-6 text-center px-4'>
              <div className='w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center'>
                <svg
                  className='w-12 h-12 text-primary'
                  fill='none'
                  stroke='currentColor'
                  strokeWidth={1.5}
                  viewBox='0 0 24 24'
                >
                  <path
                    d='M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z'
                    strokeLinecap='round'
                    strokeLinejoin='round'
                  />
                </svg>
              </div>
              <div className='space-y-2'>
                <h3 className='text-lg font-semibold text-default-700'>
                  No infographics yet
                </h3>
                <p className='text-default-500 text-sm max-w-md'>
                  Enter a URL, fetch its content, then click "Generate Infographic" 
                  to create beautiful infographics from any article.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
