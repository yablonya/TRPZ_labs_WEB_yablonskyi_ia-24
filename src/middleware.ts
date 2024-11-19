// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
	// Отримуємо значення кукі з запиту
	const cookie = request.cookies.get('user');

	// Якщо кукі відсутня, перенаправляємо користувача на сторінку входу
	if (!cookie) {
		return NextResponse.redirect(new URL('/login', request.url));
	}

	// Якщо кукі присутня, пропускаємо запит далі
	return NextResponse.next();
}

// Визначаємо маршрути, до яких застосовується Middleware
export const config = {
	matcher: ['/'],
};

