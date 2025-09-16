import { redirect } from 'next/navigation';

export default function Page() {
  // Redirect root to the Home page located at /home
  redirect('/home');
}
