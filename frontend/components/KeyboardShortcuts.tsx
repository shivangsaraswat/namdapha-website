'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';

export default function KeyboardShortcuts() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      // Ignore if user is typing in input/textarea
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        (e.target as HTMLElement).isContentEditable
      ) {
        return;
      }

      // ESC - Go back or home
      if (e.key === 'Escape') {
        e.preventDefault();
        if (pathname === '/') {
          return;
        }
        router.back();
      }

      // Alt/Option + H - Home
      if ((e.altKey || e.metaKey) && e.key === 'h') {
        e.preventDefault();
        router.push('/');
      }

      // Alt/Option + R - Resources
      if ((e.altKey || e.metaKey) && e.key === 'r') {
        e.preventDefault();
        router.push('/resources');
      }

      // Alt/Option + E - Events
      if ((e.altKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        router.push('/events');
      }

      // Alt/Option + C - Council
      if ((e.altKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        router.push('/council');
      }

      // Alt/Option + T - Teams
      if ((e.altKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        router.push('/teams');
      }

      // Alt/Option + K - Show shortcuts help
      if ((e.altKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        alert(
          '⌨️ Keyboard Shortcuts:\n\n' +
          'ESC - Go back\n' +
          'Alt+H - Home\n' +
          'Alt+R - Resources\n' +
          'Alt+E - Events\n' +
          'Alt+C - Council\n' +
          'Alt+T - Teams\n' +
          'Alt+K - Show shortcuts\n\n' +
          '(Use Option key on Mac)'
        );
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [router, pathname]);

  return null;
}
