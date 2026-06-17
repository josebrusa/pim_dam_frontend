import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authStorage, http } from '@/shared/api/http';

export function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@lumify.io');
  const [password, setPassword] = useState('lumify2025');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await http.post('/auth/login', { email, password });
      authStorage.setToken(data.accessToken);
      navigate('/app/dashboard');
    } catch {
      setError('Credenciales incorrectas. Usa admin@lumify.io / lumify2025');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-bg-base">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[80px]" />
        <div className="absolute -bottom-20 -right-20 h-[400px] w-[400px] rounded-full bg-cyan-500/15 blur-[80px]" />
      </div>

      <div className="relative z-10 w-full max-w-[420px] rounded-[14px] border border-border bg-bg-card p-11 shadow-2xl">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent font-mono text-base font-medium text-white">
            L
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight">Lumify</div>
            <div className="text-[13px] text-text-secondary">Product Information Management</div>
          </div>
        </div>

        <h1 className="mb-1.5 text-[22px] font-semibold">Iniciar sesión</h1>
        <p className="mb-7 text-sm text-text-secondary">
          Accede a tu espacio de trabajo PIM
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] text-text-secondary">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-bg-input px-3.5 py-2.5 text-sm outline-none focus:border-accent/40"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] text-text-secondary">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-[10px] border border-border bg-bg-input px-3.5 py-2.5 text-sm outline-none focus:border-accent/40"
              required
            />
          </div>

          <div className="flex items-start gap-2 rounded-lg border border-border bg-bg-surface p-3 text-xs text-text-muted">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Demo: admin@lumify.io · lumify2025
          </div>

          {error && <p className="text-center text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-[10px] bg-accent py-3 text-[15px] font-medium text-white transition hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
