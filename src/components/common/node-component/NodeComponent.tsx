import React, {FC, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import { useDrag } from 'react-dnd';
import {NewNodeIcon, NodeFile, NodeIcon } from '@/types';
import {
	addFileToNode,
	createNodeIcon,
	getNodeFiles,
	getNodeIcons,
	deleteNodeFile,
	deleteNodeIcon,
    uploadFile
} from '@/services/nodeService';

import "./NodeComponent.scss"

interface NodeComponentProps {
	node: NodeType;
	updateNodeContent: (id: string, content: string) => void;
	onDeleteNode?: (nodeId: string) => void;
	connectionOriginNodeId?: string | null;
	setConnectionOriginNodeId?: (id: string | null) => void;
	onCreateConnection?: (fromNodeId: string, toNodeId: string) => void;
	handMode: boolean;
	outlineMode: boolean;
}

const NodeComponent: FC<NodeComponentProps> = ({ 
	node,
	updateNodeContent,
	onDeleteNode,
	setConnectionOriginNodeId,
	connectionOriginNodeId,
	onCreateConnection,
	handMode,
	outlineMode
}) => {
	const [icons, setIcons] = useState<NodeIcon[]>([]);
	const [files, setFiles] = useState<NodeFile[]>([]);
	const [newPriority, setNewPriority] = useState<string>("");
	const [newCategory, setNewCategory] = useState<string>("");
	const [newFile, setNewFile] = useState<File | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newContent, setNewContent] = useState(node.content);
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "node",
		item: { id: node.id },
		collect: (monitor) => ({ isDragging: monitor.isDragging() }),
	}));

	const fetchNodeComponents = async () => {
		try {
			const filesData = await getNodeFiles(node.id);
			setFiles(filesData);

			const iconsData = await getNodeIcons(node.id);
			setIcons(iconsData);
		} catch (error) {
			console.error('Error fetching data for node:', error);
		}
	};

	useEffect(() => {
		fetchNodeComponents();
	}, [node.id]);
	
	const addIcon = async (icon: NewNodeIcon) => {
		try {
			await createNodeIcon(node.id, icon);
			
			if (icon.type === 'priority') {
				setNewPriority('');
			} else {
				setNewCategory('');
			}
			fetchNodeComponents();
		} catch (error) {
			console.error('Error adding icon:', error);
		}
	};
	
	const addFile = async () => {
		if (!newFile) return;
		
		try {
			const uploadedFile = await uploadFile(newFile);
			await addFileToNode(node.id, uploadedFile);

			setNewFile(null);
			fetchNodeComponents();
		} catch (error) {
			console.error('Error adding file:', error);
		}
	};
	
	const removeIcon = async (iconId: string) => {
		try {
			await deleteNodeIcon(node.id, iconId);
			
			setIcons((prev) => prev.filter((icon) => icon.id !== iconId));
		} catch (error) {
			console.error('Error removing icon:', error);
		}
	};
	
	const removeFile = async (fileId: string) => {
		try {
			await deleteNodeFile(node.id, fileId);

			setFiles((prev) => prev.filter((file) => file.id !== fileId));
		} catch (error) {
			console.error('Error removing file:', error);
		}
	};

	const renderFile = (file: NodeFile) => {
		if (file.type.startsWith("image/")) {
			return <img src={file.url} alt="file" className="file-preview" />;
		} else if (file.type.startsWith("video/")) {
			return <video src={file.url} controls className="file-preview"></video>;
		} else {
			return (
				<div className="file-box">
					<a href={file.url} target="_blank" rel="noopener noreferrer">
						{file.url.split("/").pop()}
					</a>
				</div>
			);
		}
	};

	return (
		<div
			ref={handMode || outlineMode ? null : (nodeEl) => {
				drag(nodeEl);
			}}
			className="node-component"
			style={{
				left: `${node.xposition}px`,
				top: `${node.yposition}px`,
				position: "absolute",
				cursor: "move",
			}}
		>
			{icons.some((icon) => icon.type === "priority") ? (
				icons.map((icon) => icon.type === "priority" && (
					<div key={icon.id} className="icon priority-icon">
						Priority: {icon.content}
						<button
							className="delete-icon-btn"
							onClick={() => removeIcon(icon.id)}
						>
							&times;
						</button>
					</div>
				))
			) : (
				<div className="add-icon-form">
					<input
						type="number"
						placeholder={"New priority..."}
						min={1}
						value={newPriority}
						onChange={(event) => setNewPriority(event.target.value)}
					/>
					<button
						onClick={() => {
							if (newPriority) {
								addIcon({
									type: "priority",
									content: `${newPriority}`
								})
							}
						}}>
						Add
					</button>
				</div>
			)}
			{isEditing ? (
				<textarea
					value={newContent}
					onChange={(e) => setNewContent(e.target.value)}
					className="node-input"
					onBlur={() => {
						setIsEditing(false);
						updateNodeContent(node.id, newContent);
					}}
					autoFocus
				/>
			) : (
				<div
					className="node-text"
					onClick={() => setIsEditing(true)}
				>
					{node.content}
				</div>
			)}

			<div className="node-files">
				{files.map((file, index) => (
					<div key={index} className="file-item">
						{renderFile(file)}
						<button onClick={() => removeFile(file.id)}>&times;</button>
					</div>
				))}
				<input
					type="file"
					ref={fileInputRef}
					onChange={(e) => {
						const file = e.target.files?.[0];
						if (file) {
							setNewFile(file);
						}
						if (fileInputRef.current) fileInputRef.current.value = "";
					}}
					style={{display: 'none'}}
				/>
				{newFile ? (
					<>
						<div className="file-item">
							<p>{newFile?.name}</p>
							<button onClick={() => setNewFile(null)} className="remove-file-btn">
								&times;
							</button>
						</div>
						<button onClick={addFile} type="button" className="file-upload-btn">
							Save
						</button>
					</>
				) : (
					<button onClick={() => fileInputRef.current?.click()} type="button" className="file-upload-btn">
						Add Files
					</button>
				)}
			</div>


			<div className="categories-container">
				{icons.map((icon) => icon.type === "category" && (
					<div key={icon.id} className="icon category-icon">
						{icon.content}
						<button
							className="delete-icon-btn"
							onClick={() => removeIcon(icon.id)}
						>
							&times;
						</button>
					</div>
				))}
			</div>
			<div className="add-icon-form">
				<input
					type="text"
					placeholder={"New category..."}
					min={1}
					value={newCategory}
					onChange={(event) => setNewCategory(event.target.value)}
				/>
				<button
					onClick={() => {
						if (newCategory) {
							addIcon({
								type: "category",
								content: newCategory
							})
						}
					}}>
					Add
				</button>
			</div>
			<button onClick={() => onDeleteNode?.(node.id)} className="delete-node-btn">
				Delete Node
			</button>
			
			{connectionOriginNodeId === null && (
				<button
					onClick={() => setConnectionOriginNodeId?.(node.id)}
					className="create-connection-btn"
				>
					Create Connection
				</button>
			)}

			{connectionOriginNodeId === node.id && (
				<div className="create-connection-info">
					Click another node to connect
				</div>
			)}

			{connectionOriginNodeId !== null && connectionOriginNodeId !== node.id && (
				<button
					onClick={() => {
						onCreateConnection?.(connectionOriginNodeId!, node.id);
						setConnectionOriginNodeId?.(null);
					}}
					className="connect-node-btn"
				>
					Connect
				</button>
			)}
		</div>
	);
};

export default NodeComponent;
