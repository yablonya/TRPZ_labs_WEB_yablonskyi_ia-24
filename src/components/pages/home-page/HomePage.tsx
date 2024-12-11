"use client";

import React, {useContext, useEffect, useState} from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapsList from "@/components/common/mind-maps-list/MindMapsList";
import "./HomePage.scss"
import {useRouter} from "next/navigation";
import {UserContext} from "@/utils/hooks/useAuthentication";
import {User} from "@/types/User";

const mindMapsList: MindMapType[] = [
	{
		id: 1,
		creatorId: 1,
		name: "First Mind Map",
		title: "My first mind map",
		creationDate: "2024-12-04T17:28:20.016+00:00"
	},
	{
		id: 2,
		creatorId: 1,
		name: "Second Mind Map",
		title: "My second mind map",
		creationDate: "2024-12-04T17:28:20.016+00:00"
	},
	{
		id: 3,
		creatorId: 1,
		name: "Third Mind Map",
		title: "My third mind map",
		creationDate: "2024-12-04T17:28:20.016+00:00"
	},
	{
		id: 4,
		creatorId: 1,
		name: "Fourth Mind Map",
		title: "My fourth mind map",
		creationDate: "2024-12-04T17:28:20.016+00:00"
	}
]

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
				<h2>Hi, {user?.name}</h2>
				<button onClick={handleLogoutClick}>Logout</button>
			</div>
			<MindMapsList mindMapsList={mindMaps ?? []} />
		</div>
	);
};

export default HomePage;
