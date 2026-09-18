import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Loader2Icon, MapPinIcon, XIcon } from 'lucide-react';
import { updatePackage } from '../../utils/packages';
import type { PackageRecord } from '../../types/package';

interface LocationDialogProps {
  pkg: PackageRecord | null;
  onClose: () => void;
  onSaved: (pkg: PackageRecord) => void;
}

export function LocationDialog({ pkg, onClose, onSaved }: LocationDialogProps) {
  const [value, setValue] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!pkg) return;
    setSaving(true);
    setError(null);
    try {
      const saved = await updatePackage(pkg.id, { current_location: value });
      onSaved(saved);
      setValue('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not update location');
    } finally {
      setSaving(false);
    }
  }

  return (
    <AnimatePresence>
      {pkg ?
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/70 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        role="dialog"
        aria-modal="true"
        aria-label="Update current location">
        
          <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md rounded-lg bg-white p-6 shadow-2xl"
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.98, y: 4 }}
          transition={{ duration: 0.22, ease: [0.23, 1, 0.32, 1] }}>
          
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="font-display text-lg font-bold text-ink-900">
                  Update current location
                </h2>
                <p className="mt-1 text-sm text-ink-500">{pkg.tracking_id}</p>
              </div>
              <button
              type="button"
              onClick={onClose}
              aria-label="Close"
              className="rounded-md p-1.5 text-ink-400 transition-colors duration-150 ease-out hover:bg-ink-100 hover:text-ink-700">
              
                <XIcon className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            <p className="mt-5 flex items-center gap-2 rounded-md bg-ink-50 px-3 py-2 text-sm text-ink-600">
              <MapPinIcon
              className="h-4 w-4 shrink-0 text-ink-400"
              aria-hidden="true" />
            
              Now: {pkg.current_location || 'No location recorded'}
            </p>

            <label
            htmlFor="new-location"
            className="mb-1.5 mt-5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
            
              New location
            </label>
            <input
            id="new-location"
            required
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="JFK cargo terminal — outbound"
            className="h-11 w-full rounded-md border border-ink-200 px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
          

            {error ?
          <p className="mt-3 text-sm text-red-700" role="alert">
                {error}
              </p> :
          null}

            <button
            type="submit"
            disabled={saving}
            className="mt-6 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-gold-500 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60">
            
              {saving ?
            <Loader2Icon
              className="h-4 w-4 animate-spin"
              aria-hidden="true" /> :

            null}
              Save location
            </button>
          </motion.form>
        </motion.div> :
      null}
    </AnimatePresence>);

}