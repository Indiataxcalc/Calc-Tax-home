import React from 'react';

export type LogoOptionId = 1 | 2 | 3;

export interface LogoOptionMeta {
  id: LogoOptionId;
  name: string;
  subtitle: string;
  imagePath: string;
}

export const LOGO_OPTIONS: LogoOptionMeta[] = [
  {
    id: 1,
    name: 'Option 1: Rupee Shield',
    subtitle: 'Teal shield with white ₹ symbol & cobalt blue corner accent',
    imagePath: '/src/assets/images/logo_rupee_shield_1794931423328.jpg',
  },
  {
    id: 2,
    name: 'Option 2: Calculator & Rupee Grid',
    subtitle: 'Rounded teal calculator mark with cobalt blue ₹ bar',
    imagePath: '/src/assets/images/logo_calc_rupee_1794931424402.jpg',
  },
  {
    id: 3,
    name: 'Option 3: TC + Rupee Monogram',
    subtitle: 'Geometric T & C monogram integrated with ₹ crossbar',
    imagePath: '/src/assets/images/logo_monogram_tc_1794931424882.jpg',
  },
];

export function getLogoSvgMarkup(id: LogoOptionId): string {
  if (id === 1) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><path d="M12 10C12 7.79086 13.7909 6 16 6H48C50.2091 6 52 7.79086 52 10V31C52 44.5 39.5 54.5 32 58C24.5 54.5 12 44.5 12 31V10Z" fill="#0F766E"/><path d="M40 6H48C50.2091 6 52 7.79086 52 10V18L40 6Z" fill="#1D4ED8"/><path d="M23 20H41M23 27H41M23 20C31.5 20 35 23.2 35 27C35 31.2 31.2 34.5 24 34.5H23L36 47" stroke="white" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  if (id === 2) {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="4" y="4" width="56" height="56" rx="14" fill="#0F766E"/><rect x="13" y="13" width="24" height="38" rx="4" fill="white"/><rect x="17" y="17" width="16" height="6" rx="1.5" fill="#0F766E"/><rect x="17" y="27" width="4" height="4" rx="1" fill="#0F766E"/><rect x="23" y="27" width="4" height="4" rx="1" fill="#0F766E"/><rect x="29" y="27" width="4" height="4" rx="1" fill="#0F766E"/><rect x="17" y="34" width="4" height="4" rx="1" fill="#0F766E"/><rect x="23" y="34" width="4" height="4" rx="1" fill="#0F766E"/><rect x="29" y="34" width="4" height="4" rx="1" fill="#0F766E"/><rect x="17" y="41" width="10" height="4" rx="1" fill="#0F766E"/><rect x="29" y="41" width="4" height="4" rx="1" fill="#0F766E"/><rect x="40" y="13" width="11" height="38" rx="4" fill="#1D4ED8"/><path d="M42.5 26H48.5M42.5 30H48.5M42.5 26C46 26 47.2 27.5 47.2 30C47.2 32.3 45.8 34 43 34H42.5L48 40" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none"><rect x="4" y="4" width="56" height="56" rx="14" fill="white" stroke="#E2E8F0" stroke-width="2"/><path d="M44 19C40.8 15.8 36.6 14 32 14C22.0589 14 14 22.0589 14 32C14 41.9411 22.0589 50 32 50C36.8 50 41.2 48.1 44.4 44.9" stroke="#1D4ED8" stroke-width="6" stroke-linecap="round"/><path d="M23 22H43M23 29H41M32 22V29C32 33.5 28.5 36.5 23.5 36.5H23L36 48" stroke="#0F766E" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
}

export const BrandLogoMark: React.FC<{ id: LogoOptionId; size?: number; className?: string }> = ({
  id,
  size = 28,
  className = 'shrink-0',
}) => {
  if (id === 1) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <path
          d="M12 10C12 7.79086 13.7909 6 16 6H48C50.2091 6 52 7.79086 52 10V31C52 44.5 39.5 54.5 32 58C24.5 54.5 12 44.5 12 31V10Z"
          fill="#0F766E"
        />
        <path d="M40 6H48C50.2091 6 52 7.79086 52 10V18L40 6Z" fill="#1D4ED8" />
        <path
          d="M23 20H41M23 27H41M23 20C31.5 20 35 23.2 35 27C35 31.2 31.2 34.5 24 34.5H23L36 47"
          stroke="white"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (id === 2) {
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
        <rect x="4" y="4" width="56" height="56" rx="14" fill="#0F766E" />
        <rect x="13" y="13" width="24" height="38" rx="4" fill="white" />
        <rect x="17" y="17" width="16" height="6" rx="1.5" fill="#0F766E" />
        <rect x="17" y="27" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="23" y="27" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="29" y="27" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="17" y="34" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="23" y="34" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="29" y="34" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="17" y="41" width="10" height="4" rx="1" fill="#0F766E" />
        <rect x="29" y="41" width="4" height="4" rx="1" fill="#0F766E" />
        <rect x="40" y="13" width="11" height="38" rx="4" fill="#1D4ED8" />
        <path
          d="M42.5 26H48.5M42.5 30H48.5M42.5 26C46 26 47.2 27.5 47.2 30C47.2 32.3 45.8 34 43 34H42.5L48 40"
          stroke="white"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <rect x="4" y="4" width="56" height="56" rx="14" fill="white" stroke="#E2E8F0" strokeWidth="2" />
      <path
        d="M44 19C40.8 15.8 36.6 14 32 14C22.0589 14 14 22.0589 14 32C14 41.9411 22.0589 50 32 50C36.8 50 41.2 48.1 44.4 44.9"
        stroke="#1D4ED8"
        strokeWidth="6"
        strokeLinecap="round"
      />
      <path
        d="M23 22H43M23 29H41M32 22V29C32 33.5 28.5 36.5 23.5 36.5H23L36 48"
        stroke="#0F766E"
        strokeWidth="4.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
