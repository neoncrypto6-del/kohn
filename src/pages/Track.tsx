import React, { useCallback, useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { AlertCircleIcon, ArrowLeftIcon } from 'lucide-react';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { TrackingForm } from '../components/TrackingForm';
import { RouteProgress } from '../components/RouteProgress';
import { PackageResult } from '../components/PackageResult';
import { fetchPackageByTracking } from '../utils/packages';
import type { PackageRecord } from '../types/package';

export function Track() {
  const { trackingId } = useParams<{trackingId: string;}>();
  const navigate = useNavigate();

  const [pkg, setPkg] = useState<PackageRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (value: string) => {
    setLoading(true);
    setError(null);
    try {
      const record = await fetchPackageByTracking(value);
      setPkg(record);
      if (!record) {
        setError(
          `No shipment found for “${value.trim().toUpperCase()}”. Check the ID on your custody receipt and try again.`
        );
      }
    } catch (err) {
      setPkg(null);
      setError(
        err instanceof Error ?
        err.message :
        'Unable to reach the tracking service.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (trackingId) void lookup(trackingId);
  }, [trackingId, lookup]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-50">
      <div className="bg-ink-900">
        <SiteHeader showNav navBase="/" />
        <div className="mx-auto w-full max-w-7xl px-6 pb-10 pt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-ink-300 transition-colors duration-150 ease-out hover:text-gold-300">
            
            <ArrowLeftIcon className="h-4 w-4" aria-hidden="true" />
            Back to home
          </Link>
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight text-white">
            Shipment record
          </h1>
          <div className="mt-6 max-w-2xl">
            <TrackingForm
              initialValue={trackingId ?? ''}
              loading={loading}
              onSearch={(value) => {
                const next = value.trim().toUpperCase();
                if (next === (trackingId ?? '').toUpperCase()) {
                  void lookup(next);
                } else {
                  navigate(`/track/${encodeURIComponent(next)}`);
                }
              }} />
            
          </div>
        </div>
      </div>

      <main className="mx-auto w-full max-w-7xl flex-1 px-6 py-10 lg:py-14">
        {loading ?
        <div className="animate-pulse space-y-4">
            <div className="h-48 rounded-lg bg-white" />
            <div className="h-80 rounded-lg bg-white" />
          </div> :
        null}

        {!loading && error ?
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-5">
          
            <AlertCircleIcon
            className="mt-0.5 h-5 w-5 shrink-0 text-red-700"
            aria-hidden="true" />
          
            <div>
              <p className="font-semibold text-red-900">Shipment not shown</p>
              <p className="mt-1 text-sm text-red-800">{error}</p>
            </div>
          </div> :
        null}

        {!loading && pkg ?
        <div className="space-y-6">
            <RouteProgress pkg={pkg} />
            <PackageResult pkg={pkg} />
          </div> :
        null}
      </main>

      <SiteFooter navBase="/" />
    </div>);

}