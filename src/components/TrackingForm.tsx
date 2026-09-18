import React, { useState } from 'react';
import { Loader2Icon, SearchIcon } from 'lucide-react';

interface TrackingFormProps {
  initialValue?: string;
  loading: boolean;
  onSearch: (trackingId: string) => void;
}

export function TrackingForm({
  initialValue = '',
  loading,
  onSearch
}: TrackingFormProps) {
  const [value, setValue] = useState(initialValue);

  return (
    <form
      className="w-full"
      onSubmit={(event) => {
        event.preventDefault();
        if (!value.trim() || loading) return;
        onSearch(value);
      }}>
      
      <label
        htmlFor="tracking-id"
        className="mb-2 block text-xs font-semibold uppercase tracking-[0.18em] text-gold-300">
        
        Tracking ID
      </label>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          id="tracking-id"
          name="tracking-id"
          type="text"
          autoComplete="off"
          spellCheck={false}
          placeholder="e.g. KST-26-7QH4M2XP"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          className="h-14 flex-1 rounded-md border border-white/15 bg-white/5 px-4 font-medium uppercase tracking-wide text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-400 focus:border-gold-400 focus:outline-none focus:ring-2 focus:ring-gold-500/40" />
        
        <button
          type="submit"
          disabled={loading || !value.trim()}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md bg-gold-500 px-7 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-50">
          
          {loading ?
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> :

          <SearchIcon className="h-4 w-4" aria-hidden="true" />
          }
          Track package
        </button>
      </div>
    </form>);

}