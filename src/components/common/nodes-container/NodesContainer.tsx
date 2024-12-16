import React, {FC, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeContainer.scss"
import NodeComponent from "@/components/common/node-component/NodeComponent";

interface NodesContainerProps {
	nodes: NodeType[];
	controlState: string;
}

const NodesContainer: FC<NodesContainerProps> = ({ nodes, controlState  }) => {
	const containerRef = useRef<HTMLDivElement>(null);
	const [newNodes, setNewNodes] = useState<NodeType[]>([]);

	useEffect(() => {
		const handleClick = (event: MouseEvent) => {
			setNewNodes([
				...newNodes,
				{
					content: "",
					xPosition: event.pageX,
					yPosition: event.pageY,
				} as NodeType
			])
		}

		if (containerRef.current && controlState === "view") {
			containerRef.current.removeEventListener("click", handleClick);
		}

		if (containerRef.current && controlState === "add-node") {
			containerRef.current.addEventListener("click", handleClick);
		}
		
		return () => {
			containerRef.current?.removeEventListener("click", handleClick);
		}
	}, [controlState]);
	
	
	return (
		<div 
			ref={containerRef}
			className="node-container"
		>
			{nodes && nodes.map((node, index) => (
				<NodeComponent node={node} key={index + nodes.length} />
			))}
			{newNodes && newNodes.map((node) => (
				<NodeComponent node={node} key={node.id} />
			))}
		</div>
	);
};

export default NodesContainer;
