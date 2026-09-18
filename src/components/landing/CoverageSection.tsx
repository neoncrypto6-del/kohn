import React from 'react';
import { accreditedCountryCount, accreditedRegions } from '../../data/countries';

export function CoverageSection() {
  return (
    <section
      id="coverage"
      aria-labelledby="coverage-heading"
      className="scroll-mt-24 border-t border-ink-200 bg-ink-50">
      
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
              Accreditation
            </p>
            <h2
              id="coverage-heading"
              className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
              
              Accredited to take custody in {accreditedCountryCount} countries
            </h2>
            <p className="mt-4 text-base leading-relaxed text-ink-600">
              Each jurisdiction below has issued us a freight-custodian or
              bonded-carrier accreditation, which is what allows a single
              tracking ID to stay valid as your consignment crosses borders.
              Movements to unlisted countries are handled through an accredited
              partner on request.
            </p>
          </div>

          <div className="grid gap-x-10 gap-y-8 sm:grid-cols-2">
            {accreditedRegions.map((region) =>
            <div key={region.region}>
                <h3 className="border-b border-ink-200 pb-2 font-display text-sm font-bold uppercase tracking-wide text-ink-900">
                  {region.region}
                </h3>
                <ul className="mt-3 space-y-1.5">
                  {region.countries.map((country) =>
                <li
                  key={country}
                  className="flex gap-2.5 text-sm text-ink-600">
                  
                      <span
                    className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                    aria-hidden="true" />
                  
                      {country}
                    </li>
                )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>);

}