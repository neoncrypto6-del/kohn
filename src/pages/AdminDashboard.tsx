import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  AlertCircleIcon,
  LogOutIcon,
  MapPinIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TicketIcon,
  Trash2Icon } from
'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { ClearanceBadge, PaymentBadge } from '../components/StatusBadge';
import { PackageForm } from '../components/admin/PackageForm';
import { PackageTicket } from '../components/admin/PackageTicket';
import { LocationDialog } from '../components/admin/LocationDialog';
import { useAuth } from '../contexts/AuthContext';
import { deletePackage, listMyPackages } from '../utils/packages';
import { formatMoney, formatWeight, transportLabel } from '../utils/format';
import type { PackageRecord } from '../types/package';

export function AdminDashboard() {
  const { session, signOut } = useAuth();

  const [packages, setPackages] = useState<PackageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<PackageRecord | null>(null);
  const [relocating, setRelocating] = useState<PackageRecord | null>(null);
  const [ticketFor, setTicketFor] = useState<PackageRecord | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    void refresh();
  }, []);

  async function refresh() {
    setLoading(true);
    setError(null);
    try {
      setPackages(await listMyPackages());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not load packages');
    } finally {
      setLoading(false);
    }
  }

  const filtered = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return packages;
    return packages.filter((pkg) =>
    [pkg.tracking_id, pkg.name, pkg.recipient_name, pkg.current_location ?? ''].
    join(' ').
    toLowerCase().
    includes(term)
    );
  }, [packages, query]);

  function upsert(saved: PackageRecord) {
    setPackages((current) => {
      const index = current.findIndex((item) => item.id === saved.id);
      if (index === -1) return [saved, ...current];
      const next = [...current];
      next[index] = saved;
      return next;
    });
  }

  async function handleDelete(pkg: PackageRecord) {
    const confirmed = window.confirm(
      `Delete ${pkg.tracking_id} (${pkg.name})? This cannot be undone.`
    );
    if (!confirmed) return;
    setDeletingId(pkg.id);
    try {
      await deletePackage(pkg.id);
      setPackages((current) => current.filter((item) => item.id !== pkg.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not delete package');
    } finally {
      setDeletingId(null);
    }
  }

  const unpaidCount = packages.filter((p) => p.payment_status !== 'paid').length;

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-50">
      <SiteHeader
        variant="onLight"
        right={
        <div className="flex items-center gap-4">
            <span className="hidden text-sm text-ink-500 sm:inline">
              {session?.user.email}
            </span>
            <button
            type="button"
            onClick={() => void signOut()}
            className="inline-flex h-10 items-center gap-2 rounded-md border border-ink-200 px-3 text-sm font-semibold text-ink-600 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
            
              <LogOutIcon className="h-4 w-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        } />
      

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <h1 className="font-display text-3xl font-extrabold tracking-tight text-ink-900">
              Package register
            </h1>
            <p className="mt-2 text-sm text-ink-500">
              {packages.length} shipment{packages.length === 1 ? '' : 's'}{' '}
              registered under your login
              {unpaidCount > 0 ? ` · ${unpaidCount} awaiting payment` : ''}
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setEditing(null);
              setFormOpen(true);
            }}
            className="inline-flex h-12 items-center gap-2 rounded-md bg-gold-500 px-6 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400">
            
            <PlusIcon className="h-4 w-4" aria-hidden="true" />
            Add new package
          </button>
        </div>

        {formOpen ?
        <div className="mt-8">
            <PackageForm
            initial={editing}
            onCancel={() => {
              setFormOpen(false);
              setEditing(null);
            }}
            onSaved={(saved, created) => {
              upsert(saved);
              setFormOpen(false);
              setEditing(null);
              if (created) setTicketFor(saved);
            }} />
          
          </div> :
        null}

        <div className="mt-8 flex items-center gap-3">
          <div className="relative w-full max-w-sm">
            <SearchIcon
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400"
              aria-hidden="true" />
            
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search tracking ID, package, recipient…"
              aria-label="Search packages"
              className="h-11 w-full rounded-md border border-ink-200 bg-white pl-9 pr-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
            
          </div>
        </div>

        {error ?
        <div
          role="alert"
          className="mt-6 flex items-start gap-3 rounded-md border border-red-200 bg-red-50 p-4">
          
            <AlertCircleIcon
            className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
            aria-hidden="true" />
          
            <p className="text-sm text-red-800">{error}</p>
          </div> :
        null}

        <div className="mt-6 overflow-hidden rounded-lg border border-ink-200 bg-white">
          {loading ?
          <div className="space-y-3 p-6">
              {[0, 1, 2].map((row) =>
            <div
              key={row}
              className="h-14 animate-pulse rounded-md bg-ink-100" />

            )}
            </div> :
          filtered.length === 0 ?
          <div className="px-6 py-16 text-center">
              <p className="font-display text-lg font-bold text-ink-900">
                {packages.length === 0 ?
              'No packages registered yet' :
              'No matches for that search'}
              </p>
              <p className="mx-auto mt-2 max-w-md text-sm text-ink-500">
                {packages.length === 0 ?
              'Add your first shipment — a tracking ID is generated automatically and becomes searchable on the public site immediately.' :
              'Try a different tracking ID, package name or recipient.'}
              </p>
            </div> :

          <div className="overflow-x-auto">
              <table className="w-full min-w-[960px] text-left">
                <thead className="border-b border-ink-200 bg-ink-50">
                  <tr className="text-xs font-semibold uppercase tracking-wide text-ink-500">
                    <th scope="col" className="px-6 py-3">
                      Tracking / package
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Route
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Fee
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-ink-200">
                  {filtered.map((pkg) =>
                <tr key={pkg.id} className="align-top">
                      <td className="px-6 py-4">
                        <Link
                      to={`/track/${pkg.tracking_id}`}
                      className="font-display text-sm font-bold tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:text-gold-700">
                      
                          {pkg.tracking_id}
                        </Link>
                        <p className="mt-1 text-sm text-ink-600">{pkg.name}</p>
                        <p className="mt-0.5 text-xs text-ink-400">
                          {formatWeight(pkg.weight_kg)} ·{' '}
                          {transportLabel(pkg.transport_mode)}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-600">
                        <p>
                          <span className="text-ink-400">From </span>
                          {pkg.sender_name}
                        </p>
                        <p className="mt-1">
                          <span className="text-ink-400">To </span>
                          {pkg.recipient_name}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-sm text-ink-600">
                        {pkg.current_location || '—'}
                      </td>
                      <td className="px-6 py-4 text-sm font-semibold text-ink-900">
                        {formatMoney(pkg.fee, pkg.currency)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col items-start gap-1.5">
                          <PaymentBadge status={pkg.payment_status} />
                          <ClearanceBadge status={pkg.clearance_status} />
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-1.5">
                          <IconAction
                        label="View custody ticket"
                        onClick={() => setTicketFor(pkg)}>
                        
                            <TicketIcon className="h-4 w-4" aria-hidden="true" />
                          </IconAction>
                          <IconAction
                        label="Update location"
                        onClick={() => setRelocating(pkg)}>
                        
                            <MapPinIcon
                          className="h-4 w-4"
                          aria-hidden="true" />
                        
                          </IconAction>
                          <IconAction
                        label="Edit package"
                        onClick={() => {
                          setEditing(pkg);
                          setFormOpen(true);
                          window.scrollTo({ top: 0, behavior: 'smooth' });
                        }}>
                        
                            <PencilIcon
                          className="h-4 w-4"
                          aria-hidden="true" />
                        
                          </IconAction>
                          <IconAction
                        label="Delete package"
                        danger
                        disabled={deletingId === pkg.id}
                        onClick={() => void handleDelete(pkg)}>
                        
                            <Trash2Icon
                          className="h-4 w-4"
                          aria-hidden="true" />
                        
                          </IconAction>
                        </div>
                      </td>
                    </tr>
                )}
                </tbody>
              </table>
            </div>
          }
        </div>
      </main>

      <LocationDialog
        pkg={relocating}
        onClose={() => setRelocating(null)}
        onSaved={upsert} />
      

      {ticketFor ?
      <PackageTicket pkg={ticketFor} onClose={() => setTicketFor(null)} /> :
      null}
    </div>);

}

function IconAction({
  label,
  children,
  onClick,
  danger,
  disabled






}: {label: string;children: React.ReactNode;onClick: () => void;danger?: boolean;disabled?: boolean;}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={
      danger ?
      'rounded-md border border-ink-200 p-2 text-ink-500 transition-colors duration-150 ease-out hover:border-red-300 hover:bg-red-50 hover:text-red-700 disabled:opacity-50' :
      'rounded-md border border-ink-200 p-2 text-ink-500 transition-colors duration-150 ease-out hover:border-gold-400 hover:bg-gold-50 hover:text-gold-700 disabled:opacity-50'
      }>
      
      {children}
    </button>);

}