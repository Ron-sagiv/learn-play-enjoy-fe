import React, { useState } from "react";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");
      
      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(onSwitchToLogin, 1500);
    } catch (err: unknown) {
      setError((err as Error).message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Register</h2>
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
        {success && <p className="mb-4 text-green-500 text-sm">{success}</p>}
        <div className="mb-4">
          <label className="block mb-2 text-sm">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2 text-sm">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <div className="mb-6">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>
        <button type="submit" className="w-full py-2 bg-indigo-600 rounded hover:bg-indigo-500 font-semibold transition">
          Sign Up
        </button>
        <p className="mt-4 text-sm text-center text-gray-400">
          Already have an account?{" "}
          <button type="button" onClick={onSwitchToLogin} className="text-indigo-400 hover:underline bg-transparent border-none cursor-pointer">
            Login
          </button>
        </p>
      </form>
    </div>
  );
}