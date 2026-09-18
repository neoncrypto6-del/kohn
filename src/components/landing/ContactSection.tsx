import React, { useState } from 'react';
import { CheckCircle2Icon, ClockIcon, GlobeIcon, MailIcon } from 'lucide-react';
import { accreditedCountryCount } from '../../data/countries';

export function ContactSection() {
  const [sent, setSent] = useState(false);

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="scroll-mt-24 border-t border-ink-200 bg-white">
      
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Contact
          </p>
          <h2
            id="contact-heading"
            className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            
            Talk to the operations desk
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            Questions about a held consignment, a fee, or a clearance decision
            are answered by the officer who registered it. Quote your tracking
            ID and we will pull the custody log before we reply.
          </p>

          <dl className="mt-8 space-y-5 border-t border-ink-200 pt-8">
            <div className="flex gap-3">
              <MailIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true" />
              
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Email
                </dt>
                <dd className="mt-0.5 text-sm text-ink-700">
                  ops@kohnsecuretransport.com
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <ClockIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true" />
              
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Desk hours
                </dt>
                <dd className="mt-0.5 text-sm text-ink-700">
                  Monday to Saturday, 07:00–21:00 ET
                </dd>
              </div>
            </div>
            <div className="flex gap-3">
              <GlobeIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-gold-600"
                aria-hidden="true" />
              
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wide text-ink-400">
                  Accreditation
                </dt>
                <dd className="mt-0.5 text-sm leading-relaxed text-ink-700">
                  Licensed to take custody in {accreditedCountryCount}{' '}
                  countries across five regions.
                </dd>
              </div>
            </div>
          </dl>
        </div>

        <div className="rounded-lg border border-ink-200 bg-ink-50 p-6 sm:p-8">
          {sent ?
          <div className="flex h-full flex-col items-start justify-center">
              <CheckCircle2Icon
              className="h-8 w-8 text-emerald-700"
              aria-hidden="true" />
            
              <h3 className="mt-4 font-display text-xl font-bold text-ink-900">
                Message received
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-600">
                An operations officer will reply by email, usually within one
                business day. Urgent clearance matters are prioritised.
              </p>
              <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-6 h-11 rounded-md border border-ink-300 px-5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-white">
              
                Send another message
              </button>
            </div> :

          <form
            onSubmit={(event) => {
              event.preventDefault();
              setSent(true);
            }}
            className="space-y-4">
            
              <div className="grid gap-4 sm:grid-cols-2">
                <ContactField label="Full name" name="contact-name" required />
                <ContactField
                label="Email"
                name="contact-email"
                type="email"
                required />
              
              </div>
              <ContactField
              label="Tracking ID (optional)"
              name="contact-tracking"
              placeholder="KST-26-…" />
            
              <div>
                <label
                htmlFor="contact-message"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
                
                  How can we help?
                </label>
                <textarea
                id="contact-message"
                name="contact-message"
                rows={5}
                required
                className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
              
              </div>
              <button
              type="submit"
              className="h-12 w-full rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400">
              
                Send message
              </button>
            </form>
          }
        </div>
      </div>
    </section>);

}

interface ContactFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function ContactField({ label, name, ...rest }: ContactFieldProps) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        
        {label}
      </label>
      <input
        id={name}
        name={name}
        type="text"
        className="h-11 w-full rounded-md border border-ink-200 bg-white px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        {...rest} />
      
    </div>);

}