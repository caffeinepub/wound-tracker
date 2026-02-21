import { useState, useRef } from 'react';
import { Upload, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useImageUpload } from '../hooks/useImageUpload';
import { useWoundAnalysis } from '../hooks/useWoundAnalysis';
import type { WoundAnalysisResult } from '../types/wound';

interface ImageUploadProps {
  onAnalysisComplete: (result: WoundAnalysisResult) => void;
}

export default function ImageUpload({ onAnalysisComplete }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [uploadedBytes, setUploadedBytes] = useState<Uint8Array<ArrayBuffer> | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { uploadImage, uploadProgress, isUploading, error: uploadError } = useImageUpload();
  const { analyzeImage, isAnalyzing, error: analysisError } = useWoundAnalysis();

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const uploaded = await uploadImage(file);
    if (uploaded) {
      setPreview(uploaded.preview);
      setUploadedBytes(uploaded.bytes);
    }
  };

  const handleAnalyze = async () => {
    if (!preview || !uploadedBytes) return;

    const result = await analyzeImage(preview, uploadedBytes);
    if (result) {
      onAnalysisComplete(result);
    }
  };

  const handleReset = () => {
    setPreview(null);
    setUploadedBytes(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const error = uploadError || analysisError;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Upload Wound Image</CardTitle>
        <CardDescription>
          Upload a clear photograph of the wound for comprehensive analysis
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!preview ? (
          <div
            className="border-2 border-dashed border-border rounded-lg p-12 text-center hover:border-primary/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-sm text-muted-foreground mb-2">
              Click to upload or drag and drop
            </p>
            <p className="text-xs text-muted-foreground">
              JPG or PNG (max 10MB)
            </p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        ) : (
          <div className="space-y-4">
            <div className="relative rounded-lg overflow-hidden border">
              <img
                src={preview}
                alt="Wound preview"
                className="w-full h-auto"
              />
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="flex-1"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  'Analyze Wound'
                )}
              </Button>
              <Button
                onClick={handleReset}
                variant="outline"
                disabled={isAnalyzing}
              >
                Reset
              </Button>
            </div>
          </div>
        )}

        {isUploading && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Uploading...</span>
              <span className="text-muted-foreground">{uploadProgress}%</span>
            </div>
            <Progress value={uploadProgress} />
          </div>
        )}

        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md">
            {error}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
