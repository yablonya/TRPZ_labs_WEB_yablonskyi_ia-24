import React, {FC, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import { useDrag } from 'react-dnd';
import "./NodeComponent.scss"
import {UploadedFile} from "@/types/UploadedFile";

interface NodeFile {
	id: number;
	url: string;
	type: string;
}

interface NewNodeFile {
	id: number;
	url: string;
	type: string;
}

interface NodeIcon {
	id: number;
	type: string;
	content: string;
}

interface NewNodeIcon {
	type: string;
	content: string;
}

interface NodeComponentProps {
	node: NodeType;
	updateNodeContent: (id: number, content: string) => void;
}

const NodeComponent: FC<NodeComponentProps> = ({ node, updateNodeContent }) => {
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

	const fetchFilesAndIcons = async () => {
		try {
			const filesRes = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/files`, {
				method: "GET",
				credentials: "include",
			});
			if (filesRes.ok) {
				const filesData = await filesRes.json();
				setFiles(filesData);
			} else {
				console.error("Failed to fetch files for node:", node.id);
			}

			const iconsRes = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/icons`, {
				method: "GET",
				credentials: "include",
			});
			if (iconsRes.ok) {
				const iconsData = await iconsRes.json();
				setIcons(iconsData);
			} else {
				console.error("Failed to fetch icons for node:", node.id);
			}
		} catch (error) {
			console.error("Error fetching data for node:", error);
		}
	};

	useEffect(() => {
		fetchFilesAndIcons();
	}, [node.id]);

	const uploadFile = async (): Promise<UploadedFile> => {
		const reader = new FileReader();
		reader.readAsDataURL(newFile!);
		
		return new Promise<UploadedFile>((resolve) => {
			reader.onloadend = async () => {
				const res = await fetch('/api/upload', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ data: reader.result }),
				});
				const { url } = await res.json();
				resolve({ url, type: newFile!.type });
			};
		});
	};

	const addIcon = async (icon: NewNodeIcon) => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/add-icon`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(icon),
			});
			if (res.ok) {
				if (icon.type === "priority") {
					setNewPriority("")
				} else {
					setNewCategory("")
				}
				fetchFilesAndIcons();
			} else {
				console.error("Failed to add icon:", icon);
			}
		} catch (error) {
			console.error("Error adding icon:", error);
		}
	};

	const addFile = async () => {
		let uploadedFile;
		
		if (newFile) {
			uploadedFile = await uploadFile()
		}
		
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/add-file`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				credentials: "include",
				body: JSON.stringify(uploadedFile),
			});
			if (res.ok) {
				setNewFile(null)
				fetchFilesAndIcons();
			} else {
				console.error("Failed to add file:", uploadedFile);
			}
		} catch (error) {
			console.error("Error adding file:", error);
		}
	};

	const removeIcon = async (iconId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/remove-icon?iconId=${iconId}`, {
				method: "POST",
				credentials: "include",
			});
			if (res.ok) {
				setIcons((prevIcons) => prevIcons.filter((icon) => icon.id !== iconId));
			} else {
				console.error("Failed to remove icon with id:", iconId);
			}
		} catch (error) {
			console.error("Error removing icon:", error);
		}
	};

	const removeFile = async (fileId: number) => {
		try {
			const res = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/remove-file?fileId=${fileId}`, {
				method: "POST",
				credentials: "include",
			});
			if (res.ok) {
				setFiles((prevFiles) => prevFiles.filter((file) => file.id !== fileId));
			} else {
				console.error("Failed to remove file with id:", fileId);
			}
		} catch (error) {
			console.error("Error removing file:", error);
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
			ref={(nodeEl) => {
				drag(nodeEl);
			}}
			className="node-component"
			style={{
				left: `${node.xposition}px`,
				top: `${node.yposition}px`,
				position: "absolute",
				opacity: isDragging ? 0 : 1,
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
		</div>
	);
};

export default NodeComponent;
