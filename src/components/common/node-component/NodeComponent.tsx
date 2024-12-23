import React, {ChangeEvent, FC, FormEvent, useEffect, useRef, useState} from 'react';
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
import NodeOptionsDropdown from "@/components/common/node-options-dropdown/NodeOptionsDropdown";

interface NodeComponentProps {
	node: NodeType;
	updateNodeContent: (id: string, content: string) => void;
	onDeleteNode: (nodeId: string) => void;
	connectionOriginNodeId: string | null;
	setConnectionOriginNodeId: (id: string | null) => void;
	onCreateConnection: (fromNodeId: string, toNodeId: string) => void;
	mode: "hand" | "outline" | null;
}

const NodeComponent: FC<NodeComponentProps> = ({ 
	node,
	updateNodeContent,
	onDeleteNode,
	setConnectionOriginNodeId,
	connectionOriginNodeId,
	onCreateConnection,
	mode,
}) => {
	const [icons, setIcons] = useState<NodeIcon[]>([]);
	const [files, setFiles] = useState<NodeFile[]>([]);
	const [newPriority, setNewPriority] = useState<string>("");
	const [newCategory, setNewCategory] = useState<string>("");
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [isEditing, setIsEditing] = useState(false);
	const [newContent, setNewContent] = useState(node.content);
	const [, drag] = useDrag(() => ({
		type: "node",
		item: { id: node.id },
	}));
	const [showPriorityForm, setShowPriorityForm] = useState(false);
	const [showCategoryForm, setShowCategoryForm] = useState(false);

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
	
	const handlePriorityFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		
		if (newPriority !== "" && newPriority !== undefined) {
			addIcon({
				type: "priority",
				content: `${newPriority}`
			})
			
			setShowPriorityForm(false);
		}
	}

	const handleCategoryFormSubmit = (e: FormEvent) => {
		e.preventDefault();

		if (newCategory !== "" && newCategory !== undefined) {
			addIcon({
				type: "category",
				content: `${newCategory}`
			})

			setShowCategoryForm(false);
		}
	}
	
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

	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const uploadedFile = await uploadFile(file);
			await addFileToNode(node.id, uploadedFile);
			
			fetchNodeComponents();
		} catch (error) {
			console.error('Error adding file:', error);
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = '';
			}
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
			ref={mode ? null : (nodeEl) => {
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
			<NodeOptionsDropdown
				node={node}
				hasPriority={icons.some((icon) => icon.type === "priority")}
				showPriorityForm={showPriorityForm}
				setShowPriorityForm={setShowPriorityForm}
				showCategoryForm={showCategoryForm}
				setShowCategoryForm={setShowCategoryForm}
				connectionOriginNodeId={connectionOriginNodeId}
				setConnectionOriginNodeId={setConnectionOriginNodeId}
				onAddFile={() => fileInputRef.current?.click()}
				onDeleteNode={onDeleteNode}
			/>

			{icons.some((icon) => icon.type === "priority") && (
				<div className="priority-container">
					{icons.map((icon) => icon.type === "priority" && (
						<div 
							key={icon.id} 
							className="icon priority-icon"
							style={{
								backgroundColor: 
									+icon.content === 1 ? "crimson" 
										: (+icon.content > 1 && +icon.content < 5 ? "goldenrod" 
											: (+icon.content >= 5 ? "forestgreen" : "blue")),
							}}
						>
							Priority: {icon.content}
							<button
								className="delete-icon-btn"
								onClick={() => removeIcon(icon.id)}
							>
								&times;
							</button>
						</div>
					))}
				</div>
			)}
			{showPriorityForm && (
				<form className="add-icon-form" onSubmit={handlePriorityFormSubmit}>
					<input
						type="number"
						placeholder={"New priority..."}
						min={1}
						value={newPriority}
						onChange={(event) => setNewPriority(event.target.value)}
					/>
					<button type={"button"} onClick={() => setShowPriorityForm(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
							<path fill="currentColor"
							      d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
						</svg>
					</button>
					<button type={"submit"}>
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16">
							<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
							      d="m2.75 8.75l3.5 3.5l7-7.5"/>
						</svg>
					</button>
				</form>
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

			{files.map((file) => {
				// Припустимо, що file має поля "url" та "type"
				if (file.type.startsWith('image/')) {
					return (
						<div key={file.id} className="file-item">
							<img src={file.url} alt="file" className="file-preview" />
							<button onClick={() => removeFile(file.id)}>&times;</button>
						</div>
					);
				} else if (file.type.startsWith('video/')) {
					return (
						<div key={file.id} className="file-item">
							<video
								src={file.url}
								className="file-preview"
								controls
							/>
							<button onClick={() => removeFile(file.id)}>&times;</button>
						</div>
					);
				} else {
					return (
						<div key={file.id} className="file-item">
							<div className="file-box">
								<a href={file.url} target="_blank" rel="noopener noreferrer">
									{file.url.split('/').pop()}
								</a>
							</div>
							<button onClick={() => removeFile(file.id)}>&times;</button>
						</div>
					);
				}
			})}
			
			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{display: 'none'}}
			/>

			{icons.some((icon) => icon.type === "category") && (
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
			)}

			{showCategoryForm && (
				<form className="add-icon-form" onSubmit={handleCategoryFormSubmit}>
					<input
						type="text"
						placeholder={"New category..."}
						min={1}
						value={newCategory}
						onChange={(event) => setNewCategory(event.target.value)}
					/>
					<button type={"button"} onClick={() => setShowCategoryForm(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24">
							<path fill="currentColor"
							      d="m12 13.4l-4.9 4.9q-.275.275-.7.275t-.7-.275t-.275-.7t.275-.7l4.9-4.9l-4.9-4.9q-.275-.275-.275-.7t.275-.7t.7-.275t.7.275l4.9 4.9l4.9-4.9q.275-.275.7-.275t.7.275t.275.7t-.275.7L13.4 12l4.9 4.9q.275.275.275.7t-.275.7t-.7.275t-.7-.275z"/>
						</svg>
					</button>
					<button type={"submit"}>
						<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 16 16">
							<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
							      d="m2.75 8.75l3.5 3.5l7-7.5"/>
						</svg>
					</button>
				</form>
			)}

			{connectionOriginNodeId === node.id && (
				<button
					className="connection-button"
					onClick={() => setConnectionOriginNodeId(null)}
				>
					Cancel connection
				</button>
			)}

			{connectionOriginNodeId !== null && connectionOriginNodeId !== node.id && (
				<button
					onClick={() => {
						onCreateConnection(connectionOriginNodeId!, node.id);
						setConnectionOriginNodeId(null);
					}}
					className="connection-button"
				>
					Connect
				</button>
			)}
		</div>
	);
};

export default NodeComponent;
