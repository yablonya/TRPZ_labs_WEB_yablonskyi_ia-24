"use client";

import React, {useContext, useEffect, useState} from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapsList from "@/components/common/mind-maps-list/MindMapsList";
import "./HomePage.scss"
import {useRouter} from "next/navigation";
import {UserContext} from "@/utils/hooks/useAuthentication";
import CreateMapDialog from "@/components/pages/home-page/components/create-map-dialog/CreateMapDialog";
import {getUserData, logoutUser} from '@/services/authService';
import { getAllMindMaps } from '@/services/mindMapService';
import {UserType} from "@/types";

const HomePage = () => {
	const userContext = useContext(UserContext);
	const [user, setUser] = useState<UserType | null>(null);
	const [mindMaps, setMindMaps] = useState<MindMapType[] | null>(null);
	const router = useRouter();

	const handleLogoutClick = async () => {
		try {
			await logoutUser();
			router.push('/');
			console.log("User log out successfully");
		} catch (error) {
			console.error('Logout error:', error);
		}
	};
	
	useEffect(() => {
		const fetchUser = async () => {
			try {
				const userData = await getUserData(userContext?.user!);
				setUser(userData);
			} catch (error) {
				console.error('Error fetching user:', error);
			}
		};

		const fetchUserMindMaps = async () => {
			try {
				const mindMapsData = await getAllMindMaps();
				setMindMaps(mindMapsData);
			} catch (error) {
				console.error('Error fetching user mind maps:', error);
			}
		};

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
