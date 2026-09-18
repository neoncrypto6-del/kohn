export type TransportMode = 'ship' | 'airplane' | 'truck' | 'fedex' | 'usps';

export type PaymentStatus = 'paid' | 'unpaid' | 'under_review';

export type ClearanceStatus = 'cleared' | 'not_cleared';

export interface PackageRecord {
  id: string;
  tracking_id: string;
  owner_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  weight_kg: number | null;
  sender_name: string;
  sender_address: string | null;
  sender_email: string | null;
  sender_phone: string | null;
  recipient_name: string;
  recipient_address: string | null;
  recipient_email: string | null;
  recipient_phone: string | null;
  current_location: string | null;
  transport_mode: TransportMode;
  payment_status: PaymentStatus;
  clearance_status: ClearanceStatus;
  fee: number;
  currency: string;
  btc_address: string | null;
  btc_qr_url: string | null;
  created_at: string;
  updated_at: string;
}

export type PackageInput = Omit<
  PackageRecord,
  'id' | 'created_at' | 'updated_at'>;


export type PackagePatch = Partial<PackageInput>;