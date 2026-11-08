export const colors = {
  background: '#F4F1EA',
  surface: '#FFFFFF',
  surfaceMuted: '#ECE8DE',
  border: '#E2DDD1',
  borderStrong: '#CFC8B8',

  ink: '#1A1F1B',
  inkMuted: '#5B6359',
  inkSubtle: '#8C9289',
  inkInverse: '#FFFFFF',

  primary: '#2D5A3D',
  primaryPressed: '#22462F',
  primarySoft: '#E1EADD',

  danger: '#A8432D',
  dangerSoft: '#F5E3DD',

  notice: '#7A5A14',
  noticeSoft: '#F4EAD2',

  gradeA: '#2E7148',
  gradeASoft: '#DFEEE3',
  gradeB: '#94640F',
  gradeBSoft: '#F5EBD3',
  gradeC: '#A4452C',
  gradeCSoft: '#F5E1DA',

  overlay: 'rgba(26, 31, 27, 0.55)',
} as const;

export const spacing = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 22,
  pill: 999,
} as const;

export const fonts = {
  regular: 'Manrope_400Regular',
  medium: 'Manrope_500Medium',
  semibold: 'Manrope_600SemiBold',
  bold: 'Manrope_700Bold',
  extrabold: 'Manrope_800ExtraBold',
} as const;

export const typography = {
  display: { fontFamily: fonts.extrabold, fontSize: 30, lineHeight: 36, letterSpacing: -0.6 },
  title: { fontFamily: fonts.bold, fontSize: 22, lineHeight: 28, letterSpacing: -0.3 },
  heading: { fontFamily: fonts.bold, fontSize: 17, lineHeight: 22, letterSpacing: -0.1 },
  body: { fontFamily: fonts.medium, fontSize: 15, lineHeight: 22 },
  bodyStrong: { fontFamily: fonts.semibold, fontSize: 15, lineHeight: 22 },
  caption: { fontFamily: fonts.medium, fontSize: 13, lineHeight: 18 },
  overline: {
    fontFamily: fonts.bold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.9,
    textTransform: 'uppercase',
  },
} as const;
