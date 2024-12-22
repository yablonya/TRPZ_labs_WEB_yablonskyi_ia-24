import {LoginData, RegisterData, UserType} from "@/types";

export async function registerUser(newUser: RegisterData) {
	const res = await fetch('http://localhost:8080/api/register', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(newUser),
	});

	if (!res.ok) {
		throw new Error('Registration error');
	}

	return res;
}

export async function loginUser(loginData: LoginData) {
	const res = await fetch('http://localhost:8080/api/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		credentials: 'include',
		body: JSON.stringify(loginData),
	});

	if (!res.ok) {
		throw new Error('Login error');
	}

	return res;
}

export async function logoutUser(): Promise<void> {
	const res = await fetch('http://localhost:8080/api/logout', {
		method: 'POST',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error('Logout error');
	}
}

export async function getUserData(userId: string): Promise<UserType> {
	const res = await fetch(`http://localhost:8080/api/user/${userId}`, {
		method: 'GET',
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error('Error fetching user');
	}
	
	return res.json();
}
