import { useState } from 'react';
import { ExternalBlob } from '../backend';

export interface UploadedImage {
  file: File;
  preview: string;
  blob: ExternalBlob;
  bytes: Uint8Array<ArrayBuffer>;
}

export function useImageUpload() {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setError('Please upload a JPG or PNG image');
      return false;
    }
    
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError('Image size must be less than 10MB');
      return false;
    }
    
    return true;
  };

  const uploadImage = async (file: File): Promise<UploadedImage | null> => {
    if (!validateFile(file)) {
      return null;
    }

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      const arrayBuffer = await file.arrayBuffer();
      const bytes = new Uint8Array(arrayBuffer) as Uint8Array<ArrayBuffer>;
      
      const blob = ExternalBlob.fromBytes(bytes).withUploadProgress((percentage) => {
        setUploadProgress(percentage);
      });

      const preview = URL.createObjectURL(file);

      setUploadProgress(100);
      setIsUploading(false);

      return {
        file,
        preview,
        blob,
        bytes
      };
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
      setIsUploading(false);
      return null;
    }
  };

  return {
    uploadImage,
    uploadProgress,
    isUploading,
    error,
    clearError: () => setError(null)
  };
}
