/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          bg: '#F7F5EF',         // Warm organic ivory background as requested
          cream: '#EFECE1',      // Warm cream
          surface: '#FFFFFF',    // Pure white for cards
          card: 'rgba(255, 255, 255, 0.95)',
          border: '#E3DDD0',     // Soft natural border
          borderLight: '#ECE7DD',
          muted: '#717875',      // Warm grey for secondary text
          charcoal: '#252B29',   // Deep charcoal for main text (#252B29)
          charcoalLight: '#343B38',
        },
        forest: {
          900: '#102C20',        // Dark green (#102C20)
          800: '#174C3C',        // Primary green (#174C3C)
          700: '#1D5A47',
          600: '#276C56',
          500: '#3D826C',
          400: '#5A9E86',
          100: '#DDE9E2',
          50: '#F0F5F2',
        },
        sage: {
          DEFAULT: '#91AA91',    // Sage (#91AA91)
          light: '#E6ECE6',
          dark: '#586F58',
        },
        terracotta: {
          DEFAULT: '#C87552',    // Terracotta (#C87552)
          light: '#F8EEE9',
          dark: '#A65333',
        },
        amber: {
          gold: '#D9A441',       // Golden amber (#D9A441)
          soft: '#FBF2DF',
        },
        lavender: {
          DEFAULT: '#A99BCB',    // Lavender (#A99BCB)
          muted: '#8F82B3',
          light: '#F3F0F8',
        }
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(37, 43, 41, 0.05)',
        'soft-md': '0 8px 24px -4px rgba(37, 43, 41, 0.08)',
        'soft-lg': '0 16px 40px -8px rgba(37, 43, 41, 0.12)',
        'forest-sm': '0 4px 20px -2px rgba(23, 76, 60, 0.18)',
        'terracotta-sm': '0 4px 20px -2px rgba(200, 117, 82, 0.22)',
      }
    },
  },
  plugins: [],
}
