export const PRIMARY_TEAL = '#00CED1';
export const PRIMARY_CYAN = '#40E0D0';
export const TITLE_COLOR = '#111827';
export const SUBTITLE_COLOR = '#6B7280';

// Modern Green & Yellow Theme Colors
export const MODERN_GREEN = '#22C55E';
export const MODERN_GREEN_DARK = '#16A34A';
export const MODERN_GREEN_LIGHT = '#4ADE80';
export const MODERN_YELLOW = '#F59E0B';
export const MODERN_YELLOW_DARK = '#D97706';
export const MODERN_YELLOW_LIGHT = '#FBBF24';
export const MODERN_ORANGE = '#F97316';
export const MODERN_ORANGE_LIGHT = '#FB923C';

// Sand-like Background Colors
export const SAND_LIGHT = '#F5F5DC';
export const SAND_MEDIUM = '#E6D7AB';
export const SAND_DARK = '#D2B48C';
export const SAND_WARM = '#F4E4BC';

export const Colors = {
  // Primary Colors - Modern Green Theme
  primary: MODERN_GREEN,
  primaryDark: MODERN_GREEN_DARK,
  primaryLight: MODERN_GREEN_LIGHT,
  
  // Brand Colors
  brandTeal: PRIMARY_TEAL,
  brandCyan: PRIMARY_CYAN,
  brandGreen: MODERN_GREEN,
  brandYellow: MODERN_YELLOW,
  
  // Secondary Colors
  secondary: MODERN_YELLOW,
  secondaryLight: MODERN_YELLOW_LIGHT,
  secondaryDark: MODERN_YELLOW_DARK,
  
  // Accent Colors
  accent: MODERN_ORANGE,
  accentLight: MODERN_ORANGE_LIGHT,
  coral: '#FF6B6B',
  
  // Neutral Colors
  white: '#FFF',
  black: '#000000',
  gray50: '#f8fafc',
  gray100: '#F3F4F6',
  gray200: '#E5E7EB',
  gray300: '#cbd5e1',
  gray400: '#9CA3AF',
  gray500: '#64748b',
  gray600: '#475569',
  gray700: '#334155',
  gray800: '#1e293b',
  gray900: '#0f172a',
  
  // Status Colors
  success: MODERN_GREEN,
  warning: MODERN_YELLOW,
  error: '#ef4444',
  info: '#3b82f6',
  
  // Background Colors
  background: SAND_LIGHT,
  backgroundGradient: [SAND_LIGHT, SAND_WARM] as const,
  backgroundGradientAlt: [SAND_WARM, SAND_MEDIUM] as const,
  surface: SAND_LIGHT,
  card: '#FFF',
  
  // Text Colors
  text: '#1e293b',
  textSecondary: '#64748b',
  textLight: '#94a3b8',
  textInverse: '#ffffff',
  
  // Border Colors
  border: '#E5E7EB',
  borderLight: '#f1f5f9',
  
  // Shadow Colors
  shadow: '#000',
  shadowDark: 'rgba(0, 0, 0, 0.2)',
  
  title: TITLE_COLOR,
  subtitle: SUBTITLE_COLOR,
  
  // Modern Theme Specific Colors
  modernGreen: MODERN_GREEN,
  modernGreenDark: MODERN_GREEN_DARK,
  modernGreenLight: MODERN_GREEN_LIGHT,
  modernYellow: MODERN_YELLOW,
  modernYellowDark: MODERN_YELLOW_DARK,
  modernYellowLight: MODERN_YELLOW_LIGHT,
  modernOrange: MODERN_ORANGE,
  modernOrangeLight: MODERN_ORANGE_LIGHT,
  
  // Sand Theme Colors
  sandLight: SAND_LIGHT,
  sandMedium: SAND_MEDIUM,
  sandDark: SAND_DARK,
  sandWarm: SAND_WARM,
};

// Add default export for better module resolution
export default Colors;
