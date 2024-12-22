"use client";

import React, {FC, useEffect, useState} from 'react';
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
	getMindMap, getNodes,
	updateNodes
} from '@/services/mindMapService';
import { deleteNode } from '@/services/nodeService';

import "./MindMapPage.scss";
import {MindMapType} from "@/types";

interface MindMapPageProps {
	mindMapId: string;
}

const MindMapPage: FC<MindMapPageProps> = ({ mindMapId }) => {
	const [mindMap, setMindMap] = useState<MindMapType | null>(null);
	const [nodes, setNodes] = useState<NodeType[]>([]);
	const [connections, setConnections] = useState<ConnectionType[]>([]);
	const [showNodeForm, setShowNodeForm] = useState(false);
	const [connectionOriginNodeId, setConnectionOriginNodeId] = useState<string | null>(null);
	const [handMode, setHandMode] = useState(false);
	const [outlineMode, setOutlineMode] = useState(false);

	const containerSize = 100000;

	const fetchMindMap = async () => {
		try {
			const mindMap = await getMindMap(mindMapId);
			setMindMap(mindMap);
		} catch (error) {
			console.error("Network error:", error);
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

	useEffect(() => {
		fetchMindMap();
		fetchNodes();
		fetchConnections();
		const autoSaveInterval = setInterval(saveChangedNodes, 2 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [mindMapId]);

	return mindMap && (
		<DndProvider backend={HTML5Backend}>
			<div className="mind-map-page">
				<h2>{mindMap.name}</h2>
				<NodesContainer
					nodes={nodes}
					connections={connections}
					handMode={handMode}
					outlineMode={outlineMode}
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
		</DndProvider>
	);
};

export default MindMapPage;

