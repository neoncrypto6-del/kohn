export interface Service {
  id: string;
  title: string;
  summary: string;
  details: string[];
  icon: 'ship' | 'plane' | 'truck' | 'vault' | 'file' | 'shield';
}

export const services: Service[] = [
{
  id: 'sea-freight',
  title: 'Sea freight & container custody',
  summary:
  'Full-container and consolidated loads moved across 40+ ports, with our own officers present at each seal and unseal.',
  details: [
  'Sealed-container custody with tamper evidence',
  'Bonded warehousing at origin and destination ports',
  'Marine insurance arranged on declared value'],

  icon: 'ship'
},
{
  id: 'air-freight',
  title: 'Air freight & time-critical cargo',
  summary:
  'Next-flight-out handling for consignments where a day of delay costs more than the freight itself.',
  details: [
  'Known-shipper screening and dangerous-goods paperwork',
  'Temperature and shock monitoring on request',
  'Airside escort for high-value pallets'],

  icon: 'plane'
},
{
  id: 'road-courier',
  title: 'Road freight & last-mile courier',
  summary:
  'Our own fleet for trunking, with FedEx and USPS integration for the final leg to residential addresses.',
  details: [
  'Two-officer crews on high-value routes',
  'FedEx and USPS handover with signature capture',
  'Live location updates at every custody change'],

  icon: 'truck'
},
{
  id: 'valuables',
  title: 'High-value & sensitive consignments',
  summary:
  'Bullion, documents, pharmaceuticals, prototypes and personal effects handled under a chain-of-custody log.',
  details: [
  'Vaulted storage between transport legs',
  'Dual-control access with photographic evidence',
  'Discreet, unbranded vehicles where required'],

  icon: 'vault'
},
{
  id: 'customs',
  title: 'Customs clearance & documentation',
  summary:
  'We prepare, file and defend the paperwork so a consignment is not held for something avoidable.',
  details: [
  'Import duty and levy assessment before departure',
  'Broker representation at inspection',
  'Clearance release confirmed in your tracking record'],

  icon: 'file'
},
{
  id: 'escort',
  title: 'Security escort & risk assessment',
  summary:
  'Route surveys, escort crews and contingency planning for cargo moving through higher-risk corridors.',
  details: [
  'Pre-movement route and threat assessment',
  'Armoured escort and convoy coordination',
  '24/7 control room monitoring while in motion'],

  icon: 'shield'
}];