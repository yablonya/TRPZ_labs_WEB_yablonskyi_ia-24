"use client";

import React from 'react';
import Link from "next/link";

const RegisterPage = () => {
	const [newUser, setNewUser] = React.useState({
		name: "",
		email: "",
		password: "",
	});

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setNewUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault(); 
		console.log(newUser);
		setNewUser({
			name: "",
			email: "",
			password: "",
		});
	};
	
	return (
		<div>
			<Link href={"/"}>Back to main</Link>
			<p>Register</p>
			<form onSubmit={handleSubmit}>
				<input 
					type="text"
					name="name"
					placeholder="Name"
					value={newUser.name}
					onChange={handleInputChange}
				/>
				<input 
					type="email"
					name="email"
					placeholder="Email"
					value={newUser.email}
					onChange={handleInputChange}
				/>
				<input 
					type="password"
					name="password"
					placeholder="Password"
					value={newUser.password}
					onChange={handleInputChange}
				/>
				<input 
					type="submit" 
					value="Register" 
				/>
			</form>
			<Link href={"/login"}>Login</Link>
		</div>
	);
};

export default RegisterPage;
