"use client"

import React, {useContext, useEffect, useState} from 'react';
import {UserContext} from "@/utils/hooks/useAuthentication";
import { UserType } from '@/types';
import {deleteUser, getUserData, logoutUser, updateUser} from "@/services/userService";
import {useRouter} from "next/navigation";
import "./CabinetPage.scss"

const UserCabinetPage: React.FC = () => {
	const [user, setUser] = useState<UserType | null>(null);
	const router = useRouter();
	const userContext = useContext(UserContext);

	const fetchUser = async () => {
		try {
			const userData = await getUserData(userContext?.user!);
			setUser(userData);
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};
	
	const handleUpdate = async () => {
		try {
			if (!user) return;

			const updatedUser = await updateUser(user);
			setUser(updatedUser);
		} catch (err: any) {
			console.error(err);
		}
	};

	const handleLogout = async () => {
		try {
			await logoutUser();
			router.push('/');
		} catch (error) {
			console.error('Logout error:', error);
		}
	};
	
	const handleDelete = async () => {
		try {
			await deleteUser();
			router.push('/');
		} catch (err: any) {
			console.error(err);
		}
	};

	useEffect(() => {
		if (userContext?.user) {
			fetchUser();
		}
	}, [userContext]);
	
	return (
		<div className="cabinet-page">
			<h2>User cabinet</h2>
			{user && (
				<>
					<div className="update-form">
						<div>
							<label>Name</label>
							<input
								type="text"
								value={user.name}
								onChange={(e) => setUser({...user, name: e.target.value})}
							/>
						</div>
						<div>
							<label>Email</label>
							<input
								type="email"
								value={user.email}
								onChange={(e) => setUser({...user, email: e.target.value})}
							/>
						</div>
						<div>
							<label>Password</label>
							<input
								type="password"
								value={user.password}
								onChange={(e) => setUser({...user, password: e.target.value})}
							/>
						</div>
					</div>
					<div className="navigation">
						<button onClick={handleUpdate}>
							Update
						</button>
						<button onClick={handleLogout}>
							Log out
						</button>
						<button onClick={handleDelete}>
							Delete account
						</button>
						<a href="/">Back to main</a>
					</div>
				</>
			)}
		</div>
	);
};

export default UserCabinetPage;
