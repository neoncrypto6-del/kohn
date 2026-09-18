import React from 'react';
import { PrinterIcon, ShieldCheckIcon, XIcon } from 'lucide-react';
import { serialNumber } from '../../utils/format';
import type { PackageRecord } from '../../types/package';

/** Deterministic Code-39-looking bar pattern derived from the tracking ID. */
function barsFor(value: string): number[] {
  const bars: number[] = [];
  for (let i = 0; i < value.length; i += 1) {
    const code = value.charCodeAt(i);
    bars.push(code % 3 + 1, (code >> 2) % 2 + 1, code % 2 + 1, 1);
  }
  return bars;
}

export function PackageTicket({
  pkg,
  onClose



}: {pkg: PackageRecord;onClose: () => void;}) {
  const bars = barsFor(pkg.tracking_id);
  const issued = new Date(pkg.created_at);

  return (
    <div
      className="fixed inset-0 z-50 overflow-y-auto bg-ink-900/70 p-4 sm:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`Custody ticket for ${pkg.tracking_id}`}>
      
      <div className="mx-auto w-full max-w-3xl">
        <div className="no-print mb-4 flex items-center justify-between gap-4">
          <p className="text-sm font-semibold text-white">
            Custody ticket generated
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-4 text-sm font-semibold text-ink-900 transition-colors duration-150 ease-out hover:bg-ink-100">
              
              <PrinterIcon className="h-4 w-4" aria-hidden="true" />
              Print ticket
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close ticket"
              className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-white/20 text-white transition-colors duration-150 ease-out hover:bg-white/10">
              
              <XIcon className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* Ticket — intentionally pure black and white */}
        <article className="print-ticket border-2 border-black bg-white p-8 text-black">
          <header className="flex items-start justify-between gap-6 border-b-2 border-black pb-5">
            <div className="flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center border-2 border-black">
                <ShieldCheckIcon className="h-6 w-6" aria-hidden="true" />
              </span>
              <span className="leading-tight">
                <span className="block font-display text-lg font-extrabold uppercase tracking-wide">
                  Kohn
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.2em]">
                  Security &amp; Transportation
                </span>
              </span>
            </div>
            <div className="text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Custody ticket
              </p>
              <p className="mt-1 font-mono text-sm">
                {issued.toLocaleDateString('en-GB', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric'
                })}{' '}
                ·{' '}
                {issued.toLocaleTimeString('en-GB', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </header>

          <div className="grid gap-6 border-b border-black py-5 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Ticket / tracking ID
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-wider">
                {pkg.tracking_id}
              </p>
            </div>
            <div className="sm:text-right">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                Serial number
              </p>
              <p className="mt-1 font-mono text-2xl font-bold tracking-wider">
                {serialNumber(pkg.id)}
              </p>
            </div>
          </div>

          <div className="grid gap-8 border-b border-black py-5 sm:grid-cols-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                From
              </p>
              <p className="mt-2 text-sm font-bold uppercase">
                {pkg.sender_name}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                {pkg.sender_address || '—'}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
                To
              </p>
              <p className="mt-2 text-sm font-bold uppercase">
                {pkg.recipient_name}
              </p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed">
                {pkg.recipient_address || '—'}
              </p>
            </div>
          </div>

          <div className="grid gap-x-8 gap-y-3 border-b border-black py-5 text-sm sm:grid-cols-3">
            <TicketFact label="Package" value={pkg.name} />
            <TicketFact
              label="Weight"
              value={pkg.weight_kg === null ? '—' : `${pkg.weight_kg} kg`} />
            
            <TicketFact
              label="Transport"
              value={pkg.transport_mode.toUpperCase()} />
            
          </div>

          <div className="pt-6">
            <div
              className="flex h-24 items-end gap-[2px]"
              role="img"
              aria-label={`Barcode encoding ${pkg.tracking_id}`}>
              
              {bars.map((width, index) =>
              <span
                key={`${index}-${width}`}
                className={index % 2 === 0 ? 'bg-black' : 'bg-white'}
                style={{ width: `${width * 2}px`, height: '100%' }} />

              )}
            </div>
            <p className="mt-2 font-mono text-sm tracking-[0.3em]">
              {pkg.tracking_id}
            </p>
          </div>

          <footer className="mt-6 border-t border-black pt-4 text-[10px] leading-relaxed">
            This ticket is the custody receipt for the consignment above. Retain
            it: the tracking ID and serial number are required to query, pay for
            or collect the package. Kohn Security &amp; Transportation accepts
            custody subject to its published terms of carriage.
          </footer>
        </article>
      </div>
    </div>);

}

function TicketFact({ label, value }: {label: string;value: string;}) {
  return (
    <div>
      <p className="text-[10px] font-semibold uppercase tracking-[0.2em]">
        {label}
      </p>
      <p className="mt-1 font-medium">{value}</p>
    </div>);

}