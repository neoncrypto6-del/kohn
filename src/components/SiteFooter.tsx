import React from 'react';
import { Link } from 'react-router-dom';
import { LockIcon, ShieldCheckIcon } from 'lucide-react';
import { accreditedCountryCount } from '../data/countries';

interface SiteFooterProps {
  navBase?: string;
}

export function SiteFooter({ navBase = '' }: SiteFooterProps) {
  return (
    <footer className="border-t border-ink-200 bg-white">
      <div className="mx-auto w-full max-w-7xl px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[minmax(0,2fr)_minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-gold-500">
                <ShieldCheckIcon
                  className="h-4 w-4 text-ink-900"
                  aria-hidden="true" />
                
              </span>
              <span className="font-display text-sm font-extrabold uppercase tracking-wide text-ink-900">
                Kohn Security &amp; Transportation
              </span>
            </div>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-500">
              A licensed freight custodian moving sealed, high-value and
              time-critical consignments by sea, air and road — with a
              documented chain of custody from pickup to release.
            </p>
          </div>

          <nav aria-label="Footer">
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Company
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-ink-600">
              <li>
                <a
                  className="transition-colors duration-150 ease-out hover:text-gold-700"
                  href={`${navBase}#services`}>
                  
                  Our services
                </a>
              </li>
              <li>
                <a
                  className="transition-colors duration-150 ease-out hover:text-gold-700"
                  href={`${navBase}#about`}>
                  
                  About
                </a>
              </li>
              <li>
                <a
                  className="transition-colors duration-150 ease-out hover:text-gold-700"
                  href={`${navBase}#contact`}>
                  
                  Contact
                </a>
              </li>
              <li>
                <a
                  className="transition-colors duration-150 ease-out hover:text-gold-700"
                  href={`${navBase}#track`}>
                  
                  Track a package
                </a>
              </li>
            </ul>
          </nav>

          <div>
            <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
              Operations desk
            </h2>
            <div className="mt-4 space-y-2 text-sm leading-relaxed text-ink-600">
              <p>ops@kohnsecuretransport.com</p>
              <p className="text-ink-400">Mon–Sat, 07:00–21:00 ET</p>
              <p className="text-ink-500">
                Accredited in {accreditedCountryCount} countries, including the
                United States, Canada, the United Kingdom, Australia and
                Germany.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col items-start justify-between gap-4 border-t border-ink-200 pt-6 sm:flex-row sm:items-center">
          <p className="text-sm text-ink-500">
            © {new Date().getFullYear()} Kohn Security &amp; Transportation.
            Licensed freight custodian.
          </p>
          <Link
            to="/admin"
            className="inline-flex items-center gap-1.5 rounded-md border border-ink-200 px-3 py-1.5 text-xs font-semibold uppercase tracking-wide text-ink-500 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
            
            <LockIcon className="h-3.5 w-3.5" aria-hidden="true" />
            Admin login
          </Link>
        </div>
      </div>
    </footer>);

}