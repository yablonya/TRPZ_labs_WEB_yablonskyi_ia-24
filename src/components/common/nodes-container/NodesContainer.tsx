import React, {Dispatch, FC, SetStateAction, useRef} from 'react';
import { NodeType } from "@/types/NodeType";
import NodeComponent from "@/components/common/node-component/NodeComponent";
import {useDrop} from "react-dnd";

import "./NodeContainer.scss"

interface NodesContainerProps {
	nodes: NodeType[];
	setNodes: Dispatch<SetStateAction<NodeType[]>>;
}

const NodesContainer: FC<NodesContainerProps> = ({ nodes, setNodes }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	const updateNodePosition = (id: number, x: number, y: number) => {
		setNodes((prevNodes) =>
			prevNodes.map((node) => (node.id === id ? { ...node, xposition: x, yposition: y } : node))
		);
	};

	const [, drop] = useDrop({
		accept: "node",
		drop: (item: { id: number }, monitor) => {
			const offset = monitor.getClientOffset();
			const bounds = containerRef.current?.getBoundingClientRect();
			if (offset && bounds) {
				updateNodePosition(item.id, offset.x - bounds.left, offset.y - bounds.top);
			}
		},
	});

	drop(containerRef);

	return (
		<div 
			ref={containerRef} 
			className="node-container"
		>
			{nodes.map((node) => (
				<NodeComponent key={node.id} node={node} updateNodeContent={(id, content) =>
					setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)))
				} />
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
