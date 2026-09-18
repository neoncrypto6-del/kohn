import React, { useMemo, useState } from 'react';
import { Loader2Icon, UploadIcon, XIcon } from 'lucide-react';
import {
  createPackage,
  generateTrackingId,
  updatePackage,
  uploadPackageImage } from
'../../utils/packages';
import { TRANSPORT_MODES, transportLabel } from '../../utils/format';
import type {
  ClearanceStatus,
  PackageInput,
  PackageRecord,
  PaymentStatus,
  TransportMode } from
'../../types/package';

interface PackageFormProps {
  initial?: PackageRecord | null;
  onCancel: () => void;
  onSaved: (pkg: PackageRecord, created: boolean) => void;
}

function emptyForm(): PackageInput {
  return {
    tracking_id: generateTrackingId(),
    owner_id: null,
    btc_address: '',
    btc_qr_url: '',
    name: '',
    description: '',
    image_url: '',
    weight_kg: null,
    sender_name: '',
    sender_address: '',
    sender_email: '',
    sender_phone: '',
    recipient_name: '',
    recipient_address: '',
    recipient_email: '',
    recipient_phone: '',
    current_location: '',
    transport_mode: 'truck',
    payment_status: 'unpaid',
    clearance_status: 'not_cleared',
    fee: 0,
    currency: 'USD'
  };
}

export function PackageForm({ initial, onCancel, onSaved }: PackageFormProps) {
  const [form, setForm] = useState<PackageInput>(() =>
  initial ?
  {
    tracking_id: initial.tracking_id,
    owner_id: initial.owner_id,
    btc_address: initial.btc_address ?? '',
    btc_qr_url: initial.btc_qr_url ?? '',
    name: initial.name,
    description: initial.description ?? '',
    image_url: initial.image_url ?? '',
    weight_kg: initial.weight_kg,
    sender_name: initial.sender_name,
    sender_address: initial.sender_address ?? '',
    sender_email: initial.sender_email ?? '',
    sender_phone: initial.sender_phone ?? '',
    recipient_name: initial.recipient_name,
    recipient_address: initial.recipient_address ?? '',
    recipient_email: initial.recipient_email ?? '',
    recipient_phone: initial.recipient_phone ?? '',
    current_location: initial.current_location ?? '',
    transport_mode: initial.transport_mode,
    payment_status: initial.payment_status,
    clearance_status: initial.clearance_status,
    fee: initial.fee,
    currency: initial.currency
  } :
  emptyForm()
  );
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEdit = useMemo(() => Boolean(initial), [initial]);

  function set<K extends keyof PackageInput>(key: K, value: PackageInput[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function handleUpload(
  file: File,
  field: 'image_url' | 'btc_qr_url')
  {
    setUploading(true);
    setError(null);
    try {
      const url = await uploadPackageImage(
        file,
        field === 'btc_qr_url' ? 'btc-qr' : 'package'
      );
      set(field, url);
    } catch (err) {
      setError(
        err instanceof Error ?
        `Upload failed: ${err.message}` :
        'Upload failed'
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: PackageInput = {
        ...form,
        tracking_id: form.tracking_id.trim().toUpperCase(),
        description: form.description || null,
        image_url: form.image_url || null,
        sender_address: form.sender_address || null,
        sender_email: form.sender_email || null,
        sender_phone: form.sender_phone || null,
        recipient_address: form.recipient_address || null,
        recipient_email: form.recipient_email || null,
        recipient_phone: form.recipient_phone || null,
        current_location: form.current_location || null,
        btc_address: form.btc_address || null,
        btc_qr_url: form.btc_qr_url || null
      };
      const saved = initial ?
      await updatePackage(initial.id, payload) :
      await createPackage(payload);
      onSaved(saved, !initial);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save package');
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-lg border border-ink-200 bg-white">
      
      <div className="flex items-center justify-between gap-4 border-b border-ink-200 px-6 py-5">
        <div>
          <h2 className="font-display text-lg font-bold text-ink-900">
            {isEdit ? 'Edit package' : 'Add new package'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            Tracking ID{' '}
            <span className="font-semibold tracking-wide text-gold-700">
              {form.tracking_id}
            </span>{' '}
            {isEdit ? '' : '· generated automatically'}
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close form"
          className="rounded-md p-1.5 text-ink-400 transition-colors duration-150 ease-out hover:bg-ink-100 hover:text-ink-700">
          
          <XIcon className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>

      <div className="grid gap-8 px-6 py-6 lg:grid-cols-2">
        <Group title="Package">
          <Text
            label="Package name"
            value={form.name}
            onChange={(v) => set('name', v)}
            required />
          
          <Area
            label="Description"
            value={form.description ?? ''}
            onChange={(v) => set('description', v)} />
          
          <div className="grid grid-cols-2 gap-4">
            <Text
              label="Weight (kg)"
              type="number"
              value={form.weight_kg === null ? '' : String(form.weight_kg)}
              onChange={(v) => set('weight_kg', v === '' ? null : Number(v))} />
            
            <Select
              label="Means of transport"
              value={form.transport_mode}
              options={TRANSPORT_MODES.map((mode) => ({
                value: mode,
                label: transportLabel(mode)
              }))}
              onChange={(v) => set('transport_mode', v as TransportMode)} />
            
          </div>
          <Text
            label="Current location"
            value={form.current_location ?? ''}
            onChange={(v) => set('current_location', v)}
            placeholder="Port of Rotterdam — customs hold" />
          

          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
              Package picture
            </span>
            <div className="flex items-start gap-4">
              <div className="h-24 w-32 shrink-0 overflow-hidden rounded-md border border-ink-200 bg-ink-50">
                {form.image_url ?
                <img
                  src={form.image_url}
                  alt="Package preview"
                  className="h-full w-full object-cover" /> :

                null}
              </div>
              <div className="min-w-0 flex-1 space-y-2">
                <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-ink-300 px-3 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
                  {uploading ?
                  <Loader2Icon
                    className="h-4 w-4 animate-spin"
                    aria-hidden="true" /> :


                  <UploadIcon className="h-4 w-4" aria-hidden="true" />
                  }
                  Upload image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(event) => {
                      const file = event.target.files?.[0];
                      if (file) void handleUpload(file, 'image_url');
                    }} />
                  
                </label>
                <input
                  type="url"
                  value={form.image_url ?? ''}
                  onChange={(event) => set('image_url', event.target.value)}
                  placeholder="…or paste an image URL"
                  className="h-10 w-full rounded-md border border-ink-200 px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
                
              </div>
            </div>
          </div>
        </Group>

        <div className="space-y-8">
          <Group title="From (sender)">
            <Text
              label="Name"
              value={form.sender_name}
              onChange={(v) => set('sender_name', v)}
              required />
            
            <Area
              label="Address"
              value={form.sender_address ?? ''}
              onChange={(v) => set('sender_address', v)} />
            
            <div className="grid grid-cols-2 gap-4">
              <Text
                label="Email"
                type="email"
                value={form.sender_email ?? ''}
                onChange={(v) => set('sender_email', v)} />
              
              <Text
                label="Telephone"
                value={form.sender_phone ?? ''}
                onChange={(v) => set('sender_phone', v)} />
              
            </div>
          </Group>

          <Group title="To (recipient)">
            <Text
              label="Name"
              value={form.recipient_name}
              onChange={(v) => set('recipient_name', v)}
              required />
            
            <Area
              label="Address"
              value={form.recipient_address ?? ''}
              onChange={(v) => set('recipient_address', v)} />
            
            <div className="grid grid-cols-2 gap-4">
              <Text
                label="Email"
                type="email"
                value={form.recipient_email ?? ''}
                onChange={(v) => set('recipient_email', v)} />
              
              <Text
                label="Telephone"
                value={form.recipient_phone ?? ''}
                onChange={(v) => set('recipient_phone', v)} />
              
            </div>
          </Group>
        </div>

        <Group title="Fee & clearance" className="lg:col-span-2">
          <div className="grid gap-4 sm:grid-cols-4">
            <Text
              label="Package fee"
              type="number"
              value={String(form.fee)}
              onChange={(v) => set('fee', v === '' ? 0 : Number(v))} />
            
            <Select
              label="Currency"
              value={form.currency}
              options={['USD', 'EUR', 'GBP', 'NGN', 'CAD'].map((code) => ({
                value: code,
                label: code
              }))}
              onChange={(v) => set('currency', v)} />
            
            <Select
              label="Payment status"
              value={form.payment_status}
              options={[
              { value: 'unpaid', label: 'Not paid' },
              { value: 'under_review', label: 'Payment under review' },
              { value: 'paid', label: 'Paid' }]
              }
              onChange={(v) => set('payment_status', v as PaymentStatus)} />
            
            <Select
              label="Clearance"
              value={form.clearance_status}
              options={[
              { value: 'not_cleared', label: 'Not cleared to be delivered' },
              { value: 'cleared', label: 'Cleared to be delivered' }]
              }
              onChange={(v) => set('clearance_status', v as ClearanceStatus)} />
            
          </div>
        </Group>

        <Group title="BTC payment details for this package" className="lg:col-span-2">
          <p className="-mt-1 max-w-2xl text-sm leading-relaxed text-ink-500">
            These are shown to the payer when the card payment on this tracking
            ID fails. They apply to this package only, so each officer can
            publish his own wallet.
          </p>
          <div className="grid gap-6 sm:grid-cols-[minmax(0,1fr)_200px]">
            <div className="space-y-4">
              <Text
                label="BTC wallet address"
                value={form.btc_address ?? ''}
                onChange={(v) => set('btc_address', v)}
                placeholder="bc1q…" />
              
              <input
                type="url"
                value={form.btc_qr_url ?? ''}
                onChange={(event) => set('btc_qr_url', event.target.value)}
                placeholder="…or paste a QR code image URL"
                className={FIELD_CLASS} />
              
              <label className="inline-flex h-10 cursor-pointer items-center gap-2 rounded-md border border-ink-300 px-3 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:border-gold-400 hover:text-gold-700">
                {uploading ?
                <Loader2Icon
                  className="h-4 w-4 animate-spin"
                  aria-hidden="true" /> :


                <UploadIcon className="h-4 w-4" aria-hidden="true" />
                }
                Upload QR code
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    if (file) void handleUpload(file, 'btc_qr_url');
                  }} />
                
              </label>
            </div>
            <div className="h-48 w-48 shrink-0 overflow-hidden rounded-md border border-ink-200 bg-ink-50 p-2">
              {form.btc_qr_url ?
              <img
                src={form.btc_qr_url}
                alt="BTC QR code preview"
                className="h-full w-full object-contain" /> :


              <div className="flex h-full w-full items-center justify-center px-3 text-center text-xs text-ink-400">
                  QR preview
                </div>
              }
            </div>
          </div>
        </Group>
      </div>

      {error ?
      <p className="px-6 pb-2 text-sm text-red-700" role="alert">
          {error}
        </p> :
      null}

      <div className="flex items-center justify-end gap-3 border-t border-ink-200 px-6 py-4">
        <button
          type="button"
          onClick={onCancel}
          className="h-11 rounded-md border border-ink-300 px-5 text-sm font-semibold text-ink-700 transition-colors duration-150 ease-out hover:bg-ink-100">
          
          Cancel
        </button>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex h-11 items-center gap-2 rounded-md bg-gold-500 px-6 font-display text-sm font-bold uppercase tracking-wide text-ink-900 transition-colors duration-150 ease-out hover:bg-gold-400 disabled:cursor-not-allowed disabled:opacity-60">
          
          {saving ?
          <Loader2Icon className="h-4 w-4 animate-spin" aria-hidden="true" /> :
          null}
          {isEdit ? 'Save changes' : 'Create package'}
        </button>
      </div>
    </form>);

}

function Group({
  title,
  children,
  className = ''




}: {title: string;children: React.ReactNode;className?: string;}) {
  return (
    <fieldset className={className}>
      <legend className="mb-4 text-xs font-semibold uppercase tracking-[0.18em] text-gold-600">
        {title}
      </legend>
      <div className="space-y-4">{children}</div>
    </fieldset>);

}

const FIELD_CLASS =
'h-11 w-full rounded-md border border-ink-200 px-3 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30';

function Text({
  label,
  value,
  onChange,
  type = 'text',
  required,
  placeholder







}: {label: string;value: string;onChange: (value: string) => void;type?: string;required?: boolean;placeholder?: string;}) {
  const id = React.useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        
        {label}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={FIELD_CLASS} />
      
    </div>);

}

function Area({
  label,
  value,
  onChange




}: {label: string;value: string;onChange: (value: string) => void;}) {
  const id = React.useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        
        {label}
      </label>
      <textarea
        id={id}
        rows={3}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-md border border-ink-200 px-3 py-2 text-sm text-ink-900 placeholder:text-ink-300 focus:border-gold-500 focus:outline-none focus:ring-2 focus:ring-gold-500/30" />
      
    </div>);

}

function Select({
  label,
  value,
  options,
  onChange





}: {label: string;value: string;options: {value: string;label: string;}[];onChange: (value: string) => void;}) {
  const id = React.useId();
  return (
    <div>
      <label
        htmlFor={id}
        className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-ink-500">
        
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className={`${FIELD_CLASS} bg-white`}>
        
        {options.map((option) =>
        <option key={option.value} value={option.value}>
            {option.label}
          </option>
        )}
      </select>
    </div>);

}