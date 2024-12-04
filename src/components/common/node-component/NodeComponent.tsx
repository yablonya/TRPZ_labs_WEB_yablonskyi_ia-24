import React, { FC } from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeComponent.scss"

interface NodeComponentProps {
	node: NodeType;
}

const NodeComponent: FC<NodeComponentProps> = ({ node }) => {
	return (
		<div 
			className="node-component"
			style={{
				left: node.xPosition,
				top: node.yPosition,
			}}
		>
			{node.content}
		</div>
	);
};

export default NodeComponent;
