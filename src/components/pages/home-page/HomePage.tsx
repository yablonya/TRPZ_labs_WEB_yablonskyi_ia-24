"use client";

import React, {useContext, useEffect, useState} from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapsList from "@/components/common/mind-maps-list/MindMapsList";
import "./HomePage.scss"
import {useRouter} from "next/navigation";
import {UserContext} from "@/utils/hooks/useAuthentication";
import {User} from "@/types/User";
import CreateMapDialog from "@/components/pages/home-page/components/create-map-dialog/CreateMapDialog";

const HomePage = () => {
	const userContext = useContext(UserContext);
	const [user, setUser] = useState<User | null>(null);
	const [mindMaps, setMindMaps] = useState<MindMapType[] | null>(null);
	const router = useRouter();
	const handleLogoutClick = async (event: React.MouseEvent) => {
		try {
			const res = await fetch('http://localhost:8080/api/logout', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				credentials: 'include',
			});

			if (res.ok) {
				router.push('/');
				console.log("User log out successfully");
			} else {
				console.log('Registration error');
			}
		} catch (error) {
			console.error('Network error:', error);
		}
	};

	useEffect(() => {
		const fetchUser = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/user/${userContext?.user}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
				});

				if (res.ok) {
					const user = await res.json();
					setUser(user);
				} else {
					console.log('Error fetching user');
				}
			} catch (error) {
				console.error('Network error:', error);
			}
		}

		const fetchUserMindMaps = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/mind-map/all`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
				});

				if (res.ok) {
					const mindMaps = await res.json();
					setMindMaps(mindMaps);
				} else {
					console.log('Error fetching user mind maps');
				}
			} catch (error) {
				console.error('Network error:', error);
			}
		}
		
		if (userContext?.user) {
			fetchUser();
			fetchUserMindMaps();
		}
	}, [userContext]);
	
	return (
		<div className="home-page">
			<div className="header">
				<h1>Hi, {user?.name}</h1>
				<button onClick={handleLogoutClick}>Logout</button>
			</div>
			{mindMaps ? (
				<>
					<h2 className="mind-maps-header">Your mind maps</h2>
					<MindMapsList mindMapsList={mindMaps}/>
				</>
			) : (
				<h2 className="no-mind-maps">You have no mind maps...</h2>
			)}
			<CreateMapDialog/>
		</div>
	);
};

export default HomePage;
