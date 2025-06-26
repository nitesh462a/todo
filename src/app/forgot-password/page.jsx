'use client';
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email) {
      setMessage(" Please enter your email.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post('/api/forgot-password', { email });
      setMessage(res.data.message);
    } catch (err) {
      setMessage("❌ Failed to send email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center"> Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">
          Enter your registered email to receive a password reset link.
        </p>
        <input
          type="email"
          placeholder="example@gmail.com"
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-500 text-white font-semibold py-2 rounded-lg hover:bg-blue-600 transition"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>


        <Link href={"/login"}>back to login</Link>

        {message && (
          <div className="mt-4 text-center text-sm text-green-600 font-medium">
            {message}
          </div>
        )}
      </div>
    </div>
  );
}
// git remote add origin https://github.com/username/my-next-app.git
