'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { ScrapedRecipe } from '@/lib/types';

interface AddByScreenshotProps {
  onParsed: (recipe: ScrapedRecipe) => void;
}

type Stage = 'idle' | 'uploading' | 'ocr' | 'parsing' | 'done' | 'error';

const STAGE_MESSAGES: Record<Stage, string> = {
  idle: '',
  uploading: 'Loading image…',
  ocr: 'Reading your recipe…',
  parsing: 'Extracting details…',
  done: 'Done!',
  error: 'Something went wrong',
};

export default function AddByScreenshot({ onParsed }: AddByScreenshotProps) {
  const [stage, setStage] = useState<Stage>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [preview, setPreview] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Process an image file through OCR → parse → callback
  const processImage = useCallback(
    async (file: File) => {
      setError('');
      setStage('uploading');
      setProgress(0);

      // Show preview
      const objectUrl = URL.createObjectURL(file);
      setPreview(objectUrl);

      try {
        // Dynamic import — tesseract.js is heavy, only load when needed
        setStage('ocr');
        setProgress(10);

        const Tesseract = await import('tesseract.js');
        setProgress(20);

        const result = await Tesseract.recognize(file, 'eng', {
          logger: (m) => {
            if (m.status === 'recognizing text' && typeof m.progress === 'number') {
              setProgress(20 + Math.round(m.progress * 60));
            }
          },
        });

        const ocrText = result.data.text;
        setProgress(85);

        if (!ocrText || ocrText.trim().length < 10) {
          throw new Error("Couldn't read enough text from this image. Try a clearer screenshot.");
        }

        // Send to our parse API
        setStage('parsing');
        setProgress(90);

        const res = await fetch('/api/parse-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ocrText }),
        });

        const data = await res.json();
        if (!res.ok) {
          throw new Error(data.error || 'Failed to parse recipe text');
        }

        setProgress(100);
        setStage('done');

        onParsed(data as ScrapedRecipe);
      } catch (err) {
        setStage('error');
        setError(err instanceof Error ? err.message : 'Failed to process image');
      }
    },
    [onParsed]
  );

  // Handle file from input or drop
  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file (PNG, JPG, WEBP)');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setError('Image is too large (max 20 MB)');
        return;
      }
      processImage(file);
    },
    [processImage]
  );

  // Drag and drop handlers
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragOver(false);

      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // File input change
  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  // Clipboard paste — listen globally when component is mounted
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (const item of Array.from(items)) {
        if (item.type.startsWith('image/')) {
          e.preventDefault();
          const file = item.getAsFile();
          if (file) handleFile(file);
          return;
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFile]);

  const reset = () => {
    setStage('idle');
    setProgress(0);
    setError('');
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const isProcessing = stage === 'uploading' || stage === 'ocr' || stage === 'parsing';

  return (
    <div className="bg-neutral-50 rounded-xl border border-neutral-200 overflow-hidden">
      <div className="p-5">
        <h3 className="text-sm font-semibold text-neutral-900 mb-1">Import from Screenshot</h3>
        <p className="text-xs text-neutral-500 mb-4">
          Upload a photo of a recipe from a cookbook, Instagram, or anywhere else.
          You can also <strong>paste from clipboard</strong> (Ctrl/⌘+V).
        </p>

        {/* Drop zone */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => !isProcessing && fileInputRef.current?.click()}
          className={`relative rounded-xl border-2 border-dashed transition-all duration-200 cursor-pointer ${
            dragOver
              ? 'border-neutral-900 bg-neutral-100'
              : isProcessing
              ? 'border-neutral-200 bg-white cursor-default'
              : 'border-neutral-300 bg-white hover:border-neutral-400 hover:bg-neutral-50'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleInputChange}
            className="hidden"
            disabled={isProcessing}
          />

          {/* Idle state */}
          {stage === 'idle' && !preview && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <div className="w-14 h-14 rounded-2xl bg-neutral-100 flex items-center justify-center mb-4">
                <svg className="w-7 h-7 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <p className="text-sm font-medium text-neutral-700 mb-1">
                Drop an image here, or click to browse
              </p>
              <p className="text-xs text-neutral-400">
                PNG, JPG, or WEBP — or paste from clipboard
              </p>
            </div>
          )}

          {/* Processing state */}
          {isProcessing && (
            <div className="flex items-center gap-5 py-8 px-6">
              {preview && (
                <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                  <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="animate-spin w-4 h-4 text-neutral-500 flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span className="text-sm font-medium text-neutral-700">
                    {STAGE_MESSAGES[stage]}
                  </span>
                </div>
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-neutral-900 rounded-full transition-all duration-300 ease-out"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs text-neutral-400 mt-1.5">
                  {stage === 'ocr' && 'This can take 10-30 seconds depending on image size…'}
                  {stage === 'parsing' && 'Almost there…'}
                </p>
              </div>
            </div>
          )}

          {/* Done/error with preview */}
          {(stage === 'done' || stage === 'error') && preview && (
            <div className="flex items-center gap-5 py-6 px-6">
              <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-neutral-100">
                <img src={preview} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 min-w-0">
                {stage === 'done' && (
                  <p className="text-sm font-medium text-green-700 mb-1">
                    ✓ Recipe extracted — review below
                  </p>
                )}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    reset();
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-600 underline underline-offset-2 transition-colors"
                >
                  Upload a different image
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Error message */}
        {error && (
          <div className="mt-3 flex items-start gap-2 p-3 bg-red-50 border border-red-100 rounded-lg">
            <svg className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="text-sm text-red-700">{error}</p>
              <button
                onClick={reset}
                className="text-xs text-red-500 hover:text-red-700 underline underline-offset-2 mt-1 transition-colors"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
