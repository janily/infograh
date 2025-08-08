"use client";

import {
  Modal,
  ModalContent,
  ModalBody,
  useDisclosure,
} from "@heroui/modal";
import { Button } from "@heroui/button";
import { SafeImage } from "@/components/safe-image";
import { useState } from "react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  children: React.ReactNode; // The trigger element (thumbnail)
}

export function ImageLightbox({ src, alt, children }: ImageLightboxProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <>
      <div 
        onClick={onOpen} 
        className="cursor-pointer transition-transform hover:scale-105"
      >
        {children}
      </div>
      
      <Modal
        backdrop="blur"
        size="5xl"
        classNames={{
          backdrop: "bg-black/80 backdrop-blur-sm",
          base: "bg-transparent shadow-none",
          body: "p-0",
        }}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        hideCloseButton
      >
        <ModalContent>
          {(onClose) => (
            <ModalBody className="flex items-center justify-center min-h-[80vh]">
              <div className="relative max-w-full max-h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-default-100 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                
                <SafeImage
                  src={src}
                  alt={alt}
                  width={1024}
                  height={1024}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl"
                  onLoad={() => setImageLoaded(true)}
                  fill={false}
                />
                
                {/* Close button */}
                <Button
                  isIconOnly
                  color="default"
                  variant="flat"
                  size="lg"
                  className="absolute top-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                  onPress={onClose}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </Button>
                
                {/* Download button */}
                <Button
                  isIconOnly
                  color="primary"
                  variant="flat"
                  size="lg"
                  className="absolute bottom-4 right-4 bg-black/20 backdrop-blur-sm hover:bg-black/40"
                  onPress={async () => {
                    try {
                      // Fetch the image as a blob to handle CORS properly
                      const response = await fetch(src);
                      const blob = await response.blob();
                      
                      // Create a URL for the blob
                      const blobUrl = window.URL.createObjectURL(blob);
                      
                      // Create download link
                      const link = document.createElement('a');
                      link.href = blobUrl;
                      link.download = `generated-image-${Date.now()}.jpg`;
                      document.body.appendChild(link);
                      link.click();
                      
                      // Clean up
                      document.body.removeChild(link);
                      window.URL.revokeObjectURL(blobUrl);
                    } catch (error) {
                      console.error('Download failed:', error);
                      // Fallback to simple download
                      const link = document.createElement('a');
                      link.href = src;
                      link.download = `generated-image-${Date.now()}.jpg`;
                      link.target = '_blank';
                      link.click();
                    }
                  }}
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </Button>
              </div>
            </ModalBody>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
