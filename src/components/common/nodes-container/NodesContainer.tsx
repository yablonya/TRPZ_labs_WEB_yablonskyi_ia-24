import React, { FC } from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeContainer.scss"
import NodeComponent from "@/components/common/node-component/NodeComponent";

interface NodesContainerProps {
	nodes: NodeType[];
}

const NodesContainer: FC<NodesContainerProps> = ({ nodes }) => {
	return (
		<div className="node-container">
			{nodes && nodes.map((node) => (
				<NodeComponent node={node} key={node.id} />
			))}
		</div>
	);
};

export default NodesContainer;
