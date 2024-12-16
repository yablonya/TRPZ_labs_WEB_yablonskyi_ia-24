"use client";

import React, {FC, useEffect, useRef, useState} from 'react';
import { FullMindMapType } from "@/types/FullMindMapType";
import NodesContainer from "@/components/common/nodes-container/NodesContainer";
import "./MindMapPage.scss";
import MapControlPanel from "@/components/pages/mind-map-page/components/map-control-panel/MapControlPanel";
import {MindMapType} from "@/types/MindMapType";

interface MindMapPageProps {
	mindMapId: string;
}

const MindMapPage: FC<MindMapPageProps> = ({ mindMapId }) => {
	const [fullMindMap, setFullMindMap] = useState<FullMindMapType | null>(null);
	const [controlState, setControlState] = useState("view");

	useEffect(() => {
		const fetchMindMap = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}`, {
					method: 'GET',
					headers: {
						'Content-Type': 'application/json'
					},
					credentials: 'include',
				});

				if (res.ok) {
					const mindMap = await res.json();
					setFullMindMap(mindMap);
				} else {
					console.log('Registration error');
				}
			} catch (error) {
				console.error('Network error:', error);
			}
		}

		fetchMindMap();
	}, [mindMapId]);
	
	return fullMindMap && (
		<div className="mind-map-page">
			<h2>{fullMindMap.mindMap.name}</h2>
			<NodesContainer nodes={[
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
			]} controlState={controlState} />
			<MapControlPanel 
				mindMapId={fullMindMap.mindMap.id} 
				controlState={controlState} 
				setControlState={setControlState}
			/>
		</div>
	);
};

export default MindMapPage;
