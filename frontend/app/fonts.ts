import { Manrope, Montserrat, Pacifico, Questrial, Dancing_Script } from 'next/font/google';

export const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

export const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
});

export const pacifico = Pacifico({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
});

export const questrial = Questrial({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-questrial',
  display: 'swap',
});

export const dancingScript = Dancing_Script({
  subsets: ['latin'],
  variable: '--font-dancing-script',
  display: 'swap',
});
