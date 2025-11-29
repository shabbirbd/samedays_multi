import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET;

const protectedPaths = [
    '/app',
    '/inbox',
    '/copilot',
    '/knowledge',
    '/reports',
    '/contacts',
    '/settings/general',
    '/settings/teammates',
    '/settings/billing',
    '/settings/messenger',
    '/avatar/video_library',
    '/avatar/conversation_library',
    '/avatar/replica_library',
    '/avatar/video_generation',
    '/avatar/create_conversation',
    '/avatar/create_replica',
    '/test'
];


const signInPath = '/api/auth/signin';

if (!NEXTAUTH_SECRET) {
    console.warn("WARNING: NEXTAUTH_SECRET environment variable is not set. Authentication checks in middleware will not work correctly in production.");
}

export async function middleware(request: NextRequest) {
    const url = request.nextUrl;
    const hostname = request.headers.get('host')!;
    const pathname = url.pathname;


    if (
        pathname.startsWith('/_next') ||
        pathname.startsWith('/api/') ||
        /\.(.*)$/.test(pathname)
    ) {
        return NextResponse.next();
    }

    const isProtectedPath = protectedPaths.some(prefix => pathname.startsWith(prefix));

    if (isProtectedPath) {
        const token = await getToken({ req: request, secret: NEXTAUTH_SECRET });

        if (!token) {
            const redirectUrl = new URL(signInPath, request.url);
            redirectUrl.searchParams.set('callbackUrl', url.pathname + url.search);
            return NextResponse.redirect(redirectUrl);
        }
        return NextResponse.next();

    } else {
        return NextResponse.next();
    }

}

export const config = {
    matcher: [
        '/((?!api/|_next/static|_next/image|favicon.ico|static/).*)',
    ],
};