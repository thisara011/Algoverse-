import { useState } from 'react';
import { User, LogIn, UserPlus } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';

interface UserAuthProps {
  onLogin: (user: { id: string; username: string; email: string }) => void;
}

export function UserAuth({ onLogin }: UserAuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation for login
    if (isLogin) {
      if (!email.trim() || !validateEmail(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
    } else {
      // Validation for registration
      if (!username.trim() || username.trim().length < 3) {
        setError('Username must be at least 3 characters');
        return;
      }

      if (!email.trim() || !validateEmail(email.trim())) {
        setError('Please enter a valid email address');
        return;
      }

      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      if (!age.trim() || isNaN(Number(age)) || Number(age) < 1 || Number(age) > 120) {
        setError('Please enter a valid age (1-120)');
        return;
      }

      if (!gender) {
        setError('Please select your gender');
        return;
      }
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? '/login' : '/register';
      const payload = isLogin
        ? { email: email.trim(), password }
        : {
            username: username.trim(),
            email: email.trim(),
            password,
            age: Number(age),
            gender,
          };

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-2f7c4d80${endpoint}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      onLogin({ id: data.userId, username: data.username, email: data.email });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative z-10 px-4">
      <div className="w-full max-w-md">
        {/* Logo/Title */}
        <div className="text-center mb-8 animate-float">
          <div className="inline-block p-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-2xl shadow-blue-500/50">
            <User className="w-16 h-16 text-white" />
          </div>
          <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 mb-2">
            ALGOVERSE
          </h1>
          <p className="text-gray-400 text-lg">Master Algorithms Through Gaming</p>
          <div className="mt-4 h-1 w-32 mx-auto bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full"></div>
        </div>

        {/* Auth Form */}
        <div className="bg-gray-800/80 backdrop-blur-xl rounded-2xl p-8 shadow-2xl border border-gray-700">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => {
                setIsLogin(true);
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <LogIn className="w-5 h-5 inline mr-2" />
              Login
            </button>
            <button
              onClick={() => {
                setIsLogin(false);
                setError('');
              }}
              className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${
                !isLogin
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
              }`}
            >
              <UserPlus className="w-5 h-5 inline mr-2" />
              Register
            </button>
          </div>

          <form onSubmit={handleSubmit}>
            {!isLogin && (
              <div className="mb-4">
                <label htmlFor="username" className="block text-gray-300 mb-2">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                  placeholder="Choose a username"
                  maxLength={30}
                  disabled={loading}
                />
              </div>
            )}

            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-300 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Enter your email"
                disabled={loading}
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-300 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                placeholder="Enter your password"
                minLength={6}
                disabled={loading}
              />
            </div>

            {!isLogin && (
              <>
                <div className="mb-4">
                  <label htmlFor="age" className="block text-gray-300 mb-2">
                    Age
                  </label>
                  <input
                    id="age"
                    type="number"
                    value={age}
                    onChange={e => setAge(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-500"
                    placeholder="Enter your age"
                    min="1"
                    max="120"
                    disabled={loading}
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-300 mb-2">Gender</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setGender('male')}
                      disabled={loading}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        gender === 'male'
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('female')}
                      disabled={loading}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        gender === 'female'
                          ? 'bg-pink-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      Female
                    </button>
                    <button
                      type="button"
                      onClick={() => setGender('other')}
                      disabled={loading}
                      className={`py-3 px-4 rounded-lg font-medium transition-all ${
                        gender === 'other'
                          ? 'bg-purple-500 text-white'
                          : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                      }`}
                    >
                      Other
                    </button>
                  </div>
                </div>
              </>
            )}

            {error && (
              <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-6 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105 shadow-lg hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </span>
              ) : (
                <span>{isLogin ? 'Login to Algoverse' : 'Create Account'}</span>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-gray-500 text-sm">
            <p>{isLogin ? 'New to Algoverse?' : 'Already have an account?'}</p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
              }}
              className="text-blue-400 hover:text-blue-300 transition-colors mt-1"
            >
              {isLogin ? 'Create an account' : 'Login instead'}
            </button>
          </div>
        </div>

        {/* Features */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
            <div className="text-blue-400 mb-1">5</div>
            <p className="text-gray-400 text-sm">Games</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
            <div className="text-purple-400 mb-1">∞</div>
            <p className="text-gray-400 text-sm">Learn</p>
          </div>
          <div className="bg-gray-800/50 backdrop-blur-lg rounded-lg p-4 border border-gray-700">
            <div className="text-pink-400 mb-1">🏆</div>
            <p className="text-gray-400 text-sm">Compete</p>
          </div>
        </div>
      </div>
    </div>
  );
}