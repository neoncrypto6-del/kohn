import type { TransportMode } from '../types/package';

export const TRANSPORT_MODES: TransportMode[] = [
'ship',
'airplane',
'truck',
'fedex',
'usps'];


const TRANSPORT_LABELS: Record<TransportMode, string> = {
  ship: 'Sea freight (ship)',
  airplane: 'Air freight (airplane)',
  truck: 'Road freight (truck)',
  fedex: 'FedEx',
  usps: 'USPS'
};

export function transportLabel(mode: TransportMode): string {
  return TRANSPORT_LABELS[mode] ?? mode;
}

export function formatMoney(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      maximumFractionDigits: 2
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatWeight(weight: number | null): string {
  if (weight === null || Number.isNaN(weight)) return '—';
  return `${weight} kg`;
}

/** Stable, human-readable serial derived from the package's database id. */
export function serialNumber(id: string): string {
  const hex = id.replace(/[^a-fA-F0-9]/g, '').toUpperCase();
  const slice = (hex + '000000000000').slice(0, 12);
  return `${slice.slice(0, 4)}-${slice.slice(4, 8)}-${slice.slice(8, 12)}`;
}

export function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}