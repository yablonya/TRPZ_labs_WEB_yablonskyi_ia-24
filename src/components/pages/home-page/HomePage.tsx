"use client";

import React, {useContext, useEffect, useState} from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapsList from "@/components/common/mind-maps-list/MindMapsList";
import {UserContext} from "@/utils/hooks/useAuthentication";
import CreateMapDialog from "@/components/pages/home-page/components/create-map-dialog/CreateMapDialog";
import {getUserData} from '@/services/userService';
import { getAllMindMaps } from '@/services/mindMapService';
import {UserType} from "@/types";

import "./HomePage.scss"

const HomePage = () => {
	const userContext = useContext(UserContext);
	const [user, setUser] = useState<UserType | null>(null);
	const [mindMaps, setMindMaps] = useState<MindMapType[]>([]);
	
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
	
	useEffect(() => {
		if (userContext?.user) {
			fetchUser();
			fetchUserMindMaps();
		}
	}, [userContext]);
	
	return (
		<div className="home-page">
			<div className="header">
				<h1>Hi, {user?.name}</h1>
				<a href="/cabinet">Cabinet</a>
			</div>
			{mindMaps.length !== 0 ? (
				<>
					<h2 className="mind-maps-header">Your mind maps</h2>
					<MindMapsList 
						mindMapsList={mindMaps}
					/>
				</>
			) : (
				<h2 className="no-mind-maps">You have no mind maps...</h2>
			)}
			<CreateMapDialog/>
		</div>
	);
};

export default HomePage;
