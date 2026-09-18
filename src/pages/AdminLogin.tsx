import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeftIcon, Loader2Icon, ShieldCheckIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function AdminLogin() {
  const { session, signIn } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (session) navigate('/admin/packages', { replace: true });
  }, [session, navigate]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate('/admin/packages', { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign in failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-ink-900 px-6 py-12">
      <main className="w-full max-w-sm">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
            <ShieldCheckIcon
              className="h-5 w-5 text-ink-900"
              aria-hidden="true" />
            
          </span>
          <span className="leading-tight">
            <span className="block font-display text-base font-extrabold uppercase tracking-wide text-white">
              Kohn
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-[0.18em] text-gold-300">
              Operations console
            </span>
          </span>
        </div>

        <h1 className="mt-8 font-display text-2xl font-extrabold text-white">
          Admin sign in
        </h1>
        <p className="mt-2 text-sm text-ink-300">
          Restricted to authorised operations staff.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="admin-email"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gold-300">
              
              Email
            </label>
            <input
              id="admin-email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="h-12 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40" />
            
          </div>
          <div>
            <label
              htmlFor="admin-password"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-gold-300">
              
              Password
            </label>
            <input
              id="admin-password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="h-12 w-full rounded-md border border-white/15 bg-white/5 px-3 text-sm text-white placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40" />
            
          </div>

          {error ?
          <p className="text-sm text-red-300" role="alert">
              {error}
            </p> :
          null}

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60">
            
            {submitting ?
            <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> :
            null}
            Sign in
          </button>
        </form>

        <Link
          to="/"
          className="mt-8 inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors duration-150 ease-out hover:text-gold-300">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to tracking
        </Link>
      </main>
    </div>);

}