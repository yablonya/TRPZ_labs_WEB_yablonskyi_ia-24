"use client";

import React, {FC, useEffect, useState} from 'react';
import { FullMindMapType } from "@/types/FullMindMapType";
import NodesContainer from "@/components/common/nodes-container/NodesContainer";
import MapControlPanel from './components/map-control-panel/MapControlPanel';
import AddNodeForm from './components/add-node-form/AddNodeForm';
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {NodeType} from "@/types/NodeType";

import "./MindMapPage.scss";

interface MindMapPageProps {
	mindMapId: string;
}

const MindMapPage: FC<MindMapPageProps> = ({ mindMapId }) => {
	const [fullMindMap, setFullMindMap] = useState<FullMindMapType | null>(null);
	const [currentNodes, setCurrentNodes] = useState<NodeType[]>([]);
	const [showNodeForm, setShowNodeForm] = useState(false);
	const [controlState, setControlState] = useState("view");

	const fetchMindMapNodes = async () => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}`, { credentials: 'include' });
			if (res.ok) {
				const mindMap = await res.json();
				setFullMindMap(mindMap);
				setCurrentNodes(mindMap.nodes);
			} else {
				console.error("Error fetching mind map");
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	useEffect(() => {
		fetchMindMapNodes();
		const autoSaveInterval = setInterval(saveNodes, 2 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [mindMapId]);

	const saveNodes = async () => {
		try {
			await fetch(`http://localhost:8080/api/mind-map/${mindMapId}/update-nodes`, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				credentials: 'include',
				body: JSON.stringify(currentNodes),
			});
			console.log("Nodes saved successfully");
		} catch (error) {
			console.error("Error saving nodes:", error);
		}
	};

	return fullMindMap && (
		<DndProvider backend={HTML5Backend}>
			<div className="mind-map-page">
				<h2>{fullMindMap.mindMap.name}</h2>
				<NodesContainer nodes={currentNodes} setNodes={setCurrentNodes} />
				<MapControlPanel onSave={saveNodes} onAddNode={() => setShowNodeForm(true)} />
				{showNodeForm &&
          <AddNodeForm
            mindMapId={fullMindMap.mindMap.id}
            onClose={() => setShowNodeForm(false)}
            onNodeAdded={fetchMindMapNodes}
          />
				}
			</div>
		</DndProvider>
	);
};


export default MindMapPage;


// [
// 	{
// 		id: 1,
// 		mindMapId: 1,
// 		type: "",
// 		content: "First node",
// 		priority: 0,
// 		category: "",
// 		creationDate: "2024-12-04T17:32:14.985+00:00",
// 		xPosition: 374,
// 		yPosition: 684
// 	},
// 	{
// 		id: 2,
// 		mindMapId: 1,
// 		type: "",
// 		content: "Second node",
// 		priority: 0,
// 		category: "",
// 		creationDate: "2024-12-04T17:32:14.985+00:00",
// 		xPosition: 876,
// 		yPosition: 765
// 	},
// 	{
// 		id: 3,
// 		mindMapId: 1,
// 		type: "",
// 		content: "Third node",
// 		priority: 0,
// 		category: "",
// 		creationDate: "2024-12-04T17:32:14.985+00:00",
// 		xPosition: 547,
// 		yPosition: 323
// 	}
// ]
