import React from 'react';

const ABOUT_IMAGE = "/0cbf51fd-8a5a-4576-84a2-a2c406d4a514.jpg";


const FACTS = [
{ value: '18 yrs', label: 'Operating as a bonded freight custodian' },
{ value: '40+', label: 'Ports, airports and depots covered' },
{ value: '99.4%', label: 'Consignments released without a claim' },
{ value: '24/7', label: 'Control room monitoring in motion' }];


export function AboutSection() {
  return (
    <section
      id="about"
      aria-labelledby="about-heading"
      className="scroll-mt-24 bg-ink-900">
      
      <div className="mx-auto grid w-full max-w-7xl gap-12 px-6 py-16 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:items-center lg:py-24">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">
            About us
          </p>
          <h2
            id="about-heading"
            className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl">
            
            We are custodians first, carriers second
          </h2>
          <div className="mt-5 space-y-4 text-base leading-relaxed text-ink-200">
            <p>
              Kohn Security &amp; Transportation was founded by former port
              security and customs officers who kept seeing the same thing:
              cargo insured to the penny, but nobody accountable for it between
              the quay and the door. We built the company the other way round —
              accountability first, then the trucks, vessels and aircraft to
              honour it.
            </p>
            <p>
              Every consignment we accept is weighed, photographed and
              registered to a named officer. Its location is updated at each
              custody handover, its duties and fees are assessed before it
              moves, and it is only marked cleared for delivery once payment
              and documentation both check out. Nothing about that process is
              hidden from you: it is the same record you see when you enter
              your tracking ID.
            </p>
          </div>

          <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6 border-t border-white/10 pt-8 sm:grid-cols-4">
            {FACTS.map((fact) =>
            <div key={fact.label}>
                <dt className="font-display text-2xl font-extrabold text-gold-400">
                  {fact.value}
                </dt>
                <dd className="mt-1 text-xs leading-relaxed text-ink-300">
                  {fact.label}
                </dd>
              </div>
            )}
          </dl>
        </div>

        <img
          src={ABOUT_IMAGE}
          alt="A Kohn operations officer logging crated cargo in a secure warehouse"
          className="aspect-[4/3] w-full rounded-lg object-cover" />
        
      </div>
    </section>);

}