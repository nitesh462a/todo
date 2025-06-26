'use client'
import { useState } from "react"
import axios from 'axios';
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function Regi() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter();

  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    return regex.test(password);
  }

  const handlesubmit = async (e) => {
    e.preventDefault();

    if (!validatePassword(password)) {
      setError("Password must be at least 8 characters long and include uppercase, lowercase, number, and special character.");
      return;
    }

     const isconfirm =window.confirm("check your datails");
    if(isconfirm){
    try {
      const res = await axios.post('/api/auth/register', { name, email, password })
      console.log(res);
      router.push('/login'); 
      toast.success("register successfully");
    } catch (err) {
      console.error(err);
      setError("Registration failed. Try again.");
    }}
  }

  return (
    <div className="flex justify-center items-center h-screen">
      <form onSubmit={handlesubmit} className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-bold mb-6">Register</h1>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="mb-4">
          <label className="block text-gray-700">Name</label>
          <input className="w-full px-3 py-2 border rounded" type="text" placeholder="Enter name" onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Email</label>
          <input className="w-full px-3 py-2 border rounded" type="email" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Password</label>
          <input className="w-full px-3 py-2 border rounded" type="password" placeholder="Enter password" onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition">Register</button>
        <h3 className="mt-4 text-blue-600 cursor-pointer" onClick={() => { router.push("/login") }}>Already have an account? Login</h3>
      </form>
    </div>
  )
}
