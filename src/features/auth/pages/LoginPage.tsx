import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { login } from '../api';
import { authKeys } from '../queries';

const loginSchema = z.object({
  email: z.email('Introduce un correo válido.').trim(),
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres.'),
});

export function LoginPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [email, setEmail] = useState('admin@lumify.io');
  const [password, setPassword] = useState('lumify2025');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Revisa los datos de acceso.');
      return;
    }
    setLoading(true);
    try {
      await login(parsed.data);
      await queryClient.invalidateQueries({ queryKey: authKeys.me() });
      navigate('/app/dashboard');
    } catch {
      setError('Credenciales incorrectas. Usa admin@lumify.io / lumify2025');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[linear-gradient(135deg,#0a3d62_0%,#0d4f7e_60%,#0a3558_100%)] px-4">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_70%_at_80%_50%,rgba(60,157,255,0.15)_0%,transparent_70%)]" />
        <div className="absolute -left-24 -top-24 h-[500px] w-[500px] rounded-full bg-accent/15 blur-[90px]" />
        <div className="absolute -bottom-24 right-0 h-[380px] w-[380px] rounded-full bg-white/10 blur-[100px]" />
      </div>

      <div className="relative z-10 w-full max-w-[440px] rounded-[24px] border border-white/15 bg-white/8 p-11 text-white shadow-[0_20px_50px_rgba(10,61,98,0.25)] backdrop-blur-xl">
        <div className="mb-8 flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent font-mono text-base font-medium text-white shadow-[0_10px_30px_rgba(60,157,255,0.35)]">
            L
          </div>
          <div>
            <div className="text-xl font-semibold tracking-tight">Lumify</div>
            <div className="text-[13px] text-white/70">Product Information Management</div>
          </div>
        </div>

        <h1 className="mb-1.5 text-[22px] font-semibold">Iniciar sesión</h1>
        <p className="mb-7 text-sm leading-6 text-white/70">
          Centraliza catalogo, contenido y publicacion desde un mismo espacio de trabajo.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="mb-1.5 block text-[13px] text-white/70">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-accent"
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="mb-1.5 block text-[13px] text-white/70">
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/20 bg-white/10 px-3.5 py-2.5 text-sm text-white outline-none placeholder:text-white/40 focus:border-accent"
              required
            />
          </div>

          <div className="flex items-start gap-2 rounded-xl border border-white/15 bg-accent/15 p-3 text-xs text-white/70">
            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            Acceso demo: admin@lumify.io · lumify2025
          </div>

          {error && <p className="text-center text-sm text-danger">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-accent py-3 text-[15px] font-medium text-white shadow-[0_10px_30px_rgba(60,157,255,0.35)] transition-all hover:bg-accent-hover disabled:opacity-60"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}
