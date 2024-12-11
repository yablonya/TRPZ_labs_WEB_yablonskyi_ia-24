"use client";

import {ReactNode, createContext, useState, useEffect} from "react";

export interface AuthenticationContext {
	user: number | null;
	login: (id: number) => void;
	logout: () => void;
}

export const UserContext = createContext<AuthenticationContext | undefined>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<number | null>(null);

	useEffect(() => {
		setUser(+document.cookie.split("=")[1]);
	}, []);

	const login = (id: number) => {
		console.log(id)
		setUser(id);
	};

	const logout = () => {
		setUser(null);
	};

	return (
		<UserContext.Provider value={{ user, login, logout }}>
			{children}
		</UserContext.Provider>
	);
};
