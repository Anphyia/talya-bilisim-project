'use client';

import { useState, useEffect, useRef } from 'react';
import QrScanner from 'qr-scanner';
import {
  X,
  Flashlight,
  FlashlightOff,
  Camera,
  Loader2,
  KeyboardIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

interface QRScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onTableScanned: (tableNumber: string) => void;
}

export function QRScanner({ isOpen, onClose, onTableScanned }: QRScannerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const qrScannerRef = useRef<QrScanner | null>(null);
  const [isInitializing, setIsInitializing] = useState(false);
  const [, setHasCamera] = useState(false);
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [manualTableNumber, setManualTableNumber] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Initialize camera and QR scanner
  useEffect(() => {
    if (!isOpen || !videoRef.current) return;

    const initializeScanner = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        // Check if camera is available
        const hasCamera = await QrScanner.hasCamera();
        setHasCamera(hasCamera);

        if (!hasCamera) {
          setError('No camera found. Please use manual input.');
          setIsInitializing(false);
          return;
        }

        // Create QR scanner instance
        const qrScanner = new QrScanner(
          videoRef.current!,
          (result) => {
            // Extract table number from QR code result
            const tableNumber = extractTableNumber(result.data);
            if (tableNumber) {
              onTableScanned(tableNumber);
              cleanup();
            } else {
              setError('Invalid QR code. Please try again or use manual input.');
            }
          },
          {
            highlightScanRegion: true,
            highlightCodeOutline: true,
            preferredCamera: 'environment', // Use back camera on mobile
          }
        );

        qrScannerRef.current = qrScanner;
        await qrScanner.start();
        setIsInitializing(false);
      } catch (err) {
        console.error('Failed to initialize QR scanner:', err);
        setError('Camera access denied. Please allow camera permissions or use manual input.');
        setIsInitializing(false);
      }
    };

    initializeScanner();

    return () => {
      cleanup();
    };
  }, [isOpen, onTableScanned]);

  // Cleanup function
  const cleanup = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current.destroy();
      qrScannerRef.current = null;
    }
    setFlashlightOn(false);
    setError(null);
    onClose();
  };

  // Extract table number from QR code data
  const extractTableNumber = (data: string): string | null => {
    // Handle different QR code formats
    // Simple number: "5", "12", etc.
    if (/^\d+$/.test(data.trim())) {
      return data.trim();
    }

    // JSON format: {"table": "5", ...}
    try {
      const parsed = JSON.parse(data);
      if (parsed.table || parsed.tableNumber) {
        return (parsed.table || parsed.tableNumber).toString();
      }
    } catch {
      // Not JSON, continue
    }

    // URL format: https://restaurant.com/table/5
    const urlMatch = data.match(/table[\/=](\d+)/i);
    if (urlMatch) {
      return urlMatch[1];
    }

    return null;
  };

  // Toggle flashlight
  const toggleFlashlight = async () => {
    if (!qrScannerRef.current) return;

    try {
      if (flashlightOn) {
        await qrScannerRef.current.turnFlashOff();
        setFlashlightOn(false);
      } else {
        await qrScannerRef.current.turnFlashOn();
        setFlashlightOn(true);
      }
    } catch (err) {
      console.warn('Flashlight not supported:', err);
    }
  };

  // Handle manual input
  const handleManualSubmit = () => {
    const tableNumber = manualTableNumber.trim();
    if (tableNumber && /^\d+$/.test(tableNumber)) {
      onTableScanned(tableNumber);
      setManualTableNumber('');
      setShowManualInput(false);
      cleanup();
    }
  };

  // Mobile/Tablet: Full screen overlay
  if (typeof window !== 'undefined' && window.innerWidth < 1024) {
    return (
      <>
        {isOpen && (
          <div className="fixed inset-0 z-50 bg-black">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 restaurant-bg-background/10 backdrop-blur-sm">
              <h2 className="text-white restaurant-font-heading text-lg font-bold">
                Scan Table QR Code
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={cleanup}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Camera View */}
            <div className="relative w-full h-full">
              {!error && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              )}

              {/* Loading Overlay */}
              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                  <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                  <p className="text-white restaurant-font-body text-sm">
                    Initializing camera...
                  </p>
                </div>
              )}

              {/* Error Overlay */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8">
                  <Camera className="h-16 w-16 text-red-400 mb-4" />
                  <p className="text-white restaurant-font-body text-center mb-6">
                    {error}
                  </p>
                  <Button
                    onClick={() => setShowManualInput(true)}
                    className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white"
                  >
                    <KeyboardIcon className="h-4 w-4 mr-2" />
                    Enter Table Number
                  </Button>
                </div>
              )}

              {/* Scanning Frame */}
              {!isInitializing && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning frame */}
                    <div className="w-64 h-64 border-4 border-white/30 relative">
                      {/* Corner indicators */}
                      <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-restaurant-primary"></div>
                      <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-restaurant-primary"></div>
                      <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-restaurant-primary"></div>
                      <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-restaurant-primary"></div>

                      {/* Animated scanning line */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-0.5 bg-restaurant-primary animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    </div>

                    <p className="text-white restaurant-font-body text-sm text-center mt-4">
                      Position QR code within the frame
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              {!isInitializing && !error && (
                <div className="absolute bottom-8 left-0 right-0 flex items-center justify-between px-8">
                  {/* Flashlight Toggle */}
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={toggleFlashlight}
                    className="text-white hover:bg-white/20 p-4 rounded-full"
                  >
                    {flashlightOn ? (
                      <FlashlightOff className="h-6 w-6" />
                    ) : (
                      <Flashlight className="h-6 w-6" />
                    )}
                  </Button>

                  {/* Manual Input */}
                  <Button
                    onClick={() => setShowManualInput(true)}
                    className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white px-6"
                  >
                    <KeyboardIcon className="h-4 w-4 mr-2" />
                    Manual Input
                  </Button>

                  <div></div> {/* Spacer for centering */}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Manual Input Dialog */}
        <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
          <DialogContent className="restaurant-bg-background">
            <DialogHeader>
              <DialogTitle className="restaurant-text-foreground restaurant-font-heading">
                Enter Table Number
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Textarea
                placeholder="Enter your table number (e.g., 5, 12)"
                value={manualTableNumber}
                onChange={(e) => setManualTableNumber(e.target.value)}
                className="restaurant-border restaurant-rounded-md"
                rows={1}
              />
              <div className="flex space-x-3">
                <Button
                  onClick={handleManualSubmit}
                  disabled={!manualTableNumber.trim() || !/^\d+$/.test(manualTableNumber.trim())}
                  className="flex-1 restaurant-bg-primary hover:restaurant-bg-primary/90 text-white"
                >
                  Confirm
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowManualInput(false);
                    setManualTableNumber('');
                  }}
                  className="flex-1 restaurant-border"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  // Desktop: Modal Dialog
  return (
    <>
      <Dialog open={isOpen} onOpenChange={cleanup}>
        <DialogContent className="restaurant-bg-background sm:max-w-[600px] p-0" showCloseButton={false}>
          <div className="relative bg-black rounded-lg overflow-hidden">
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 restaurant-bg-background/10 backdrop-blur-sm">
              <h2 className="text-white restaurant-font-heading text-lg font-bold">
                Scan Table QR Code
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={cleanup}
                className="text-white hover:bg-white/20 p-2"
              >
                <X className="h-6 w-6" />
              </Button>
            </div>

            {/* Camera View */}
            <div className="relative w-full h-96">
              {!error && (
                <video
                  ref={videoRef}
                  className="w-full h-full object-cover"
                  playsInline
                  muted
                />
              )}

              {/* Loading Overlay */}
              {isInitializing && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/70">
                  <Loader2 className="h-12 w-12 text-white animate-spin mb-4" />
                  <p className="text-white restaurant-font-body text-sm">
                    Initializing camera...
                  </p>
                </div>
              )}

              {/* Error Overlay */}
              {error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/90 p-8">
                  <Camera className="h-16 w-16 text-red-400 mb-4" />
                  <p className="text-white restaurant-font-body text-center mb-6">
                    {error}
                  </p>
                  <Button
                    onClick={() => setShowManualInput(true)}
                    className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white"
                  >
                    <KeyboardIcon className="h-4 w-4 mr-2" />
                    Enter Table Number
                  </Button>
                </div>
              )}

              {/* Scanning Frame */}
              {!isInitializing && !error && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative">
                    {/* Scanning frame */}
                    <div className="w-48 h-48 border-4 border-white/30 relative">
                      {/* Corner indicators */}
                      <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-restaurant-primary"></div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-restaurant-primary"></div>
                      <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-restaurant-primary"></div>
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-restaurant-primary"></div>

                      {/* Animated scanning line */}
                      <div className="absolute inset-0 overflow-hidden">
                        <div className="w-full h-0.5 bg-restaurant-primary animate-pulse absolute top-1/2 transform -translate-y-1/2"></div>
                      </div>
                    </div>

                    <p className="text-white restaurant-font-body text-sm text-center mt-4">
                      Position QR code within the frame
                    </p>
                  </div>
                </div>
              )}

              {/* Bottom Controls */}
              {!isInitializing && !error && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-between px-6">
                  {/* Flashlight Toggle */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleFlashlight}
                    className="text-white hover:bg-white/20 p-3 rounded-full"
                  >
                    {flashlightOn ? (
                      <FlashlightOff className="h-5 w-5" />
                    ) : (
                      <Flashlight className="h-5 w-5" />
                    )}
                  </Button>

                  {/* Manual Input */}
                  <Button
                    onClick={() => setShowManualInput(true)}
                    className="restaurant-bg-primary hover:restaurant-bg-primary/90 text-white px-4"
                  >
                    <KeyboardIcon className="h-4 w-4 mr-2" />
                    Manual Input
                  </Button>

                  <div></div> {/* Spacer for centering */}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Manual Input Dialog */}
      <Dialog open={showManualInput} onOpenChange={setShowManualInput}>
        <DialogContent className="restaurant-bg-background">
          <DialogHeader>
            <DialogTitle className="restaurant-text-foreground restaurant-font-heading">
              Enter Table Number
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Enter your table number (e.g., 5, 12)"
              value={manualTableNumber}
              onChange={(e) => setManualTableNumber(e.target.value)}
              className="restaurant-border restaurant-rounded-md"
              rows={1}
            />
            <div className="flex space-x-3">
              <Button
                onClick={handleManualSubmit}
                disabled={!manualTableNumber.trim() || !/^\d+$/.test(manualTableNumber.trim())}
                className="flex-1 restaurant-bg-primary hover:restaurant-bg-primary/90 text-white"
              >
                Confirm
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setShowManualInput(false);
                  setManualTableNumber('');
                }}
                className="flex-1 restaurant-border"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default QRScanner;
