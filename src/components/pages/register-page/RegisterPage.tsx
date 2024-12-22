"use client";

import React, {useContext, useEffect} from 'react';
import Link from "next/link";
import {useRouter} from "next/navigation";
import { UserContext } from '@/utils/hooks/useAuthentication';
import { registerUser } from '@/services/authService';

import "./Register.scss"

const RegisterPage = () => {
	const userContext = useContext(UserContext);
	const [newUser, setNewUser] = React.useState({
		name: "",
		email: "",
		password: "",
	});
	const [showHelperText, setShowHelperText] = React.useState(false);
	const router = useRouter();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setNewUser((prevUser) => ({
			...prevUser,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			for (let field of Object.values(newUser)) {
				if (field === "") {
					setShowHelperText(true);
					return;
				}
			}
			
			await registerUser(newUser);
			
			userContext?.login(document.cookie.split("=")[1])
			setNewUser({
				name: "",
				email: "",
				password: "",
			});
			router.push('/');
		} catch (error) {
			console.error('Registration error:', error);
		}
	};
	
	useEffect(() => {
		setShowHelperText(false)
	}, [newUser]);
	
	return (
		<div className="register-page">
			<h2>Register</h2>
			<form onSubmit={handleSubmit} className="register-form">
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
				<button 
					type="submit"
				>
					Register
				</button>
				{showHelperText && <p className="helper-text">Fields must not be empty</p>}
			</form>
			<div className="navigation">
				<Link href={"/"}>Back to main</Link>
				<Link href={"/login"}>Login</Link>
			</div>
		</div>
	);
};

export default RegisterPage;
