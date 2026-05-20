import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
  const [mode, setMode] = useState('login');
  const [form, setForm] = useState({ name: 'Mudit', email: 'jainmudit616@gmail.com', password: 'password' });
  const [error, setError] = useState('');
  const { login, register } = useAuth();
  const navigate = useNavigate();

  async function submit(e) {
    e.preventDefault();
    try {
      mode === 'login' ? await login(form.email, form.password) : await register(form);
      navigate('/app');
    } catch {
      setError('Could not connect or login. Start the Laravel API and try again.');
    }
  }

  return (
    <main className="grid min-h-screen place-items-center px-4">
      <form onSubmit={submit} className="card w-full max-w-md">
        <div className="mb-6 flex items-center gap-2 text-2xl font-bold"><Shield className="text-brand" /> SafeHood</div>
        <div className="mb-4 grid grid-cols-2 rounded-lg bg-slate-100 p-1 dark:bg-slate-800">
          {['login', 'register'].map((item) => (
            <button type="button" key={item} onClick={() => setMode(item)} className={`rounded-md py-2 text-sm font-semibold capitalize ${mode === item ? 'bg-white shadow dark:bg-slate-950' : ''}`}>{item}</button>
          ))}
        </div>
        {mode === 'register' && <input className="input mb-3" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />}
        <input className="input mb-3" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="input mb-4" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        {error && <p className="mb-3 text-sm text-red-500">{error}</p>}
        <button className="btn-primary w-full">{mode === 'login' ? 'Login' : 'Create Account'}</button>
      </form>
    </main>
  );
}
