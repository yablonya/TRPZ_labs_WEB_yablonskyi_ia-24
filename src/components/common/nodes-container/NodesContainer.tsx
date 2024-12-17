import React, {FC, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import "./NodeContainer.scss"
import NodeComponent from "@/components/common/node-component/NodeComponent";
import {DndProvider, useDrop} from "react-dnd";
import {HTML5Backend} from "react-dnd-html5-backend";

interface NodesContainerProps {
	nodes: NodeType[];
	controlState: string;
}

const NodesContainer: FC<NodesContainerProps> = ({ nodes, controlState  }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const [currentNodes, setCurrentNodes] = useState<NodeType[]>(nodes);
	const [, drop] = useDrop(() => ({
		accept: "node",
		drop: (item: { id: number }, monitor) => {
			const offset = monitor.getClientOffset();
			if (offset) {
				const newX = offset.x;
				const newY = offset.y;
				
				setCurrentNodes((prevNodes) =>
					prevNodes.map((node) =>
						node.id === item.id
							? { ...node, xposition: newX, yposition: newY }
							: node
					)
				);
			}
		},
	}));
	
	drop(containerRef);

	return (
		<div
			ref={containerRef}
			className="node-container"
		>
			{currentNodes && currentNodes.map((node, index) => (
				<NodeComponent node={node} key={index + nodes.length}/>
			))}
		</div>
	);
};

export default NodesContainer;

// const [newNodes, setNewNodes] = useState<NodeType[]>([]);
//
// useEffect(() => {
// 	const handleClick = (event: MouseEvent) => {
// 		setNewNodes([
// 			...newNodes,
// 			{
// 				content: "",
// 				xPosition: event.pageX,
// 				yPosition: event.pageY,
// 			} as NodeType
// 		])
// 	}
//
// 	if (containerRef.current && controlState === "view") {
// 		containerRef.current.removeEventListener("click", handleClick);
// 	}
//
// 	if (containerRef.current && controlState === "add-node") {
// 		containerRef.current.addEventListener("click", handleClick);
// 	}
//
// 	return () => {
// 		containerRef.current?.removeEventListener("click", handleClick);
// 	}
// }, [controlState]);
