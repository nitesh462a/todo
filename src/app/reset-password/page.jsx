
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const router = useRouter();

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  };

  const handleReset = async () => {
    setError('');
    setMessage('');

    if (!token) {
      setError('❌ Invalid or expired token.');
      return;
    }

    if (!validatePassword(password)) {
      setError(
        'Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.'
      );
      return;
    }

    setLoading(true);

    try {
      const res = await axios.post('/api/reset-password', {
        token,
        password,
      });
      setMessage(res.data.message || '✅ Password reset successful!');
      setTimeout(() => router.push('/login'), 2000);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || '❌ Error resetting password.';
      setMessage(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <h2 className="text-2xl font-bold mb-4 text-center">🔑 Reset Password</h2>
        <input
          type="password"
          placeholder="Enter new password"
          className="w-full px-4 py-2 border rounded-lg mb-4"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          onClick={handleReset}
          disabled={loading}
          className={`w-full bg-blue-500 text-white py-2 rounded transition ${
            loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
          }`}
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        <div className="mt-4 text-center">
          <Link href="/login" className="text-blue-500 hover:underline text-sm">
            Go to login
          </Link>
        </div>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
