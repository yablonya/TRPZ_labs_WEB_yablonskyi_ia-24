import React, {FC, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeComponent.scss"
import { useDrag, useDrop } from 'react-dnd';
import loginPage from "@/components/pages/login-page/LoginPage";

interface NodeComponentProps {
	node: NodeType;
}

const NodeComponent: FC<NodeComponentProps> = ({ node }) => {
	const [isEditing, setIsEditing] = useState(false);
	const [content, setContent] = useState(node.content);
	
	const [{ isDragging }, drag] = useDrag(() => ({
		type: "node",
		item: { id: node.id },
		collect: (monitor) => ({
			isDragging: monitor.isDragging(),
		}),
	}));
	
	const handleDoubleClick = () => setIsEditing(true);
	const handleBlur = () => setIsEditing(false);
	const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
		if (event.key === "Enter") setIsEditing(false);
	};

	return (
		<div
			ref={(nodeEl) => {
				drag(nodeEl);
			}}
			className="node-component"
			style={{
				left: node.xposition,
				top: node.yposition,
				position: "absolute",
				opacity: isDragging ? 0 : 1,
				cursor: "move",
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
