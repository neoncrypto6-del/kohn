export interface AccreditedRegion {
  region: string;
  countries: string[];
}

/** Jurisdictions where Kohn holds a freight-custodian accreditation. */
export const accreditedRegions: AccreditedRegion[] = [
{
  region: 'North America',
  countries: ['United States', 'Canada', 'Mexico']
},
{
  region: 'Europe',
  countries: [
  'United Kingdom',
  'Germany',
  'France',
  'Netherlands',
  'Belgium',
  'Spain',
  'Italy',
  'Switzerland',
  'Poland',
  'Sweden',
  'Norway',
  'Ireland']

},
{
  region: 'Asia & Middle East',
  countries: [
  'United Arab Emirates',
  'Qatar',
  'Saudi Arabia',
  'Turkey',
  'India',
  'China',
  'Hong Kong SAR',
  'Singapore',
  'Japan',
  'South Korea',
  'Malaysia']

},
{
  region: 'Africa',
  countries: [
  'Nigeria',
  'Ghana',
  'South Africa',
  'Kenya',
  'Egypt',
  'Morocco',
  'Côte d’Ivoire',
  'Tanzania']

},
{
  region: 'Oceania & South America',
  countries: [
  'Australia',
  'New Zealand',
  'Brazil',
  'Argentina',
  'Chile',
  'Colombia']

}];


export const accreditedCountryCount = accreditedRegions.reduce(
  (total, region) => total + region.countries.length,
  0
);