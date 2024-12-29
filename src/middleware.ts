import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	const cookie = request.cookies.get('userId');

	if (!cookie || (cookie?.value === "null") || (cookie?.value === '')) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	return NextResponse.next();
}

export const config = {
	matcher: ['/'],
};
