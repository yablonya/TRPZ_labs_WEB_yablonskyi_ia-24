"use client";

import React, {FC, useEffect, useState} from 'react';
import NodesContainer from "@/components/common/nodes-container/NodesContainer";
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {NodeType} from "@/types/NodeType";
import {ConnectionType} from "@/types/ConnectionType";
import {
	addConnection,
	deleteConnection, deleteMindMap, getAllMindMaps,
	getConnections,
	getMindMap,
	getNodes,
	renameMindMap,
	saveMindMapState,
	updateNodes
} from '@/services/mindMapService';
import { deleteNode } from '@/services/nodeService';

import "./MindMapPage.scss";
import {FullMindMapType, MindMapType} from "@/types";
import MapControlPanel from '@/components/common/map-control-panel/MapControlPanel';
import AddNodeForm from '@/components/common/add-node-form/AddNodeForm';
import HistoryList from "@/components/common/history-list/HistoryList";
import PreviewNodesContainer from '@/components/common/nodes-container/preview-node-container/PreviewNodeContainer';
import MindMapSidebar from '@/components/common/mind-map-sidebar/MindMapSidebar';


interface MindMapPageProps {
	mindMapId: string;
}

const MindMapPage: FC<MindMapPageProps> = ({ mindMapId }) => {
	const [mindMap, setMindMap] = useState<MindMapType | null>(null);
	const [allMindMaps, setAllMindMaps] = useState<MindMapType[]>([]);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [localTitle, setLocalTitle] = useState("");
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [showNodeForm, setShowNodeForm] = useState(false);
	const [showHistory, setShowHistory] = useState(false);
	const [connectionOriginNodeId, setConnectionOriginNodeId] = useState<string | null>(null);
	const [hoverSnapshot, setHoverSnapshot] = useState<FullMindMapType | null>(null);
	const [showSidebar, setShowSidebar] = useState<boolean>(false);
	const [mode, setMode] = useState<"hand" | "outline" | null>(null);

	const containerSize = 100000;

	useEffect(() => {
		if (mindMap) {
			setLocalTitle(mindMap.name);
		}
	}, [mindMap]);

	const handleTitleBlur = async () => {
		setIsEditingTitle(false);
		
		if (mindMap && localTitle.trim() !== mindMap.name.trim()) {
			try {
				await renameMindMap(mindMap.id, localTitle.trim());
				setMindMap({ ...mindMap, name: localTitle.trim() });
			} catch (error) {
				console.error("Error renaming mind map:", error);
			}
		}
	};

	const fetchMindMap = async () => {
		try {
			const mindMap = await getMindMap(mindMapId);
			setMindMap(mindMap);
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const fetchUserMindMaps = async () => {
		try {
			const mindMapsData = await getAllMindMaps();
			setAllMindMaps(mindMapsData);
		} catch (error) {
			console.error('Error fetching user mind maps:', error);
		}
	};

	const fetchNodes = async () => {
		try {
			const nodesData = await getNodes(mindMapId);
			setNodes(nodesData);
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const fetchConnections = async () => {
		try {
			const connectionsData = await getConnections(mindMapId);
			setConnections(connectionsData);
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const removeNode = async (nodeId: string) => {
		try {
			await deleteNode(nodeId);
			setNodes((prev) => prev.filter((n) => n.id !== nodeId));
			setConnections((prev) =>
				prev.filter(
					(c) => c.fromNode.id !== nodeId && c.toNode.id !== nodeId
				)
			);
		} catch (error) {
			console.error('Error deleting node:', error);
		}
	};

	const saveChangedNodes = async () => {
		try {
			await updateNodes(mindMapId, nodes);
		} catch (error) {
			console.error("Error saving nodes:", error);
		}
	};

	const createConnection = async (fromNodeId: string, toNodeId: string) => {
		try {
			await addConnection(fromNodeId, toNodeId);
			await fetchConnections();
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	const removeConnection = async (connectionId: string) => {
		try {
			await deleteConnection(connectionId);
			setConnections((prev) => prev.filter((c) => c.id !== connectionId));
		} catch (error) {
			console.error('Error deleting connection:', error);
		}
	};

	const updateConnections = (updatedNodes: NodeType[]) => {
		setConnections((prevConnections) =>
			prevConnections.map((connection) => {
				const fromNode = updatedNodes.find((node) => node.id === connection.fromNode.id);
				const toNode = updatedNodes.find((node) => node.id === connection.toNode.id);

				return {
					...connection,
					fromNode: fromNode ?? connection.fromNode,
					toNode: toNode ?? connection.toNode,
				};
			})
		);
	};

	const createSnapshot = async () => {
		try {
			await saveMindMapState(mindMapId);
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	useEffect(() => {
		fetchMindMap();
		fetchUserMindMaps();
		fetchNodes();
		fetchConnections();
		const autoSaveInterval = setInterval(saveChangedNodes, 2 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [mindMapId]);

	return mindMap && (
		<DndProvider backend={HTML5Backend}>
			<div className="mind-map-page">
				<div className="sidebar-header">
					<a href="/">Back to main</a>
					<div>
						<button onClick={() => setShowSidebar(!showSidebar)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24">
								<path
									d="M4 18q-.425 0-.712-.288T3 17t.288-.712T4 16h16q.425 0 .713.288T21 17t-.288.713T20 18zm0-5q-.425 0-.712-.288T3 12t.288-.712T4 11h16q.425 0 .713.288T21 12t-.288.713T20 13zm0-5q-.425 0-.712-.288T3 7t.288-.712T4 6h16q.425 0 .713.288T21 7t-.288.713T20 8z"/>
							</svg>
						</button>
						{!isEditingTitle ? (
							<h2 onClick={() => setIsEditingTitle(true)}>
								{mindMap.name}
							</h2>
						) : (
							<input
								type="text"
								value={localTitle}
								onChange={(e) => setLocalTitle(e.target.value)}
								onBlur={handleTitleBlur}
								autoFocus
							/>
						)}
					</div>
				</div>
				{!hoverSnapshot && (
					<NodesContainer
						nodes={nodes}
						connections={connections}
						setNodes={(updatedNodes) => {
							const updatedArray = typeof updatedNodes === "function" ? updatedNodes(nodes) : updatedNodes;
							setNodes(updatedArray);
							updateConnections(updatedArray);
							updateNodes(mindMapId, updatedArray);
						}}
						onDeleteConnection={removeConnection}
						onDeleteNode={removeNode}
						connectionOriginNodeId={connectionOriginNodeId}
						setConnectionOriginNodeId={setConnectionOriginNodeId}
						onCreateConnection={createConnection}
						mode={mode}
						containerSize={containerSize}
					/>
				)}
				{hoverSnapshot && (
					<PreviewNodesContainer
						nodes={hoverSnapshot.nodes}
						connections={hoverSnapshot.connections}
						icons={hoverSnapshot.icons}
						files={hoverSnapshot.files}
						containerSize={containerSize}
					/>
				)}
				<MapControlPanel
					mode={mode}
					toggleHandMode={() => setMode(mode === "hand" ? null : "hand")}
					toggleOutlineMode={() => setMode(mode === "outline" ? null : "outline")}
					onAddNode={() => setShowNodeForm(!showNodeForm)}
					onCreateSnapshot={() => {
						createSnapshot();
						setShowHistory(false);
					}}
					onHistory={() => setShowHistory(!showHistory)}
				/>

				<div className="right-control-panel">
					{showHistory &&
            <HistoryList
              mindMapId={mindMapId}
              snapshot={hoverSnapshot}
              setHoverSnapshot={setHoverSnapshot}
              updateMindMap={() => {
								fetchMindMap();
								fetchNodes();
								fetchConnections();
							}}
              onClose={() => setShowHistory(false)}
            />
					}
					{showNodeForm &&
            <AddNodeForm
              mindMapId={mindMap.id}
              onClose={() => setShowNodeForm(false)}
              onNodeAdded={() => {
								fetchNodes();
								fetchConnections();
							}}
              containerSize={containerSize}
            />
					}
				</div>
				<MindMapSidebar
					allMindMaps={allMindMaps}
					style={{ left: showSidebar ? 0 : "-300px" }}
				/>
			</div>
		</DndProvider>
	);
};

export default MindMapPage;

