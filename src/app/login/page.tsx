import React from 'react';
import LoginPage from "@/components/pages/login-page/LoginPage";
import {Metadata} from "next";

export const metadata: Metadata = {
	title: "Login",
}

const Login = () => {
	return (
		<LoginPage/>
	);
};

export default Login;
