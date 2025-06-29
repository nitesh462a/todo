import ResetPasswordClient from "../resetclient/page";


import { Suspense } from 'react';


export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
