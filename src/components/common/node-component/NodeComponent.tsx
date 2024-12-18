import React, {FC, useEffect, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import { useDrag } from 'react-dnd';
import "./NodeComponent.scss"

interface NodeFile {
	url: string;
	type: string;
}

interface NodeComponentProps {
	node: NodeType;
	updateNodeContent: (id: number, content: string) => void;
}

const NodeComponent: FC<NodeComponentProps> = ({ node, updateNodeContent }) => {
	const [files, setFiles] = useState<NodeFile[]>([]);
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "node",
		item: { id: node.id },
		collect: (monitor) => ({ isDragging: monitor.isDragging() }),
	}));
	
	useEffect(() => {
		const fetchFiles = async () => {
			try {
				const res = await fetch(`http://localhost:8080/api/mind-map/node/${node.id}/files`, {
					method: "GET",
					credentials: "include",
				});
				if (res.ok) {
					const data = await res.json();
					setFiles(data);
				} else {
					console.error("Failed to fetch files for node:", node.id);
				}
			} catch (error) {
				console.error("Error fetching files:", error);
			}
		};

		fetchFiles();
	}, [node.id]);

	const renderFile = (file: NodeFile) => {
		if (file.url) {
			console.log(file.url.split("/"))
		}
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
				drag(nodeEl)
			}}
			className="node-component"
			style={{
				left: `${node.xposition}px`,
				top: `${node.yposition}px`,
				position: "absolute",
				opacity: isDragging ? 0 : 1,
				cursor: "move",
			}}
			onDoubleClick={() => updateNodeContent(node.id, prompt("Enter new content:", node.content) || node.content)}
		>
			<div className="node-text">{node.content}</div>
			<div className="node-files">
				{files.map((file, index) => (
					<div key={index} className="file-item">
						{renderFile(file)}
					</div>
				))}
			</div>
		</div>
	);
};

export default NodeComponent;
