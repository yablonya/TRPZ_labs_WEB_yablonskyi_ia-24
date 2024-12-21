"use client";

import React, {useContext} from 'react';
import Link from "next/link";
import {useRouter} from "next/navigation";
import {UserContext} from "@/utils/hooks/useAuthentication";
import { loginUser } from '@/services/authService';

import "./Login.scss"

const LoginPage = () => {
	const userContext = useContext(UserContext);
	const [loginData, setLoginData] = React.useState({
		email: "",
		password: "",
	});
	const [showHelperText, setShowHelperText] = React.useState(false);
	const router = useRouter();

	const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = event.target;
		setLoginData((prevLoginData) => ({
			...prevLoginData,
			[name]: value,
		}));
	};

	const handleSubmit = async (event: React.FormEvent) => {
		event.preventDefault();

		try {
			for (let field of Object.values(loginData)) {
				if (field === "") {
					setShowHelperText(true);
					return;
				}
			}
			
			await loginUser(loginData);
			
			userContext?.login(+document.cookie.split("=")[1])
			setLoginData({
				email: "",
				password: "",
			});
			router.push('/');
		} catch (error) {
			console.error('Login error:', error);
		}
	};
	
	return (
		<div className="login-page">
			<h2>Login</h2>
			<form onSubmit={handleSubmit} className="login-form">
				<input
					type="email"
					name="email"
					placeholder="Email"
					value={loginData.email}
					onChange={handleInputChange}
				/>
				<input
					type="password"
					name="password"
					placeholder="Password"
					value={loginData.password}
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
				<Link href={"/register"}>Register</Link>
			</div>
		</div>
	);
};

export default LoginPage;
