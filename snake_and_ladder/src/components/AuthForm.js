import { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

export default function AuthForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const navigate = useNavigate();

  const handleAuth = async () => {
    const { error } = isLogin
      ? await supabase.auth.signInWithPassword({ email, password })
      : await supabase.auth.signUp({ email, password });
    if (error) alert(error.message);
    else navigate('/game');
  };

  return (
    <div className="auth-container"> {/* Style with modern UI */}
      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
      <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
      <button onClick={handleAuth}>{isLogin ? 'Login' : 'Sign Up'}</button>
      <button onClick={() => setIsLogin(!isLogin)}>Switch to {isLogin ? 'Sign Up' : 'Login'}</button>
    </div>
  );
}