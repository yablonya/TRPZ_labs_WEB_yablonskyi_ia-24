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
import {ConnectionType} from "@/types/ConnectionType";

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

	const fetchConnections = async () => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}/connections`, { credentials: 'include' });
			if (res.ok) {
				const connections = await res.json();
				setConnections(connections);
			} else {
				console.error("Error fetching connections");
			}
		} catch (error) {
			console.error("Network error:", error);
		}
	};

	const deleteNode = async (nodeId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/node/${nodeId}`, {
				method: 'POST',
				credentials: 'include',
			});
			if (res.ok) {
				// Видаляємо ноду зі стейту
				setCurrentNodes((prev) => prev.filter((n) => n.id !== nodeId));
				setConnections((prev) =>
					prev.filter(
						(c) => c.fromNode.id !== nodeId && c.toNode.id !== nodeId
					)
				);

				console.log('Node deleted successfully');
			} else {
				console.error('Failed to delete node');
			}
		} catch (error) {
			console.error('Error deleting node:', error);
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
		const autoSaveInterval = setInterval(saveNodes, 2 * 60 * 1000);

		return () => clearInterval(autoSaveInterval);
	}, [mindMapId]);

	const saveNodes = async () => {
		try {
			console.log(currentNodes)
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

	const createConnection = async (fromNodeId: number, toNodeId: number) => {
		try {
			const params = new URLSearchParams({ fromNodeId: String(fromNodeId), toNodeId: String(toNodeId) });
			const res = await fetch(`http://localhost:8080/api/mind-map/add-connection?${params.toString()}`, {
				method: 'POST',
				credentials: 'include',
			});
			if (res.ok) {
				console.log('Connection added successfully');
				// Після успішного створення перезапитуємо конекшни
				fetchConnections();
			} else {
				console.error('Failed to add connection');
			}
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	const removeConnection = async (connectionId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/connection/${connectionId}`, {
				method: 'POST',
				credentials: 'include',
			});
			if (res.ok) {
				console.log('Connection deleted successfully');
				// Оновлюємо стейт, видаляючи конекшн з локального масиву
				setConnections((prev) => prev.filter((c) => c.id !== connectionId));
			} else {
				console.error('Failed to delete connection');
			}
		} catch (error) {
			console.error('Error deleting connection:', error);
		}
	};

	return fullMindMap && (
		<DndProvider backend={HTML5Backend}>
			<div className="mind-map-page">
				<h2>{fullMindMap.mindMap.name}</h2>
				<NodesContainer
					nodes={currentNodes}
					connections={connections}
					handMode={handMode}
					setNodes={(updatedNodes) => {
						const updatedArray = typeof updatedNodes === "function" ? updatedNodes(currentNodes) : updatedNodes;
						setCurrentNodes(updatedArray);
						updateConnections(updatedArray);
					}}
					onDeleteConnection={removeConnection}
					onDeleteNode={deleteNode}
					connectionOriginNodeId={connectionOriginNodeId}
					setConnectionOriginNodeId={setConnectionOriginNodeId}
					onCreateConnection={createConnection}
				/>
				<MapControlPanel
					onSave={saveNodes}
					onAddNode={() => setShowNodeForm(true)}
					handMode={handMode}
					toggleHandMode={() => setHandMode(!handMode)}
				/>
				{showNodeForm &&
          <AddNodeForm
            mindMapId={fullMindMap.mindMap.id}
            onClose={() => setShowNodeForm(false)}
            onNodeAdded={() => {
	            fetchMindMapNodes();
	            fetchConnections();
            }}
          />
				}
			</div>
		</DndProvider>
	);
};

export default MindMapPage;

