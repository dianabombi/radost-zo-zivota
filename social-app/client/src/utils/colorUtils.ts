// Utility function to get theme-appropriate colors
// In light mode, replaces yellow with magenta/violet

export const getThemeColor = (darkColor: string, lightColor?: string): string => {
  // Map dark mode colors to light mode equivalents
  const colorMap: Record<string, string> = {
    'warm-yellow': 'light-magenta',
    'bg-warm-yellow': 'bg-light-magenta',
    'text-light-magenta dark:text-warm-yellow': 'text-light-magenta',
    'border-light-magenta dark:border-warm-yellow': 'border-light-magenta',
    'ring-light-magenta dark:ring-warm-yellow': 'ring-light-magenta',
  };

  if (lightColor) {
    return `${darkColor} dark:${lightColor}`;
  }

  const mappedColor = colorMap[darkColor];
  if (mappedColor) {
    return `${mappedColor} dark:${darkColor}`;
  }

  return darkColor;
};

// Helper to generate className with theme-aware colors
export const themeClass = (...classes: string[]): string => {
  return classes.join(' ');
};
