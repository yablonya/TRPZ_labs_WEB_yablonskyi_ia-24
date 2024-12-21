import React, {Dispatch, FC, SetStateAction, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import NodeComponent from "@/components/common/node-component/NodeComponent";
import {useDrop} from "react-dnd";

import "./NodeContainer.scss"
import {ConnectionType} from "@/types/ConnectionType";

interface NodesContainerProps {
	nodes: NodeType[];
	connections: ConnectionType[];
	handMode: boolean;
	setNodes: Dispatch<SetStateAction<NodeType[]>>;
	onDeleteConnection: (connectionId: number) => void;
	onDeleteNode?: (nodeId: number) => void;
	connectionOriginNodeId?: number | null;
	setConnectionOriginNodeId?: (id: number | null) => void;
	onCreateConnection?: (fromNodeId: number, toNodeId: number) => void;
}

const NodesContainer: FC<NodesContainerProps> = ({ 
	nodes,
	connections,
	setNodes,
	onDeleteConnection,
	onDeleteNode,
	setConnectionOriginNodeId,
	onCreateConnection,
	connectionOriginNodeId,
	handMode
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Стан для панорамування (зсув, "рух по карті")
	const [isPanning, setIsPanning] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [panX, setPanX] = useState(0);
	const [panY, setPanY] = useState(0);

	// 1) Коли користувач натискає мишею на контейнері
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// Якщо handMode ввімкнено, розпочинаємо "рух"
		if (handMode) {
			setIsPanning(true);
			// Запам'ятовуємо, де саме натиснули (беремо клієнтські координати)
			setStartX(e.clientX - panX);
			setStartY(e.clientY - panY);
		}
	};

	// 2) Коли рухаємо мишею (і якщо isPanning = true), зсуваємо контейнер
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isPanning && handMode) {
			// Обчислюємо нові panX та panY, щоб рухати весь контейнер
			setPanX(e.clientX - startX);
			setPanY(e.clientY - startY);
		}
	};

	// 3) При відпусканні кнопки миші припиняємо панорамування
	const handleMouseUp = () => {
		setIsPanning(false);
	};

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
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			// Стилі для зсуву контенту:
			style={{
				// Приклади стилів, щоб панорамування працювало:
				width: '100%',
				height: '100%',
				overflow: 'hidden',
				position: 'relative',
				// Зсуваємо через transform
				transform: `translate(${panX}px, ${panY}px)`,
				cursor: handMode ? 'grab' : 'default',
			}}
		>
			<svg className="connections-layer">
				{connections.map((connection) => {
					const midX = (connection.fromNode.xposition + connection.toNode.xposition) / 2;
					const midY = (connection.fromNode.yposition + connection.toNode.yposition) / 2;

					return (
						<g key={connection.id}>
							<line
								x1={connection.fromNode.xposition}
								y1={connection.fromNode.yposition}
								x2={connection.toNode.xposition}
								y2={connection.toNode.yposition}
								stroke="black"
								strokeWidth={2}
							/>
							{/* Невеликий текст або кнопка в середині лінії, щоб видалити її */}
							<text
								x={midX}
								y={midY}
								fill="red"
								style={{ cursor: 'pointer', fontWeight: 'bold' }}
								onClick={() => onDeleteConnection(connection.id)}
							>
								×
							</text>
						</g>
					);
				})}
			</svg>
			
			{nodes.map((node) => (
				<NodeComponent
					key={node.id}
					node={node}
					updateNodeContent={(id, content) =>
						setNodes((prev) => prev.map((n) => (n.id === id ? { ...n, content } : n)))
					}
					onDeleteNode={onDeleteNode}
					connectionOriginNodeId={connectionOriginNodeId}
					setConnectionOriginNodeId={setConnectionOriginNodeId}
					onCreateConnection={onCreateConnection}
					handMode={handMode}
				/>
			))}
		</div>
	);
};

export default NodesContainer;
