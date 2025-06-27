import { Suspense } from 'react';

import ResetPasswordClient from './ResetPasswordClient';
export default function ResetPasswordPage() {
  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <ResetPasswordClient />
      </Suspense>
    </div>
  );
}