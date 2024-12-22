"use client";

import {ReactNode, createContext, useState, useEffect} from "react";

export interface AuthenticationContext {
	user: string | null;
	login: (id: string) => void;
	logout: () => void;
}

export const UserContext = createContext<AuthenticationContext | undefined>(undefined);

interface UserProviderProps {
	children: ReactNode;
}

export const UserProvider = ({ children }: UserProviderProps) => {
	const [user, setUser] = useState<string | null>(null);

	useEffect(() => {
		setUser(document.cookie.split("=")[1]);
	}, []);

	const login = (id: string) => {
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
