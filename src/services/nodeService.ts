import {NewNodeIcon, UploadedFile } from '@/types';

const BASE_NODE_URL = 'http://localhost:8080/api/mind-map/node';

export async function createNode(payload: any): Promise<void> {
	const res = await fetch(`${BASE_NODE_URL}/add`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(payload),
	});

	if (!res.ok) {
		throw Error('Failed to add node');
	}
}

export async function deleteNode(nodeId: number): Promise<void> {
	const res = await fetch(`http://localhost:8080/api/mind-map/node/delete?nodeId=${nodeId}`, {
		method: 'DELETE',
		credentials: 'include',
	});

	if (!res.ok) {
		throw new Error("Failed to delete node");
	}
}

export async function getNodeFiles(nodeId: number) {
	const res = await fetch(`${BASE_NODE_URL}/${nodeId}/files`, {
		method: 'GET',
		credentials: 'include',
	});
	
	if (!res.ok) {
		throw new Error(`Failed to fetch files for node ${nodeId}`);
	}
	
	return res.json();
}

export async function getNodeIcons(nodeId: number) {
	const res = await fetch(`${BASE_NODE_URL}/${nodeId}/icons`, {
		method: 'GET',
		credentials: 'include',
	});
	
	if (!res.ok) {
		throw new Error(`Failed to fetch icons for node ${nodeId}`);
	}
	
	return res.json();
}

export async function createNodeIcon(nodeId: number, icon: NewNodeIcon) {
	const res = await fetch(`${BASE_NODE_URL}/${nodeId}/add-icon`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(icon),
	});
	
	if (!res.ok) {
		throw new Error('Failed to add icon');
	}
}

export async function deleteNodeIcon(nodeId: number, iconId: number) {
	const res = await fetch(
		`${BASE_NODE_URL}/${nodeId}/delete-icon?iconId=${iconId}`,
		{
			method: 'DELETE',
			credentials: 'include',
		}
	);

	if (!res.ok) {
		throw new Error(`Failed to remove icon with id ${iconId}`);
	}
}

export async function addFileToNode(nodeId: number, uploadedFile: UploadedFile) {
	const res = await fetch(`${BASE_NODE_URL}/${nodeId}/add-file`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		credentials: 'include',
		body: JSON.stringify(uploadedFile),
	});
	
	if (!res.ok) {
		throw new Error('Failed to add file');
	}
}

export async function deleteNodeFile(nodeId: number, fileId: number) {
	const res = await fetch(
		`${BASE_NODE_URL}/${nodeId}/delete-file?fileId=${fileId}`,
		{
			method: 'DELETE',
			credentials: 'include',
		}
	);
	
	if (!res.ok) {
		throw new Error(`Failed to remove file with id ${fileId}`);
	}
}

export async function uploadFile(file: File): Promise<UploadedFile> {
	const reader = new FileReader();

	return new Promise<UploadedFile>((resolve, reject) => {
		reader.onloadend = async () => {
			try {
				const res = await fetch('/api/upload', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: reader.result }),
				});
				if (!res.ok) {
					throw Error('Error uploading file');
				}
				const { url } = await res.json();
				resolve({ url, type: file.type });
			} catch (error) {
				reject(error);
			}
		};
		
		reader.onerror = (error) => reject(error);
		reader.readAsDataURL(file);
	});
}
