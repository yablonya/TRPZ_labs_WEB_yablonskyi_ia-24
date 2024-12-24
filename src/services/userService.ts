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

export async function updateUser(user: UserType) {
	const res = await fetch('http://localhost:8080/api/user/update', {
		method: 'PUT',
		credentials: 'include',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({
			name: user.name,
			email: user.email,
			password: user.password,
		}),
	});

	if (!res.ok) {
		throw new Error('Failed to update user');
	}

	return res.json();
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

export async function deleteUser(): Promise<void> {
	const response = await fetch('http://localhost:8080/api/user/delete', {
		method: 'DELETE',
		credentials: 'include',
	});

	if (!response.ok) {
		throw new Error('Failed to delete user');
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
