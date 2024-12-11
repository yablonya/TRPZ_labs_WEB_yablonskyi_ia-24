"use client";

import React, {useContext} from 'react';
import Link from "next/link";
import "./Login.scss"
import {useRouter} from "next/navigation";
import {UserContext} from "@/utils/hooks/useAuthentication";

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
			const res = await fetch('http://localhost:8080/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
				body: JSON.stringify(loginData)
			});

			if (res.ok) {
				userContext?.login(+document.cookie.split("=")[1])
				setLoginData({
					email: "",
					password: "",
				});
				router.push('/');
			} else {
				console.log('Registration error');
			}
		} catch (error) {
			console.error('Network error:', error);
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
