'use client';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {    
      await axios.post('/api/auth/logout');
      router.push('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <button
      onClick={handleLogout}
      className="mt-6 px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
    >
      Logout
    </button>
  );
}
