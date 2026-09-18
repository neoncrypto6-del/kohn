import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MenuIcon, ShieldCheckIcon, XIcon } from 'lucide-react';

interface SiteHeaderProps {
  variant?: 'onDark' | 'onLight';
  right?: React.ReactNode;
  /** Show the Services / About / Contact navigation. */
  showNav?: boolean;
  /** Prefix for section anchors: '' on the landing page, '/' elsewhere. */
  navBase?: string;
}

const NAV_ITEMS = [
{ label: 'Track', hash: '#track' },
{ label: 'Our services', hash: '#services' },
{ label: 'About', hash: '#about' },
{ label: 'Accreditation', hash: '#coverage' },
{ label: 'Contact', hash: '#contact' }];


export function SiteHeader({
  variant = 'onDark',
  right,
  showNav = false,
  navBase = ''
}: SiteHeaderProps) {
  const onDark = variant === 'onDark';
  const [open, setOpen] = useState(false);

  const linkClass = onDark ?
  'text-sm font-medium text-ink-200 transition-colors duration-150 ease-out hover:text-gold-300' :
  'text-sm font-medium text-ink-600 transition-colors duration-150 ease-out hover:text-gold-700';

  return (
    <header
      className={
      onDark ?
      'w-full border-b border-white/10' :
      'w-full border-b border-ink-200 bg-white'
      }>
      
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link to="/" className="flex shrink-0 items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-md bg-gold-500">
            <ShieldCheckIcon
              className="h-5 w-5 text-ink-900"
              aria-hidden="true" />
            
          </span>
          <span className="leading-tight">
            <span
              className={
              onDark ?
              'block font-display text-base font-extrabold uppercase tracking-wide text-white' :
              'block font-display text-base font-extrabold uppercase tracking-wide text-ink-900'
              }>
              
              Kohn
            </span>
            <span
              className={
              onDark ?
              'block text-[11px] font-medium uppercase tracking-[0.18em] text-gold-300' :
              'block text-[11px] font-medium uppercase tracking-[0.18em] text-gold-600'
              }>
              
              Security &amp; Transportation
            </span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {showNav ?
          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 md:flex">
            
              {NAV_ITEMS.map((item) =>
            <a
              key={item.hash}
              href={`${navBase}${item.hash}`}
              className={linkClass}>
              
                  {item.label}
                </a>
            )}
            </nav> :
          null}
          {right}
          {showNav ?
          <button
            type="button"
            onClick={() => setOpen((value) => !value)}
            aria-expanded={open}
            aria-label={open ? 'Close menu' : 'Open menu'}
            className={
            onDark ?
            'rounded-md border border-white/15 p-2 text-white md:hidden' :
            'rounded-md border border-ink-200 p-2 text-ink-700 md:hidden'
            }>
            
              {open ?
            <XIcon className="h-4 w-4" aria-hidden="true" /> :

            <MenuIcon className="h-4 w-4" aria-hidden="true" />
            }
            </button> :
          null}
        </div>
      </div>

      {showNav && open ?
      <nav
        aria-label="Primary mobile"
        className={
        onDark ?
        'border-t border-white/10 px-6 pb-4 md:hidden' :
        'border-t border-ink-200 px-6 pb-4 md:hidden'
        }>
        
          <ul className="flex flex-col gap-3 pt-3">
            {NAV_ITEMS.map((item) =>
          <li key={item.hash}>
                <a
              href={`${navBase}${item.hash}`}
              className={linkClass}
              onClick={() => setOpen(false)}>
              
                  {item.label}
                </a>
              </li>
          )}
          </ul>
        </nav> :
      null}
    </header>);

}