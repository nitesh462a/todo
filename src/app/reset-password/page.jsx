'use client';

import dynamic from 'next/dynamic';

const ResetPasswordClient = dynamic(() => import('@/app/components/ResetPasswordClient'), {
  ssr: false, // ✅ force it to only load on client
});

export default function ResetPasswordPage() {
  return (
    <ResetPasswordClient />
  );
}
