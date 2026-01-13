import React, { useState, useEffect, useCallback } from 'react';

interface ScreenshotProtectionProps {
  children: React.ReactNode;
}

const ScreenshotProtection: React.FC<ScreenshotProtectionProps> = ({ children }) => {
  const [showWarning, setShowWarning] = useState(false);

  const triggerWarning = useCallback(() => {
    setShowWarning(true);
    setTimeout(() => setShowWarning(false), 3000);
  }, []);

  useEffect(() => {
    // Detect Print Screen key
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) || // Mac screenshots
        (e.ctrlKey && e.key === 'PrintScreen') ||
        (e.altKey && e.key === 'PrintScreen')
      ) {
        e.preventDefault();
        triggerWarning();
      }
    };

    // Detect visibility change (can indicate screenshot on some mobile devices)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        // Small delay to catch screenshot action
        setTimeout(() => {
          if (document.visibilityState === 'visible') {
            triggerWarning();
          }
        }, 100);
      }
    };

    // Detect window blur (another screenshot indicator)
    const handleBlur = () => {
      triggerWarning();
    };

    // Prevent right-click context menu
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      triggerWarning();
    };

    // Add event listeners
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    document.addEventListener('contextmenu', handleContextMenu);
    
    // Only add blur listener on mobile (too sensitive on desktop)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    if (isMobile) {
      window.addEventListener('blur', handleBlur);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      document.removeEventListener('contextmenu', handleContextMenu);
      if (isMobile) {
        window.removeEventListener('blur', handleBlur);
      }
    };
  }, [triggerWarning]);

  return (
    <div className="relative select-none" style={{ WebkitUserSelect: 'none', userSelect: 'none' }}>
      {children}
      
      {/* Screenshot Warning Overlay */}
      {showWarning && (
        <div className="fixed inset-0 z-[9999] bg-deep-charcoal flex items-center justify-center p-4">
          <div className="text-center max-w-md">
            <div className="text-6xl sm:text-8xl mb-6">🚫📸</div>
            <h2 className="text-2xl sm:text-3xl font-poppins font-bold text-red-500 mb-4">
              Screenshots sú zakázané!
            </h2>
            <p className="text-gray-300 font-poppins text-base sm:text-lg mb-6">
              Screenshots are forbidden due to protection of the game itself.
            </p>
            <div className="bg-red-500 bg-opacity-20 border-2 border-red-500 rounded-xl p-4">
              <p className="text-red-400 font-poppins text-sm">
                ⚠️ Táto aktivita bola zaznamenaná
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Invisible watermark layer */}
      <div 
        className="fixed inset-0 pointer-events-none z-[100] opacity-[0.02]"
        style={{
          background: 'repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.03) 10px, rgba(255,255,255,0.03) 20px)',
        }}
      />
    </div>
  );
};

export default ScreenshotProtection;
