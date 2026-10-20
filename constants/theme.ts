export const Colors = {
  primary: '#6C6FF5', // Soft indigo (clay)
  primaryLight: '#E4E4FC',
  secondary: '#A78BFA', // Soft purple (clay AI)
  accent: '#2DD4BF', // Soft teal (clay)
  background: '#ECECF9', // Periwinkle mist
  surface: '#F8F8FD', // Puffy near-white
  text: '#2B2854', // Soft indigo ink
  textSecondary: '#6E6A95',
  error: '#FB7185',
  success: '#34D399',
  warning: '#FBBF24',
  border: '#DCDCF2',
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const Typography = {
  h1: {
    fontSize: 28,
    fontWeight: '700' as const,
    color: Colors.text,
  },
  h2: {
    fontSize: 22,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  h3: {
    fontSize: 18,
    fontWeight: '600' as const,
    color: Colors.text,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
    color: Colors.text,
  },
  caption: {
    fontSize: 14,
    fontWeight: '400' as const,
    color: Colors.textSecondary,
  },
};

// Claymorphism shadows: indigo-tinted, soft and puffy
export const ClayShadows = {
  small: {
    shadowColor: '#4C4ED1',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
    elevation: 6,
  },
  medium: {
    shadowColor: '#4C4ED1',
    shadowOffset: { width: 0, height: 14 },
    shadowOpacity: 0.22,
    shadowRadius: 24,
    elevation: 10,
  },
  large: {
    shadowColor: '#4C4ED1',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.26,
    shadowRadius: 32,
    elevation: 14,
  },
};

// Clay input: soft inset feel via a white top highlight shadow + tinted fill
export const Clay = {
  input: {
    backgroundColor: '#E7E7F5',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.7)',
    borderTopWidth: 2,
    borderTopColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: Colors.text,
    fontSize: 16,
  },
};

export const Shadows = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
};
