import React from 'react';
import {
  FileTextIcon,
  LockKeyholeIcon,
  PlaneIcon,
  ShieldIcon,
  ShipIcon,
  TruckIcon } from
'lucide-react';
import { services } from '../../data/services';
import type { Service } from '../../data/services';

const ICONS: Record<Service['icon'], typeof ShipIcon> = {
  ship: ShipIcon,
  plane: PlaneIcon,
  truck: TruckIcon,
  vault: LockKeyholeIcon,
  file: FileTextIcon,
  shield: ShieldIcon
};

export function ServicesSection() {
  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="scroll-mt-24 border-t border-ink-200 bg-white">
      
      <div className="mx-auto w-full max-w-7xl px-6 py-16 lg:py-24">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-600">
            Our services
          </p>
          <h2
            id="services-heading"
            className="mt-4 font-display text-3xl font-extrabold leading-tight tracking-tight text-ink-900 sm:text-4xl">
            
            Six disciplines, one chain of custody
          </h2>
          <p className="mt-4 text-base leading-relaxed text-ink-600">
            Most losses do not happen in transit — they happen at handovers,
            in paperwork, and in storage between legs. We staff every one of
            those points ourselves, which is why a single tracking ID follows
            your consignment from the moment we take it until it is released.
          </p>
        </div>

        <ul className="mt-12 divide-y divide-ink-200 border-y border-ink-200">
          {services.map((service) => {
            const Icon = ICONS[service.icon];
            return (
              <li
                key={service.id}
                className="grid gap-6 py-8 md:grid-cols-[minmax(0,5fr)_minmax(0,4fr)] md:gap-12">
                
                <div className="flex gap-4">
                  <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-gold-50 text-gold-700">
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <h3 className="font-display text-lg font-bold text-ink-900">
                      {service.title}
                    </h3>
                    <p className="mt-2 text-sm leading-relaxed text-ink-600">
                      {service.summary}
                    </p>
                  </div>
                </div>
                <ul className="space-y-2 md:pt-1">
                  {service.details.map((detail) =>
                  <li
                    key={detail}
                    className="flex gap-3 text-sm text-ink-600">
                    
                      <span
                      className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                      aria-hidden="true" />
                    
                      {detail}
                    </li>
                  )}
                </ul>
              </li>);

          })}
        </ul>
      </div>
    </section>);

}