import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export async function GET() {
    const headersList = await headers();
    let colorScheme = 'light';
    const prefersColorScheme = headersList.get('sec-ch-prefers-color-scheme') || headersList.get('x-color-scheme');
    if (prefersColorScheme) {
        if (prefersColorScheme.toLowerCase().includes('dark')) {
            colorScheme = 'dark';
        }
    }
    const lightThemeColor = '#F0F0ED';
    const darkThemeColor = '#060606';

    const background_color = colorScheme === 'dark' ? darkThemeColor : lightThemeColor;
    const theme_color = colorScheme === 'dark' ? darkThemeColor : lightThemeColor;
    const icon = colorScheme === 'dark' ? '/logos/same_fav.png' : '/logos/same_fav.png';

    const manifest = {
        name: "Samedays",
        short_name: 'samedays.com',
        display: 'standalone',
        id: '/?source=pwa', 
        start_url: "/",
        scope: "/",
        background_color,
        theme_color,
        display_override: ["fullscreen", "minimal-ui"],
        icons: [
            {
                src: icon, 
                sizes: "16x16",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "32x32",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "48x48",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "72x72",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "96x96",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "144x144",
                type: "image/png"
            },
            {
                src: icon,
                sizes: "168x168",
                type: "image/png"
            },
            {
                src: '/logos/same_fav.svg',
                sizes: "192x192",
                type: "image/svg+xml",
                purpose: "any maskable"
            },
            {
                src: '/logos/same_fav.svg',
                sizes: "512x512",
                type: "image/svg+xml",
                purpose: "any maskable"
            }
        ]
    };

    // Return the manifest as JSON
    return new NextResponse(JSON.stringify(manifest), {
        status: 200,
        headers: {
            'Content-Type': 'application/manifest+json',
            'Cache-Control': 'public, max-age=0, must-revalidate',
        }
    });
}