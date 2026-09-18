import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ClockIcon, Loader2Icon, SearchCheckIcon } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { submitPackagePayment } from '../utils/packages';

export function PaymentReview() {
  const { trackingId } = useParams<{trackingId: string;}>();
  const [pending, setPending] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    const started = Date.now();

    async function submit() {
      if (!trackingId) return;
      try {
        await submitPackagePayment(trackingId);
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ?
            err.message :
            'We could not register the transfer automatically.'
          );
        }
      } finally {
        const elapsed = Date.now() - started;
        window.setTimeout(
          () => {
            if (active) setPending(false);
          },
          Math.max(0, 3200 - elapsed)
        );
      }
    }

    void submit();
    return () => {
      active = false;
    };
  }, [trackingId]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-50">
      <div className="bg-ink-900">
        <SiteHeader showNav navBase="/" />
      </div>

      <main className="mx-auto flex w-full max-w-3xl flex-1 items-center px-6 py-16">
        <div className="w-full rounded-lg border border-ink-200 bg-white p-8 sm:p-12">
          {pending ?
          <div
            className="flex min-h-[320px] flex-col items-center justify-center text-center"
            role="status"
            aria-live="polite">
            
              <Loader2Icon
              className="h-9 w-9 animate-spin text-gold-500"
              aria-hidden="true" />
            
              <h1 className="mt-6 font-display text-xl font-bold text-ink-900">
                Submitting your transfer
              </h1>
              <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
                Matching your BTC payment to consignment {trackingId}. This
                takes a few seconds.
              </p>
            </div> :

          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
            className="text-center">
            
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-gold-50">
                <SearchCheckIcon
                className="h-7 w-7 text-gold-600"
                aria-hidden="true" />
              
              </span>
              <h1 className="mt-6 font-display text-2xl font-extrabold tracking-tight text-ink-900">
                Payment under review
              </h1>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-600">
                Your transfer for{' '}
                <span className="font-semibold text-ink-900">{trackingId}</span>{' '}
                has been logged and is now with our clearance desk. Once the
                amount is confirmed on-chain, the consignment is marked paid and
                released for delivery. No further action is needed from you.
              </p>

              {error ?
            <p className="mx-auto mt-4 max-w-lg rounded-md border border-gold-200 bg-gold-50 px-4 py-3 text-xs leading-relaxed text-ink-700">
                  Note: {error} Quote your tracking ID to the operations desk so
                  an officer can match the transfer manually.
                </p> :
            null}

              <div className="mx-auto mt-8 flex max-w-md items-start gap-3 rounded-md border border-ink-200 bg-ink-50 p-4 text-left">
                <ClockIcon
                className="mt-0.5 h-4 w-4 shrink-0 text-ink-400"
                aria-hidden="true" />
              
                <p className="text-xs leading-relaxed text-ink-600">
                  Reviews are completed within one business day. The status on
                  your tracking record updates automatically — you do not need
                  to pay again.
                </p>
              </div>

              <Link
              to={`/track/${encodeURIComponent(trackingId ?? '')}`}
              className="mt-8 inline-flex h-12 items-center justify-center rounded-md bg-ink-900 px-6 font-display text-sm font-bold uppercase tracking-wide text-white transition-colors duration-150 ease-out hover:bg-ink-800">
              
                View shipment record
              </Link>
            </motion.div>
          }
        </div>
      </main>

      <SiteFooter navBase="/" />
    </div>);

}