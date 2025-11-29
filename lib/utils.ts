"use client";

import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const generateRandomCode = (length: number) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters[randomIndex];
    }
    return result;
};

export const timeAgoSmall = (timestamp) => {
    const now = new Date();
    const past = new Date(timestamp);
    const diffInMs = now.getTime() - past.getTime();
    const diffInMinutes = Math.floor(diffInMs / 60000);
    const diffInHours = Math.floor(diffInMs / 3600000);
    const diffInDays = Math.floor(diffInMs / 86400000);

    if (diffInMinutes < 1) {
        return 'now'
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes}m`
    } else if (diffInHours < 24) {
        return `${diffInHours}h`
    } else if (diffInDays) {
        return `${diffInDays}d`
    }
};

export const timeAgo = (dateString) => {
    if (!dateString) return '';
    const now = new Date();
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    const diff = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diff < 45) return 'just now';
    if (diff < 90) return '1m';
    const minutes = Math.floor(diff / 60);
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(diff / 3600);
    if (hours < 24) return `${hours}h`;
    const days = Math.floor(diff / 86400);
    if (days < 7) return `${days}d`;
    const weeks = Math.floor(days / 7);
    if (weeks < 4) return `${weeks}w`;
    const months = Math.floor(days / 30.44);
    if (months < 12) return `${months}m`;
    const years = Math.floor(days / 365.25);
    return `${years}y`;
};

export const generateRandomDarkColor = () => {
    const darkColors = [
        ['#1a365d', '#2c5282', '#2b6cb0'],
        ['#742a2a', '#9b2c2c', '#c53030'],
        ['#553c9a', '#6b46c1', '#7c3aed'],
        ['#22543d', '#276749', '#38a169'],
        ['#7b341e', '#9c4221', '#c05621'],
        ['#234e52', '#2c7a7b', '#319795'],
        ['#44337a', '#6b46c1', '#b794f4'],
        ['#744210', '#b7791f', '#f6ad55'],
    ];
    const palette = darkColors.flat();
    return palette[Math.floor(Math.random() * palette.length)];
};

export const generateRandomLightColor = () => {
    const lightColors = [
        ['#90cdf4', '#bee3f8', '#e9d8fd'],
        ['#feb2b2', '#fbd38d', '#f6e05e'],
        ['#c6f6d5', '#b2f5ea', '#e6fffa'],
        ['#fbb6ce', '#ee9ca7', '#ffecd2'],
        ['#f6ad55', '#faf089', '#ffe082'],
        ['#b2f5ea', '#81e6d9', '#81d4fa'],
        ['#d6bcfa', '#e9d8fd', '#f3e8ff'],
        ['#ffe29a', '#fff8dc', '#fdf6b2'],
    ];
    const palette = lightColors.flat();
    return palette[Math.floor(Math.random() * palette.length)];
};

export const generateRandomColorPair = () => {
    const colorPairs = [
        {
            dark: '#2b6cb0',
            light: '#bee3f8',
        },
        {
            dark: '#c53030',
            light: '#feb2b2',
        },
        {
            dark: '#38a169',
            light: '#c6f6d5',
        },
        {
            dark: '#6b46c1',
            light: '#e9d8fd',
        },
        {
            dark: '#b7791f',
            light: '#faf089',
        },
        {
            dark: '#2c7a7b',
            light: '#b2f5ea',
        },
        {
            dark: '#9c4221',
            light: '#fbd38d',
        },
        {
            dark: '#44337a',
            light: '#d6bcfa',
        },
        {
            dark: '#744210',
            light: '#ffe29a',
        },
        {
            dark: '#553c9a',
            light: '#f3e8ff',
        },
        {
            dark: '#22543d',
            light: '#e6fffa',
        },
    ];

    const idx = Math.floor(Math.random() * colorPairs.length);
    return colorPairs[idx];
};

export const shallowEqual = (obj1, obj2) => {
    if (obj1 === obj2) {
      return true;
    }
    if (obj1 === null || obj2 === null ||
      (typeof obj1 !== 'object' && typeof obj2 !== 'object')) {
      return false;
    }
    const isArray1 = Array.isArray(obj1);
    const isArray2 = Array.isArray(obj2);
    if (isArray1 !== isArray2) {
      return false;
    }
    if (isArray1) {
      if (obj1.length !== obj2.length) {
        return false;
      }
      for (let i = 0; i < obj1.length; i++) {
        if (!shallowEqual(obj1[i], obj2[i])) {
          return false;
        }
      }
      return true;
    }
    const keys1 = Object.keys(obj1);
    const keys2 = Object.keys(obj2);
    if (keys1.length !== keys2.length) {
      return false;
    }
    for (const key of keys1) {
      if (!obj2.hasOwnProperty(key)) {
        return false;
      }
      if (!shallowEqual(obj1[key], obj2[key])) {
        return false;
      }
    }
    return true;
};

export type ResolvedUserLocation = {
    locationTitle: string;
    coordinates: string;
    latitude?: number;
    longitude?: number;
};

const getBrowserLocation = () =>
    new Promise<GeolocationPosition | null>((resolve) => {
        if (typeof window === 'undefined' || !navigator?.geolocation) {
            resolve(null);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            (position) => resolve(position),
            (error) => {
                console.warn('Unable to fetch geolocation', error);
                resolve(null);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 5 * 60 * 1000
            }
        );
});

const reverseGeocode = async (latitude: number, longitude: number) => {
    try {
        const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`,
            {
                headers: {
                    'Accept-Language': 'en',
                    'User-Agent': 'samedays-app/1.0'
                }
            }
        );

        if (!response.ok) {
            throw new Error(`Reverse geocode failed with status ${response.status}`);
        }

        const data = await response.json();
        const { address, display_name } = data || {};

        if (display_name) return display_name as string;

        const parts = [
            address?.city || address?.town || address?.village,
            address?.state,
            address?.country
        ].filter(Boolean);

        return parts.join(', ');
    } catch (error) {
        console.warn('Unable to reverse geocode coordinates', error);
        return '';
    }
};

export const detectUserLocation = async (): Promise<ResolvedUserLocation> => {
    let locationTitle = '';
    let coordinates = '';
    let latitude: number | undefined;
    let longitude: number | undefined;

    try {
        const position = await getBrowserLocation();

        if (position?.coords) {
            ({ latitude, longitude } = position.coords);
            coordinates = `${latitude},${longitude}`;
            locationTitle = await reverseGeocode(latitude, longitude);
        }
    } catch (error) {
        console.warn('Failed to resolve user location', error);
    }

    return {
        locationTitle,
        coordinates,
        latitude,
        longitude
    };
};