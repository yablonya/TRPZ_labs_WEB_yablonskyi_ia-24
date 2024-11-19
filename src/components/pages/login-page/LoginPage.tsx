import React from 'react';
import Link from "next/link";

const LoginPage = () => {
	return (
		<div>
			<Link href={"/"}>Back to main</Link>
			<p>Register</p>
			<form>

			</form>
			<Link href={"/register"}>Register</Link>
		</div>
	);
};

export default LoginPage;
