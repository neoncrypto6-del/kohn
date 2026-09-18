import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  BoxIcon,
  MapPinIcon,
  PlaneIcon,
  ShipIcon,
  TruckIcon } from
'lucide-react';
import type { PackageRecord, TransportMode } from '../types/package';

const TRANSPORT_ICONS: Record<TransportMode, typeof BoxIcon> = {
  ship: ShipIcon,
  airplane: PlaneIcon,
  truck: TruckIcon,
  fedex: BoxIcon,
  usps: BoxIcon
};

/** Rough journey completion, derived from what operations has recorded. */
function progressFor(pkg: PackageRecord): number {
  if (pkg.clearance_status === 'cleared' && pkg.payment_status === 'paid') {
    return 0.92;
  }
  if (pkg.payment_status === 'paid' || pkg.payment_status === 'under_review') {
    return 0.66;
  }
  if (pkg.current_location) return 0.48;
  return 0.08;
}

function firstLine(value: string | null): string | null {
  if (!value) return null;
  return value.split(/[\n,]/)[0]?.trim() || null;
}

export function RouteProgress({ pkg }: {pkg: PackageRecord;}) {
  const TransportIcon = TRANSPORT_ICONS[pkg.transport_mode] ?? BoxIcon;
  const progress = progressFor(pkg);
  const reduceMotion = useReducedMotion();

  const origin = firstLine(pkg.sender_address) ?? pkg.sender_name;
  const destination = firstLine(pkg.recipient_address) ?? pkg.recipient_name;

  return (
    <div className="rounded-lg border border-ink-200 bg-white px-6 py-7 sm:px-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <h2 className="font-display text-sm font-bold uppercase tracking-[0.18em] text-ink-400">
          Movement
        </h2>
        <p className="text-sm text-ink-500">
          Currently at{' '}
          <span className="font-semibold text-ink-900">
            {pkg.current_location || 'origin depot'}
          </span>
        </p>
      </div>

      <div className="relative mt-12 pb-2">
        {/* track */}
        <div className="absolute left-0 right-0 top-3 h-1 rounded-full bg-ink-200" />
        <motion.div
          className="absolute left-0 top-3 h-1 rounded-full bg-gold-500"
          initial={{ width: reduceMotion ? `${progress * 100}%` : '0%' }}
          animate={{ width: `${progress * 100}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.23, 1, 0.32, 1] }} />
        

        {/* endpoints */}
        <span className="absolute left-0 top-0 flex h-7 w-7 -translate-x-1 items-center justify-center rounded-full border-2 border-gold-500 bg-white">
          <span className="h-2.5 w-2.5 rounded-full bg-gold-500" />
        </span>
        <span
          className={
          progress >= 0.9 ?
          'absolute right-0 top-0 flex h-7 w-7 translate-x-1 items-center justify-center rounded-full border-2 border-gold-500 bg-gold-500' :
          'absolute right-0 top-0 flex h-7 w-7 translate-x-1 items-center justify-center rounded-full border-2 border-ink-300 bg-white'
          }>
          
          <MapPinIcon
            className={
            progress >= 0.9 ?
            'h-3.5 w-3.5 text-ink-900' :
            'h-3.5 w-3.5 text-ink-400'
            }
            aria-hidden="true" />
          
        </span>

        {/* moving vehicle */}
        <motion.div
          className="absolute top-0 flex flex-col items-center"
          initial={{ left: reduceMotion ? `${progress * 100}%` : '0%' }}
          animate={{ left: `${progress * 100}%` }}
          transition={{ duration: reduceMotion ? 0 : 0.9, ease: [0.23, 1, 0.32, 1] }}
          style={{ x: '-50%' }}>
          
          <motion.span
            className="flex h-12 w-12 items-center justify-center rounded-full border border-gold-200 bg-gold-50 shadow-sm"
            animate={reduceMotion ? undefined : { y: [0, -3, 0] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}>
            
            <TransportIcon
              className="h-5 w-5 text-gold-700"
              aria-hidden="true" />
            
          </motion.span>
        </motion.div>
      </div>

      <div className="mt-14 flex items-start justify-between gap-6">
        <div className="max-w-[45%]">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            From
          </p>
          <p className="mt-1 font-semibold text-ink-900">{pkg.sender_name}</p>
          {origin ?
          <p className="mt-0.5 text-sm text-ink-500">{origin}</p> :
          null}
        </div>
        <div className="max-w-[45%] text-right">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            To
          </p>
          <p className="mt-1 font-semibold text-ink-900">
            {pkg.recipient_name}
          </p>
          {destination ?
          <p className="mt-0.5 text-sm text-ink-500">{destination}</p> :
          null}
        </div>
      </div>
    </div>);

}