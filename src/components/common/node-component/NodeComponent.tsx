import React, {ChangeEvent, FC, FormEvent, useCallback, useEffect, useRef, useState} from 'react';
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
import FileComponent from "@/components/common/file-component/FileComponent";

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
	const [newPriority, setNewPriority] = useState("");
	const [newCategory, setNewCategory] = useState("");
	const [showPriorityForm, setShowPriorityForm] = useState(false);
	const [showCategoryForm, setShowCategoryForm] = useState(false);
	
	const [isEditing, setIsEditing] = useState(false);
	const [newContent, setNewContent] = useState(node.content);
	
	const [nodeWidth, setNodeWidth] = useState<number>(200);
	
	const [isResizing, setIsResizing] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startWidth, setStartWidth] = useState(0);
	
	const fileInputRef = useRef<HTMLInputElement>(null);

	const fetchNodeComponents = useCallback(async () => {
		try {
			const filesData = await getNodeFiles(node.id);
			setFiles(filesData);

			const iconsData = await getNodeIcons(node.id);
			setIcons(iconsData);
		} catch (error) {
			console.error("Error fetching data for node:", error);
		}
	}, [node.id]);

	useEffect(() => {
		fetchNodeComponents();
	}, [fetchNodeComponents]);
	
	const [, drag] = useDrag(() => ({
		type: "node",
		item: { id: node.id },
		canDrag: () => !isResizing,
	}));
	
	const handleResizeMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		e.stopPropagation();
		e.preventDefault();
		setIsResizing(true);
		setStartX(e.clientX);
		setStartWidth(nodeWidth);
	};

	useEffect(() => {
		if (!isResizing) return;

		const handleMouseMove = (e: MouseEvent) => {
			const deltaX = e.clientX - startX;
			setNodeWidth(startWidth + deltaX);
		};

		const handleMouseUp = () => {
			setIsResizing(false);
		};

		document.addEventListener("mousemove", handleMouseMove);
		document.addEventListener("mouseup", handleMouseUp);

		return () => {
			document.removeEventListener("mousemove", handleMouseMove);
			document.removeEventListener("mouseup", handleMouseUp);
		};
	}, [isResizing, startX, startWidth]);
	
	const handlePriorityFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (newPriority.trim()) {
			addIcon({ type: "priority", content: newPriority });
			setShowPriorityForm(false);
		}
	};

	const handleCategoryFormSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (newCategory.trim()) {
			addIcon({ type: "category", content: newCategory });
			setShowCategoryForm(false);
		}
	};

	const addIcon = async (icon: NewNodeIcon) => {
		try {
			await createNodeIcon(node.id, icon);

			if (icon.type === "priority") {
				setNewPriority("");
			} else if (icon.type === "category") {
				setNewCategory("");
			}
			await fetchNodeComponents();
		} catch (error) {
			console.error("Error adding icon:", error);
		}
	};

	const removeIcon = async (iconId: string) => {
		try {
			await deleteNodeIcon(node.id, iconId);
			setIcons((prev) => prev.filter((icon) => icon.id !== iconId));
		} catch (error) {
			console.error("Error removing icon:", error);
		}
	};
	
	const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (!file) return;

		try {
			const uploadedFile = await uploadFile(file);
			await addFileToNode(node.id, uploadedFile);
			await fetchNodeComponents();
		} catch (error) {
			console.error("Error adding file:", error);
		} finally {
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
		}
	};

	const removeFile = async (fileId: string) => {
		try {
			await deleteNodeFile(node.id, fileId);
			setFiles((prev) => prev.filter((file) => file.id !== fileId));
		} catch (error) {
			console.error("Error removing file:", error);
		}
	};
	
	return (
		<div
			ref={mode ? null : (nodeEl) => {
				drag(nodeEl)
			}}
			className="node-component"
			style={{
				left: `${node.xposition}px`,
				top: `${node.yposition}px`,
				width: `${nodeWidth}px`,
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
					{icons.map(
						(icon) =>
							icon.type === "priority" && (
								<div
									key={icon.id}
									className="icon priority-icon"
									style={{
										backgroundColor:
											+icon.content === 1
												? "crimson"
												: +icon.content < 5
													? "goldenrod"
													: +icon.content < 10
														? "forestgreen"
														: "blue",
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
							)
					)}
				</div>
			)}

			{showPriorityForm && (
				<form className="add-icon-form" onSubmit={handlePriorityFormSubmit}>
					<input
						type="number"
						placeholder="New priority..."
						min={1}
						value={newPriority}
						onChange={(event) => setNewPriority(event.target.value)}
					/>
					<button type="button" onClick={() => setShowPriorityForm(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
							<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5" d="M20 20L4 4m16 0L4 20"/>
						</svg>
					</button>
					<button type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16">
							<path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
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
				<div className="node-text" onClick={() => setIsEditing(true)}>
					{node.content}
				</div>
			)}

			{files.length > 0 && (
				<div className="files-container">
					{files.map((file) => (
						<FileComponent key={file.id} file={file} onRemoveFile={removeFile} />
					))}
				</div>
			)}

			<input
				type="file"
				ref={fileInputRef}
				onChange={handleFileChange}
				style={{display: "none"}}
			/>

			{icons.some((icon) => icon.type === "category") && (
				<div className="categories-container">
					{icons.map(
						(icon) =>
							icon.type === "category" && (
								<div key={icon.id} className="icon category-icon">
									{icon.content}
									<button
										className="delete-icon-btn"
										onClick={() => removeIcon(icon.id)}
									>
										<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
											<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5"
											      d="M20 20L4 4m16 0L4 20"/>
										</svg>
									</button>
								</div>
							)
					)}
				</div>
			)}

			{showCategoryForm && (
				<form className="add-icon-form" onSubmit={handleCategoryFormSubmit}>
					<input
						type="text"
						placeholder="New category..."
						value={newCategory}
						onChange={(event) => setNewCategory(event.target.value)}
					/>
					<button type="button" onClick={() => setShowCategoryForm(false)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
							<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5" d="M20 20L4 4m16 0L4 20"/>
						</svg>
					</button>
					<button type="submit">
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 16 16">
							<path fill="none" stroke="black" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
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
			
			<div
				className="resize-trigger"
				onMouseDown={handleResizeMouseDown}
			/>
		</div>
	);
};

export default NodeComponent;
