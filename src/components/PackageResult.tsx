import React from 'react';
import { Link } from 'react-router-dom';
import {
  BoxIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
  PlaneIcon,
  ScaleIcon,
  ShipIcon,
  TruckIcon } from
'lucide-react';
import { ClearanceBadge, PaymentBadge } from './StatusBadge';
import {
  formatDate,
  formatMoney,
  formatWeight,
  transportLabel } from
'../utils/format';
import type { PackageRecord, TransportMode } from '../types/package';

const TRANSPORT_ICONS: Record<TransportMode, typeof BoxIcon> = {
  ship: ShipIcon,
  airplane: PlaneIcon,
  truck: TruckIcon,
  fedex: BoxIcon,
  usps: BoxIcon
};

export function PackageResult({ pkg }: {pkg: PackageRecord;}) {
  const TransportIcon = TRANSPORT_ICONS[pkg.transport_mode] ?? BoxIcon;
  const unpaid = pkg.payment_status === 'unpaid';
  const underReview = pkg.payment_status === 'under_review';

  return (
    <section
      aria-label={`Shipment ${pkg.tracking_id}`}
      className="overflow-hidden rounded-lg border border-ink-200 bg-white">
      
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-ink-200 px-6 py-5 sm:px-8">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
            Tracking ID
          </p>
          <p className="font-display text-xl font-extrabold tracking-wide text-ink-900">
            {pkg.tracking_id}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <PaymentBadge status={pkg.payment_status} />
          <ClearanceBadge status={pkg.clearance_status} />
        </div>
      </div>

      <div className="grid gap-8 px-6 py-8 sm:px-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-400">
            Current location
          </p>
          <h2 className="mt-2 flex items-start gap-2 font-display text-3xl font-extrabold leading-tight text-ink-900">
            <MapPinIcon
              className="mt-1 h-6 w-6 shrink-0 text-gold-500"
              aria-hidden="true" />
            
            {pkg.current_location || 'Awaiting first scan'}
          </h2>

          <dl className="mt-6 grid gap-x-8 gap-y-5 border-t border-ink-200 pt-6 sm:grid-cols-3">
            <Metric
              icon={<TransportIcon className="h-4 w-4" aria-hidden="true" />}
              label="Means of transport"
              value={transportLabel(pkg.transport_mode)} />
            
            <Metric
              icon={<ScaleIcon className="h-4 w-4" aria-hidden="true" />}
              label="Weight"
              value={formatWeight(pkg.weight_kg)} />
            
            <Metric
              icon={<BoxIcon className="h-4 w-4" aria-hidden="true" />}
              label="Registered"
              value={formatDate(pkg.created_at)} />
            
          </dl>

          <div className="mt-8 border-t border-ink-200 pt-6">
            <h3 className="font-display text-lg font-bold text-ink-900">
              {pkg.name}
            </h3>
            {pkg.description ?
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink-600">
                {pkg.description}
              </p> :
            null}
          </div>

          <div className="mt-8 grid gap-6 border-t border-ink-200 pt-6 sm:grid-cols-2">
            <Party
              heading="From"
              name={pkg.sender_name}
              address={pkg.sender_address}
              email={pkg.sender_email}
              phone={pkg.sender_phone} />
            
            <Party
              heading="To"
              name={pkg.recipient_name}
              address={pkg.recipient_address}
              email={pkg.recipient_email}
              phone={pkg.recipient_phone} />
            
          </div>
        </div>

        <aside className="flex flex-col gap-6">
          <div className="overflow-hidden rounded-md border border-ink-200 bg-ink-50">
            {pkg.image_url ?
            <img
              src={pkg.image_url}
              alt={`Photograph of ${pkg.name}`}
              className="aspect-[4/3] w-full object-cover" /> :


            <div className="flex aspect-[4/3] w-full items-center justify-center text-ink-300">
                <BoxIcon className="h-10 w-10" aria-hidden="true" />
              </div>
            }
          </div>

          <div
            className={
            unpaid ?
            'rounded-md border border-gold-200 bg-gold-50 p-5' :
            'rounded-md border border-ink-200 bg-ink-50 p-5'
            }>
            
            <div className="flex items-baseline justify-between gap-3">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-500">
                Package fee
              </span>
              <span className="font-display text-2xl font-extrabold text-ink-900">
                {formatMoney(pkg.fee, pkg.currency)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-ink-600">
              {unpaid ?
              'This shipment is not paid and not cleared to be delivered. Settle the fee to move it into clearance.' :
              underReview ?
              'Your payment has been submitted and is under review by our clearance desk. No further action is needed from you.' :
              pkg.clearance_status === 'cleared' ?
              'Fee settled and cleared to be delivered.' :
              'Fee settled. Clearance review is in progress.'}
            </p>
            {unpaid ?
            <Link
              to={`/pay/${encodeURIComponent(pkg.tracking_id)}`}
              className="mt-4 flex h-11 w-full items-center justify-center rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400">
              
                Pay {formatMoney(pkg.fee, pkg.currency)}
              </Link> :
            null}
          </div>
        </aside>
      </div>
    </section>);

}

function Metric({
  icon,
  label,
  value




}: {icon: React.ReactNode;label: string;value: string;}) {
  return (
    <div>
      <dt className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-400">
        <span className="text-gold-600">{icon}</span>
        {label}
      </dt>
      <dd className="mt-1 text-sm font-semibold text-ink-900">{value}</dd>
    </div>);

}

function Party({
  heading,
  name,
  address,
  email,
  phone






}: {heading: string;name: string;address: string | null;email: string | null;phone: string | null;}) {
  return (
    <div className="flex flex-col">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
        {heading}
      </p>
      <p className="mt-2 font-semibold text-ink-900">{name}</p>
      {address ?
      <p className="mt-1 text-sm leading-relaxed text-ink-600">{address}</p> :
      null}
      <div className="mt-auto space-y-1 pt-3 text-sm text-ink-600">
        {email ?
        <p className="flex items-center gap-2 break-all">
            <MailIcon
            className="h-3.5 w-3.5 shrink-0 text-ink-400"
            aria-hidden="true" />
          
            {email}
          </p> :
        null}
        {phone ?
        <p className="flex items-center gap-2">
            <PhoneIcon
            className="h-3.5 w-3.5 shrink-0 text-ink-400"
            aria-hidden="true" />
          
            {phone}
          </p> :
        null}
      </div>
    </div>);

}