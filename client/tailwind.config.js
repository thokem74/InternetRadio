export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Space Grotesk"', 'system-ui', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'system-ui', 'sans-serif']
      },
      colors: {
        ink: {
          900: '#0b0f1f',
          800: '#12182b',
          700: '#1b2340',
          600: '#243054'
        },
        neon: {
          cyan: '#22d3ee',
          pink: '#f472b6',
          violet: '#a855f7',
          lime: '#84cc16'
        }
      },
      boxShadow: {
        glow: '0 0 24px rgba(34, 211, 238, 0.35)',
        glowPink: '0 0 28px rgba(244, 114, 182, 0.35)'
      },
      backgroundImage: {
        'radial-spot': 'radial-gradient(circle at top, rgba(34, 211, 238, 0.22), transparent 55%)',
        'radial-pink': 'radial-gradient(circle at 20% 20%, rgba(244, 114, 182, 0.2), transparent 50%)'
      }
    }
  },
  plugins: []
};
