import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import NodeComponent from "@/components/common/node-component/NodeComponent";
import {useDrop} from "react-dnd";
import {ConnectionType} from "@/types/ConnectionType";

import "./NodeContainer.scss"
import { IRect } from '@/types';

interface NodesContainerProps {
	nodes: NodeType[];
	connections: ConnectionType[];
	setNodes: Dispatch<SetStateAction<NodeType[]>>;
	onDeleteConnection: (connectionId: number) => void;
	onDeleteNode?: (nodeId: number) => void;
	connectionOriginNodeId?: number | null;
	setConnectionOriginNodeId?: (id: number | null) => void;
	onCreateConnection?: (fromNodeId: number, toNodeId: number) => void;
	handMode: boolean;
	outlineMode: boolean;
	containerSize: number;
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
	handMode,
	outlineMode,
	containerSize
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	
	const [isPanning, setIsPanning] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [panX, setPanX] = useState(0);
	const [panY, setPanY] = useState(0);
	const [isDrawing, setIsDrawing] = useState(false);
	const [rect, setRect] = useState<IRect | null>(null);
	const [startDrawX, setStartDrawX] = useState(0);
	const [startDrawY, setStartDrawY] = useState(0);
	const [currentRect, setCurrentRect] = useState<IRect | null>(null);

	useEffect(() => {
		const centerX = -(containerSize / 2) + window.innerWidth / 2;
		const centerY = -(containerSize / 2) + window.innerHeight / 2;

		setPanX(centerX);
		setPanY(centerY);
	}, []);

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
	
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		if (handMode) {
			setIsPanning(true);
			setStartX(e.clientX - panX);
			setStartY(e.clientY - panY);
			return;
		}
		
		if (outlineMode) {
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			
			setIsDrawing(true);
			setStartDrawX(e.clientX - rect.left);
			setStartDrawY(e.clientY - rect.top);
			setCurrentRect({
				x: e.clientX - rect.left,
				y: e.clientY - rect.top,
				width: 0,
				height: 0,
			});
			return;
		}
		
		
	};

	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		if (isPanning && handMode) {
			setPanX(e.clientX - startX);
			setPanY(e.clientY - startY);
			return;
		}

		if (isDrawing && outlineMode && currentRect) {
			const rect = containerRef.current?.getBoundingClientRect();
			if (!rect) return;
			
			const offsetX = e.clientX - rect.left;
			const offsetY = e.clientY - rect.top;

			const newWidth = offsetX - startDrawX;
			const newHeight = offsetY - startDrawY;

			setCurrentRect({
				...currentRect,
				x: Math.min(startDrawX, offsetX),
				y: Math.min(startDrawY, offsetY),
				width: Math.abs(newWidth),
				height: Math.abs(newHeight),
			});
		}
	};
	
	const handleMouseUp = () => {
		if (isPanning) {
			setIsPanning(false);
		}
		
		if (isDrawing && outlineMode && currentRect) {
			setRect(currentRect);
			setCurrentRect(null);
			setIsDrawing(false);
		}
	};

	const updateNodePosition = (id: number, x: number, y: number) => {
		setNodes((prevNodes) =>
			prevNodes.map((node) => (node.id === id ? { ...node, xposition: x, yposition: y } : node))
		);
	};
	
	const updateNodeContent = (id: number, content: string) =>
		setNodes((prev) => prev.map((n) => (n.id === id ? {...n, content} : n)))

	drop(containerRef);

	return (
		<div
			ref={containerRef}
			className="node-container"
			onMouseDown={handleMouseDown}
			onMouseMove={handleMouseMove}
			onMouseUp={handleMouseUp}
			style={{
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
							<text
								x={midX}
								y={midY}
								fill="red"
								style={{cursor: 'pointer', fontWeight: 'bold'}}
								onClick={() => onDeleteConnection(connection.id)}
							>
								×
							</text>
						</g>
					);
				})}
			</svg>

			{rect && (
				<div
					className="created-selection"
					style={{
						left: rect.x,
						top: rect.y,
						width: rect.width,
						height: rect.height,
					}}
				>
					<button
						onClick={() => setRect(null)}
						className="remove-selection-btn"
					>
						&times;
					</button>
				</div>
			)}

			{currentRect && (
				<div
					className="current-selection"
					style={{
						left: currentRect.x,
						top: currentRect.y,
						width: currentRect.width,
						height: currentRect.height,
					}}
				/>
			)}

			{nodes.map((node) => (
				<NodeComponent
					key={node.id}
					node={node}
					updateNodeContent={(id, content) => updateNodeContent(id, content)}
					onDeleteNode={onDeleteNode}
					connectionOriginNodeId={connectionOriginNodeId}
					setConnectionOriginNodeId={setConnectionOriginNodeId}
					onCreateConnection={onCreateConnection}
					handMode={handMode}
					outlineMode={outlineMode}
				/>
			))}
		</div>
	);
};

export default NodesContainer;
