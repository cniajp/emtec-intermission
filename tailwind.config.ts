import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'video-cond': ['video-cond', 'sans-serif'],
        'din-2014': ['din-2014', 'sans-serif'],
        'ryo-gothic-plusn': ['ryo-gothic-plusn', 'sans-serif'],
      },
      colors: {
        'COLOR-UPCOMING-SESSION-LABEL': '#EABA54',
        'COLOR-TIMETABLE-Box': '#459ac0',
      },
    },
    fontSize: {
      xxs: ['11px', '16px'],
      semi: ['18px', '22px'],
      sm: ['20px', '24px'],
      base: ['24px', '30px'],
      lg: ['28px', '34px'],
      xl: ['32px', '38px'],
      '1.5xl': ['34px', '35px'],
      '2xl': ['36px', '44px'],
      '3xl': ['40px', '48px'],
      '3.5xl': ['50px', '58px'],
      '4xl': ['60px', '68px'],
      '5xl': ['80px', '88px'],
    },
  },
  plugins: [],
}
export default config
