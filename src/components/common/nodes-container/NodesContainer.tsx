import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import { NodeType } from "@/types/NodeType";
import NodeComponent from "@/components/common/node-component/NodeComponent";
import {useDrop} from "react-dnd";

import "./NodeContainer.scss"
import {ConnectionType} from "@/types/ConnectionType";

interface IRect {
	x: number;
	y: number;
	width: number;
	height: number;
}

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
	outlineMode
}) => {
	const containerRef = useRef<HTMLDivElement | null>(null);

	// Стан для панорамування (зсув, "рух по карті")
	const [isPanning, setIsPanning] = useState(false);
	const [startX, setStartX] = useState(0);
	const [startY, setStartY] = useState(0);
	const [panX, setPanX] = useState(0);
	const [panY, setPanY] = useState(0);

	const containerSize = 100000;

	useEffect(() => {
		const centerX = -(containerSize / 2) + window.innerWidth / 2;
		const centerY = -(containerSize / 2) + window.innerHeight / 2;

		setPanX(centerX);
		setPanY(centerY);
	}, []);

	// Стан для "режиму обведення"
	const [isDrawing, setIsDrawing] = useState(false);
	const [rect, setRect] = useState<IRect | null>(null);

	// Координати початку малювання
	const [startDrawX, setStartDrawX] = useState(0);
	const [startDrawY, setStartDrawY] = useState(0);

	// Поточний "тимчасовий" прямокутник, поки ми тягнемо мишу
	const [currentRect, setCurrentRect] = useState<IRect | null>(null);

	// 1) Коли користувач натискає мишею на контейнері
	// Функція, що викликається при onMouseDown на контейнері
	const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
		// Якщо включено handMode — панорамування, як і раніше
		if (handMode) {
			setIsPanning(true);
			setStartX(e.clientX - panX);
			setStartY(e.clientY - panY);
			return;
		}

		// Якщо увімкнено outlineMode — починаємо малювати прямокутник
		if (outlineMode) {
			setIsDrawing(true);
			// Запам'ятовуємо початкові координати для обведення
			setStartDrawX(e.clientX);
			setStartDrawY(e.clientY);
			setCurrentRect({
				x: e.clientX,
				y: e.clientY,
				width: 0,
				height: 0,
			});
			return;
		}

		// Якщо жоден режим не увімкнено — нічого особливого не робимо
	};

// Функція, що викликається при onMouseMove
	const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
		// Якщо перетягуємо мапу:
		if (isPanning && handMode) {
			setPanX(e.clientX - startX);
			setPanY(e.clientY - startY);
			return;
		}

		// Якщо малюємо прямокутник:
		if (isDrawing && outlineMode && currentRect) {
			const newWidth = e.clientX - startDrawX;
			const newHeight = e.clientY - startDrawY;

			setCurrentRect({
				...currentRect,
				x: Math.min(startDrawX, e.clientX),
				y: Math.min(startDrawY, e.clientY),
				width: Math.abs(newWidth),
				height: Math.abs(newHeight),
			});
		}
	};

// Функція, що викликається при onMouseUp
	const handleMouseUp = () => {
		// Завершуємо панорамування:
		if (isPanning) {
			setIsPanning(false);
		}

		// Завершуємо малювання прямокутника:
		if (isDrawing && outlineMode && currentRect) {
			// Додаємо поточний прямокутник у масив "готових"
			setRect(currentRect);

			// Скидаємо тимчасовий прямокутник:
			setCurrentRect(null);
			setIsDrawing(false);
		}
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

			{rect && (
				<div
					style={{
						position: 'absolute',
						border: '2px dashed black',
						left: rect.x,
						top: rect.y,
						width: rect.width,
						height: rect.height,
						// pointerEvents: 'none' зазвичай для того, щоб не заважати вузлам,
						// але нам треба, щоб кнопка всередині приймала кліки:
						// Тож залишимо pointerEvents: 'auto'
						pointerEvents: 'auto',
					}}
				>
					{/* Кнопка для видалення (хрестик) у правому верхньому куті */}
					<button
						onClick={() => setRect(null)}
						style={{
							position: 'absolute',
							top: 0,
							right: 0,
							backgroundColor: 'red',
							color: 'white',
							border: 'none',
							cursor: 'pointer',
						}}
					>
						×
					</button>
				</div>
			)}

			{/* Відображаємо поточний "тимчасовий" прямокутник (якщо є) */}
			{currentRect && (
				<div
					style={{
						position: 'absolute',
						border: '1px solid black',
						left: currentRect.x,
						top: currentRect.y,
						width: currentRect.width,
						height: currentRect.height,
						pointerEvents: 'none',
					}}
				/>
			)}

			{nodes.map((node) => (
				<NodeComponent
					key={node.id}
					node={node}
					updateNodeContent={(id, content) =>
						setNodes((prev) => prev.map((n) => (n.id === id ? {...n, content} : n)))
					}
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
