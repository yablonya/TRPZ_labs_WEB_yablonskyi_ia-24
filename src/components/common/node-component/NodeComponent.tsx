import React, {FC, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeComponent.scss"
import {NewNodeType} from "@/types/NewNodeType";

interface NodeComponentProps {
	node: NodeType;
}

const NodeComponent: FC<NodeComponentProps> = ({ node }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(node.content);

	const handleDoubleClick = () => {
		setIsEditing(true);
	};

	const handleBlur = () => {
		setIsEditing(false);
	};

	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") {
			setIsEditing(false);
		}
	};

	return (
		<div
			className="node-component"
			style={{
				left: node.xPosition,
				top: node.yPosition,
				position: "absolute",
			}}
			onDoubleClick={handleDoubleClick}
		>
			{isEditing ? (
				<input
					type="text"
					value={content}
					onChange={(e) => setContent(e.target.value)}
					onBlur={handleBlur}
					onKeyDown={handleKeyDown}
					autoFocus
					className="node-input"
				/>
			) : (
				<div className="node-text">{content}</div>
			)}
		</div>
	);
};

export default NodeComponent;
