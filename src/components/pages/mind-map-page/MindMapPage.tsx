"use client";

import React, {FC, useEffect, useState} from 'react';
import { FullMindMapType } from "@/types/FullMindMapType";
import NodesContainer from "@/components/common/nodes-container/NodesContainer";
import MapControlPanel from './components/map-control-panel/MapControlPanel';
import AddNodeForm from './components/add-node-form/AddNodeForm';
import {HTML5Backend} from "react-dnd-html5-backend";
import {DndProvider} from "react-dnd";
import {NodeType} from "@/types/NodeType";
import {ConnectionType} from "@/types/ConnectionType";
import {
	addConnection,
	deleteConnection,
	getConnections,
	getFullMindMap,
	updateNodes
} from '@/services/mindMapService';
import { deleteNode } from '@/services/nodeService';

import "./MindMapPage.scss";

interface MindMapPageProps {
	mindMapId: string;
}

const MindMapPage: FC<MindMapPageProps> = ({ mindMapId }) => {
	const [fullMindMap, setFullMindMap] = useState<FullMindMapType | null>(null);
	const [currentNodes, setCurrentNodes] = useState<NodeType[]>([]);
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [showNodeForm, setShowNodeForm] = useState(false);
	const [connectionOriginNodeId, setConnectionOriginNodeId] = useState<number | null>(null);
	const [handMode, setHandMode] = useState(false);
	const [outlineMode, setOutlineMode] = useState(false);

	const containerSize = 100000;

	const fetchMindMapNodes = async () => {
		try {
			const mindMap = await getFullMindMap(mindMapId);
			setFullMindMap(mindMap);
			setCurrentNodes(mindMap.nodes);
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

	const removeNode = async (nodeId: number) => {
		try {
			await deleteNode(nodeId);
			setCurrentNodes((prev) => prev.filter((n) => n.id !== nodeId));
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
			await updateNodes(mindMapId, currentNodes);
		} catch (error) {
			console.error("Error saving nodes:", error);
		}
	};

	const createConnection = async (fromNodeId: number, toNodeId: number) => {
		try {
			await addConnection(fromNodeId, toNodeId);
			fetchConnections();
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	const removeConnection = async (connectionId: number) => {
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

	useEffect(() => {
		fetchMindMapNodes();
		fetchConnections();
		const autoSaveInterval = setInterval(saveChangedNodes, 2 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [mindMapId]);

	return fullMindMap && (
		<DndProvider backend={HTML5Backend}>
			<div className="mind-map-page">
				<h2>{fullMindMap.mindMap.name}</h2>
				<NodesContainer
					nodes={currentNodes}
					connections={connections}
					handMode={handMode}
					outlineMode={outlineMode}
					setNodes={(updatedNodes) => {
						const updatedArray = typeof updatedNodes === "function" ? updatedNodes(currentNodes) : updatedNodes;
						setCurrentNodes(updatedArray);
						updateConnections(updatedArray);
					}}
					onDeleteConnection={removeConnection}
					onDeleteNode={removeNode}
					connectionOriginNodeId={connectionOriginNodeId}
					setConnectionOriginNodeId={setConnectionOriginNodeId}
					onCreateConnection={createConnection}
					containerSize={containerSize}
				/>
				<MapControlPanel
					onSave={saveChangedNodes}
					onAddNode={() => setShowNodeForm(true)}
					handMode={handMode}
					toggleHandMode={() => setHandMode(!handMode)}
					outlineMode={outlineMode}
					toggleOutlineMode={() => setOutlineMode(!outlineMode)}
				/>
				{showNodeForm &&
          <AddNodeForm
            mindMapId={fullMindMap.mindMap.id}
            onClose={() => setShowNodeForm(false)}
            onNodeAdded={() => {
	            fetchMindMapNodes();
	            fetchConnections();
            }}
            containerSize={containerSize}
          />
				}
			</div>
		</DndProvider>
	);
};

export default MindMapPage;

