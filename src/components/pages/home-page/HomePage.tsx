import React from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapsList from "@/components/common/mind-maps-list/MindMapsList";
import "./HomePage.scss"

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
	return (
		<div className="home-page">
			<MindMapsList mindMapsList={mindMapsList} />
		</div>
	);
};

export default HomePage;
