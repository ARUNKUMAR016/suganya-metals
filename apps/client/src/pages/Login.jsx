import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import api from "../api";
import { Lock, User, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/auth/login", { username, password });

      if (response.data.success) {
        login(response.data.user, response.data.token);
        navigate("/");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
      // Shake animation on error
      const form = e.target;
      form.classList.add("animate-shake");
      setTimeout(() => form.classList.remove("animate-shake"), 500);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/hindu_god_background.png')] bg-cover bg-center flex items-center justify-center p-4 relative overflow-hidden">
      {/* Dark Overlay for readability */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm"></div>

      {/* Animated glowing orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-saffron rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-kumkum rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-gold rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>

      <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl w-full max-w-md p-8 relative z-10 animate-fadeIn border border-gold/30">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="bg-gradient-to-br from-saffron to-kumkum w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg transform hover:scale-110 transition-transform duration-300 border-2 border-gold">
            <Lock size={40} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-saffron via-kumkum to-dark-brown bg-clip-text text-transparent drop-shadow-sm">
            SUGANYA METALS
          </h1>
          <p className="text-dark-brown/70 mt-2 font-medium">
            Production & Salary System
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border-l-4 border-kumkum text-kumkum px-4 py-3 rounded-lg text-sm animate-slideDown">
              <p className="font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username (பயனர் பெயர்)
            </label>
            <div className="relative">
              <User
                size={20}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                required
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                placeholder="Enter username / பெயர்"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password (கடவுச்சொல்)
            </label>
            <div className="relative group">
              <Lock
                size={20}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-saffron transition-colors"
              />
              <input
                type={showPassword ? "text" : "password"}
                required
                className="w-full pl-12 pr-12 py-3 border-2 border-gray-200 rounded-xl focus:border-saffron focus:ring-4 focus:ring-saffron/20 outline-none transition-all duration-200 bg-white/50"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-saffron transition-colors focus:outline-none"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-saffron to-kumkum hover:from-orange-500 hover:to-red-700 text-white font-bold py-3 rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 active:translate-y-0 border border-gold/20"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-dark-brown/60 bg-sandal/30 px-4 py-2 rounded-lg inline-block border border-gold/10">
            Default credentials:{" "}
            <span className="font-semibold text-kumkum">admin / sugany123</span>
          </p>
        </div>
      </div>

      {/* Custom Animations */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
          20%, 40%, 60%, 80% { transform: translateX(10px); }
        }

        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out;
        }

        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default Login;
