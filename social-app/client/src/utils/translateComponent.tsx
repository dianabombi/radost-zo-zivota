import type { TFunction } from 'i18next';

// Helper function to translate verification method labels
export const translateVerificationMethod = (method: string, t: TFunction): string => {
  const methodMap: Record<string, string> = {
    'qr_code': t('verification.methods.qrCode'),
    'bluetooth': t('verification.methods.bluetooth'),
    'email': t('verification.methods.email')
  };
  return methodMap[method] || method;
};

// Helper function to translate verification method icons
export const getMethodIcon = (method: string): string => {
  switch (method) {
    case 'qr_code': return '📱';
    case 'bluetooth': return '📡';
    case 'email': return '✉️';
    default: return '🤝';
  }
};
