export const themeTokens = {
  colors: {
    light: {
      background: '#FFFFFF',
      surface: 'rgba(255, 255, 255, 0.7)',
      border: 'rgba(0, 0, 0, 0.05)',
      textPrimary: '#0F172A',
      textSecondary: '#475569',
      accentBlue: '#2563EB',
      accentGreen: '#10B981', // Mint/Sea Green
      shadow: 'rgba(0, 0, 0, 0.05)',
    },
    dark: {
      background: '#09090B', // Low-luminance Charcoal Black
      surface: 'rgba(24, 24, 27, 0.6)',
      border: 'rgba(255, 255, 255, 0.08)',
      textPrimary: '#FAFAFA',
      textSecondary: '#A1A1AA',
      accentBlue: '#3B82F6',
      accentGreen: '#34D399',
      shadow: 'rgba(0, 0, 0, 0.5)',
    },
  },
  effects: {
    glassmorphism: {
      light: {
        backdropFilter: 'blur(12px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        border: '1px solid rgba(255, 255, 255, 0.4)',
      },
      dark: {
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.5)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      },
    },
    elevation: {
      level1: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      level2: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      level3: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
  },
};
