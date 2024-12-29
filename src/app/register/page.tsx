import React from 'react';
import RegisterPage from "@/components/pages/register-page/RegisterPage";
import {Metadata} from "next";

export const metadata: Metadata = {
	title: "Register",
}

const Registration = () => {
	return (
		<RegisterPage/>
	);
};

export default Registration;
