import { supabase, PACKAGE_IMAGE_BUCKET } from './supabase';
import type { PackageInput, PackagePatch, PackageRecord } from '../types/package';

const TABLE = 'packages';

export function normalizeTrackingId(value: string): string {
  return value.trim().toUpperCase();
}

export function generateTrackingId(): string {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let suffix = '';
  for (let i = 0; i < 8; i += 1) {
    suffix += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  const year = new Date().getFullYear().toString().slice(-2);
  return `KST-${year}-${suffix}`;
}

export async function fetchPackageByTracking(
trackingId: string)
: Promise<PackageRecord | null> {
  const { data, error } = await supabase.
  from(TABLE).
  select('*').
  eq('tracking_id', normalizeTrackingId(trackingId)).
  maybeSingle();

  if (error) throw new Error(error.message);
  return data as PackageRecord | null ?? null;
}

/** Only the packages registered by the signed-in admin. */
export async function listMyPackages(): Promise<PackageRecord[]> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('You are no longer signed in.');

  const { data, error } = await supabase.
  from(TABLE).
  select('*').
  eq('owner_id', userId).
  order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data as PackageRecord[] ?? [];
}

export async function createPackage(
input: PackageInput)
: Promise<PackageRecord> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('You are no longer signed in.');

  const { data, error } = await supabase.
  from(TABLE).
  insert({ ...input, owner_id: userId }).
  select('*').
  single();

  if (error) throw new Error(error.message);
  return data as PackageRecord;
}

export async function updatePackage(
id: string,
patch: PackagePatch)
: Promise<PackageRecord> {
  const { data, error } = await supabase.
  from(TABLE).
  update(patch).
  eq('id', id).
  select('*').
  single();

  if (error) throw new Error(error.message);
  return data as PackageRecord;
}

export async function deletePackage(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw new Error(error.message);
}

/**
 * Public payment submission. Runs through a SECURITY DEFINER function so a
 * visitor can flag a transfer for review without being able to edit anything.
 */
export async function submitPackagePayment(trackingId: string): Promise<void> {
  const { error } = await supabase.rpc('submit_package_payment', {
    p_tracking_id: normalizeTrackingId(trackingId)
  });
  if (error) throw new Error(error.message);
}

export async function uploadPackageImage(
file: File,
prefix = 'package')
: Promise<string> {
  const extension = file.name.split('.').pop() ?? 'jpg';
  const path = `${prefix}/${Date.now()}-${Math.random().
  toString(36).
  slice(2, 8)}.${extension}`;

  const { error } = await supabase.storage.
  from(PACKAGE_IMAGE_BUCKET).
  upload(path, file, { cacheControl: '3600', upsert: false });

  if (error) throw new Error(error.message);

  const { data } = supabase.storage.from(PACKAGE_IMAGE_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}