import React from 'react';
import {
  CheckCircle2Icon,
  CircleDollarSignIcon,
  ClockIcon,
  ShieldAlertIcon,
  ShieldCheckIcon } from
'lucide-react';
import type { ClearanceStatus, PaymentStatus } from '../types/package';

const BASE =
'inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide';

export function PaymentBadge({ status }: {status: PaymentStatus;}) {
  if (status === 'paid') {
    return (
      <span className={`${BASE} bg-emerald-100 text-emerald-800`}>
        <CheckCircle2Icon className="h-3.5 w-3.5" aria-hidden="true" />
        Paid
      </span>);

  }

  if (status === 'under_review') {
    return (
      <span className={`${BASE} bg-gold-100 text-gold-800`}>
        <ClockIcon className="h-3.5 w-3.5" aria-hidden="true" />
        Payment under review
      </span>);

  }

  return (
    <span className={`${BASE} bg-red-100 text-red-800`}>
      <CircleDollarSignIcon className="h-3.5 w-3.5" aria-hidden="true" />
      Not paid
    </span>);

}

export function ClearanceBadge({ status }: {status: ClearanceStatus;}) {
  const cleared = status === 'cleared';
  return (
    <span
      className={
      cleared ?
      `${BASE} bg-emerald-100 text-emerald-800` :
      `${BASE} bg-ink-200 text-ink-700`
      }>
      
      {cleared ?
      <ShieldCheckIcon className="h-3.5 w-3.5" aria-hidden="true" /> :

      <ShieldAlertIcon className="h-3.5 w-3.5" aria-hidden="true" />
      }
      {cleared ? 'Cleared for delivery' : 'Not cleared for delivery'}
    </span>);

}