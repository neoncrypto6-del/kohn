import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SiteHeader } from '../components/SiteHeader';
import { SiteFooter } from '../components/SiteFooter';
import { TrackingForm } from '../components/TrackingForm';
import { ServicesSection } from '../components/landing/ServicesSection';
import { AboutSection } from '../components/landing/AboutSection';
import { CoverageSection } from '../components/landing/CoverageSection';
import { ContactSection } from '../components/landing/ContactSection';

const HERO_IMAGE = "/9479e19d-7c91-49bf-aa2e-6bf00612e23d.jpg";

const CONVOY_IMAGE = "/f3f2ab02-bdba-4baa-9e70-263135822c84.jpg";


const STEPS = [
{
  title: 'Registration & custody',
  body: 'An operations officer weighs and photographs your package, records both parties, and issues a KST tracking ID. That ID is the only reference you need from then on.'
},
{
  title: 'Movement & handovers',
  body: 'Location is re-recorded at every custody change — vessel loading, airside transfer, depot, FedEx or USPS handover — so the tracking record always reflects physical reality.'
},
{
  title: 'Fees & clearance',
  body: 'Duties and handling fees are assessed and shown on your tracking record. Once settled, our clearance desk reviews documentation and marks the consignment cleared to be delivered.'
},
{
  title: 'Release & proof',
  body: 'Final delivery is signed for and logged against the same tracking ID, with photographic proof retained for 24 months in case of a later dispute.'
}];


export function Landing() {
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen w-full flex-col bg-ink-50">
      <div className="relative bg-ink-900">
        <img
          src={HERO_IMAGE}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 h-full w-full object-cover opacity-45" />
        
        <div className="absolute inset-0 bg-ink-900/75" aria-hidden="true" />
        <div className="relative">
          <SiteHeader showNav />

          <div className="mx-auto w-full max-w-7xl px-6 pb-16 pt-14 lg:pb-24 lg:pt-20">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
                Secured freight &amp; custody tracking
              </p>
              <h1 className="mt-4 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-white sm:text-5xl lg:text-6xl">
                Know exactly where your consignment is —
                <span className="text-gold-400"> and what it needs next.</span>
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-200">
                Kohn Security &amp; Transportation moves sealed, high-value and
                time-critical cargo by sea, air and road. Enter the tracking ID
                issued when your package was registered to see its declared
                contents, custody details, current location, transport mode, and
                any fee still blocking delivery clearance.
              </p>

              <div
                id="track"
                className="mt-9 max-w-2xl scroll-mt-24 rounded-lg border border-white/10 bg-ink-900/60 p-5 backdrop-blur-sm sm:p-6">
                
                <TrackingForm
                  loading={false}
                  onSearch={(value) =>
                  navigate(
                    `/track/${encodeURIComponent(value.trim().toUpperCase())}`
                  )
                  } />
                
                <p className="mt-3 text-xs text-ink-300">
                  Tracking IDs look like <span className="font-semibold text-gold-300">KST-26-7QH4M2XP</span> and are
                  printed on your custody receipt.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section
          aria-labelledby="how-heading"
          className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-20">
          
          <div className="grid gap-12 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
                How it works
              </p>
              <h2
                id="how-heading"
                className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900">
                
                Four stages, all visible to you
              </h2>
              <p className="mt-4 text-base leading-relaxed text-ink-600">
                Nothing in our process happens off the record. Each stage writes
                to the same tracking entry, so what you see is what our officers
                see.
              </p>
              <img
                src={CONVOY_IMAGE}
                alt="A Kohn escort vehicle accompanying a freight truck at dawn"
                className="mt-8 hidden aspect-[3/2] w-full rounded-lg object-cover lg:block" />
              
            </div>

            <ol className="divide-y divide-ink-200 border-y border-ink-200">
              {STEPS.map((step, index) =>
              <li key={step.title} className="flex gap-6 py-6">
                  <span className="font-display text-sm font-bold text-gold-600">
                    0{index + 1}
                  </span>
                  <div>
                    <h3 className="font-display text-base font-bold text-ink-900">
                      {step.title}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-ink-600">
                      {step.body}
                    </p>
                  </div>
                </li>
              )}
            </ol>
          </div>
        </section>

        <ServicesSection />
        <AboutSection />
        <CoverageSection />
        <ContactSection />
      </main>

      <SiteFooter />
    </div>);

}