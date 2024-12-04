import React from 'react';
import { FullMindMapType } from "@/types/FullMindMapType";
import MindMapPage from "@/components/pages/mind-map-page/MindMapPage";

const mindMapMapper: Record<number, FullMindMapType> = {
	1: {
		mindMap: {
			id: 1,
			creatorId: 1,
			name: "First Mind Map",
			title: "My first mind map",
			creationDate: "2024-12-04T17:28:20.016+00:00"
		},
		nodes: [
			{
				id: 1,
				mindMapId: 1,
				type: "",
				content: "First node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 374,
				yPosition: 684
			},
			{
				id: 2,
				mindMapId: 1,
				type: "",
				content: "Second node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 876,
				yPosition: 765
			},
			{
				id: 3,
				mindMapId: 1,
				type: "",
				content: "Third node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 547,
				yPosition: 323
			}
		],
		savedAt: "2024-12-04T17:28:20.016+00:00",
	},
	2: {
		mindMap: {
			id: 2,
			creatorId: 1,
			name: "Second Mind Map",
			title: "My second mind map",
			creationDate: "2024-12-04T17:28:20.016+00:00"
		},
		nodes: [
			{
				id: 4,
				mindMapId: 2,
				type: "",
				content: "First node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 678,
				yPosition: 234
			},
			{
				id: 5,
				mindMapId: 2,
				type: "",
				content: "Second node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 1023,
				yPosition: 234
			},
		],
		savedAt: "2024-12-04T17:28:20.016+00:00",
	},
	3: {
		mindMap: {
			id: 3,
			creatorId: 1,
			name: "Third Mind Map",
			title: "My third mind map",
			creationDate: "2024-12-04T17:28:20.016+00:00"
		},
		nodes: [
			{
				id: 6,
				mindMapId: 3,
				type: "",
				content: "First node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 474,
				yPosition: 784
			},
			{
				id: 7,
				mindMapId: 3,
				type: "",
				content: "Second node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 876,
				yPosition: 765
			},
			{
				id: 8,
				mindMapId: 3,
				type: "",
				content: "Third node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 865,
				yPosition: 454
			},
			{
				id: 9,
				mindMapId: 3,
				type: "",
				content: "Fourth node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 547,
				yPosition: 456
			}
		],
		savedAt: "2024-12-04T17:28:20.016+00:00",
	},
	4: {
		mindMap: {
			id: 4,
			creatorId: 1,
			name: "Fourth Mind Map",
			title: "My fourth mind map",
			creationDate: "2024-12-04T17:28:20.016+00:00"
		},
		nodes: [
			{
				id: 10,
				mindMapId: 4,
				type: "",
				content: "First node",
				priority: 0,
				category: "",
				creationDate: "2024-12-04T17:32:14.985+00:00",
				xPosition: 555,
				yPosition: 555
			}
		],
		savedAt: "2024-12-04T17:28:20.016+00:00",
	}
}

const MindMap = async ({ params }: { params: Promise<{ mindMapId: string }> }) => {
	const mindMapId = Number((await params).mindMapId);
	const mindMap = mindMapMapper[mindMapId];
	
	return (
		<MindMapPage fullMindMap={mindMap}/>
	);
};

export default MindMap;
