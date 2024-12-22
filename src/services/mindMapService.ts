import {NodeType, ConnectionType, MindMapType} from "@/types";

export async function getAllMindMaps(): Promise<MindMapType[]> {
	const res = await fetch(`http://localhost:8080/api/mind-map/all`, {
		method: 'GET',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error('Error fetching user mind maps');
	}
	
	return res.json();
}

export async function getMindMap(mindMapId: string): Promise<MindMapType> {
	const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}`, {
		method: "GET",
		credentials: 'include'
	});
	
	if (!res.ok) {
		throw new Error("Error fetching mind map");
	}
	
	return res.json();
}

export async function getNodes(mindMapId: string): Promise<NodeType[]> {
	const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}/nodes`, {
		method: "GET",
		credentials: 'include'
	});

	if (!res.ok) {
		throw new Error("Error fetching nodes");
	}

	return res.json();
}

export async function updateNodes(mindMapId: string, nodes: NodeType[]): Promise<void> {
	const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}/update-nodes`, {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		credentials: 'include',
		body: JSON.stringify(nodes),
	});
	
	if (!res.ok) {
		throw new Error("Error saving nodes");
	}
}

export async function addConnection(fromNodeId: string, toNodeId: string): Promise<void> {
	const params = new URLSearchParams({ fromNodeId: String(fromNodeId), toNodeId: String(toNodeId) });
	const res = await fetch(`http://localhost:8080/api/mind-map/add-connection?${params.toString()}`, {
		method: 'POST',
		credentials: 'include',
	});
	
	if (!res.ok) {
		throw new Error("Failed to add connection");
	}
}

export async function getConnections(mindMapId: string): Promise<ConnectionType[]> {
	const res = await fetch(`http://localhost:8080/api/mind-map/${mindMapId}/connections`, {
		method: "GET",
		credentials: 'include'
	});

	if (!res.ok) {
		throw new Error("Error fetching connections");
	}

	return res.json();
}

export async function deleteConnection(connectionId: string): Promise<void> {
	const res = await fetch(`http://localhost:8080/api/mind-map/delete-connection?connectionId=${connectionId}`, {
		method: 'DELETE',
		credentials: 'include',
	});
	
	if (!res.ok) {
		throw new Error("Failed to delete connection");
	}
}
