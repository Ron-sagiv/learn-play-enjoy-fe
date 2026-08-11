import React, { useState } from "react";

const LoginPage = ({ onSwitchToRegister, onLoginSuccess }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/signin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      localStorage.setItem("token", data.token);
      if (onLoginSuccess) onLoginSuccess();
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
      <form onSubmit={handleLogin} className="w-full max-w-md p-8 bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && <p className="mb-4 text-red-500 text-sm">{error}</p>}
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
        <button type="submit" className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 font-semibold transition">
          Sign In
        </button>
        {onSwitchToRegister && (
          <p className="mt-4 text-sm text-center text-gray-400">
            Don't have an account?{" "}
            <button type="button" onClick={onSwitchToRegister} className="text-indigo-400 hover:underline bg-transparent border-none cursor-pointer">
              Register
            </button>
          </p>
        )}
      </form>
    </div>
  );
};

export default LoginPage;