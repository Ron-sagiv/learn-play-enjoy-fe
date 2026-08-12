import React, { useState } from "react";

export default function SignUpPage({ onSwitchToLogin }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [usercategory, setUsercategory] = useState("");
  const [level, setLevel] = useState("");
  const [instrument, setInstrument] = useState("");
  const [favband, setFavband] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password, 
          usercategory, 
          level, 
          instrument, 
          favband 
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Registration failed");

      setSuccess("Registered successfully! Redirecting to login...");
      setTimeout(onSwitchToLogin, 1500);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white py-12">
      <form onSubmit={handleRegister} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
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

        <div className="mb-4">
          <label className="block mb-2 text-sm">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">User Category</label>
          <input
            type="text"
            value={usercategory}
            onChange={(e) => setUsercategory(e.target.value)}
            required
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Level</label>
          <input
            type="text"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block mb-2 text-sm">Instrument</label>
          <input
            type="text"
            value={instrument}
            onChange={(e) => setInstrument(e.target.value)}
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-indigo-500"
          />
        </div>

        <div className="mb-6">
          <label className="block mb-2 text-sm">Favorite Band</label>
          <input
            type="text"
            value={favband}
            onChange={(e) => setFavband(e.target.value)}
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