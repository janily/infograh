'use client';

import { useRef } from 'react';
import { Card, CardBody, CardHeader } from '@heroui/card';
import { Input } from '@heroui/input';

import { uploadToFal } from '@/lib/fal-client';

interface ImageUploadSectionProps {
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
  onReferenceChange: (url: string | null) => void;
  error: string | null;
}

export function ImageUploadSection({
  previewUrl,
  onPreviewChange,
  onReferenceChange,
  error,
}: ImageUploadSectionProps) {
  const fileRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    const file = evt.target.files?.[0];

    if (!file) {
      onPreviewChange(null);
      onReferenceChange(null);

      return;
    }

    const url = URL.createObjectURL(file);

    onPreviewChange(url);

    uploadToFal(file)
      .then(remoteUrl => onReferenceChange(remoteUrl))
      .catch(() => onReferenceChange(null));
  };

  return (
    <Card className='bg-content1/60 border border-default-100'>
      <CardHeader className='text-large font-semibold'>Upload</CardHeader>
      <CardBody className='flex flex-col gap-6'>
        <Input
          ref={fileRef as any}
          accept='image/*'
          aria-label='Upload your image'
          type='file'
          onChange={handleFileChange}
        />

        {previewUrl && (
          <div className='flex justify-center'>
            <div className='relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden border border-default-100 bg-content2/50'>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                alt='Preview'
                className='object-contain object-center w-full h-full'
                src={previewUrl}
              />
            </div>
          </div>
        )}

        {error && (
          <Card className='border-danger-200 bg-danger-50'>
            <CardBody className='text-center'>
              <p className='text-danger text-sm'>{error}</p>
            </CardBody>
          </Card>
        )}
      </CardBody>
    </Card>
  );
}
