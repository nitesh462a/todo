'use client';
import { useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordClient() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleReset = async () => {
    try {
      const res = await axios.post('/api/reset-password', {
        token,
        password
      });
      setMessage(res.data.message);
    } catch (err) {
      setMessage('❌ Error resetting password.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
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
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition"
        >
          Reset Password
        </button>

        <Link href={"/login"}>go to login</Link>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
