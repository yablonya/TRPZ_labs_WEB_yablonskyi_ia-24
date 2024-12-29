import {ConnectionType, NodeFile, NodeIcon, NodeType} from "@/types";
import React, {FC, useEffect, useState} from "react";
import "../NodeContainer.scss";
import PreviewNodeComponent from "@/components/common/node-component/preview-node-component/PreviewNodeComponent";

interface PreviewNodesContainerProps {
	nodes: NodeType[];
	connections: ConnectionType[];
	icons: NodeIcon[];
	files: NodeFile[];
	containerSize: number;
}

const PreviewNodesContainer: FC<PreviewNodesContainerProps> = ({
	nodes,
	connections,
	icons,
	files,
	containerSize
}) => {
	const [panX, setPanX] = useState(0);
	const [panY, setPanY] = useState(0);

	useEffect(() => {
		const centerX = -(containerSize / 2) + window.innerWidth / 2;
		const centerY = -(containerSize / 2) + window.innerHeight / 2;

		setPanX(centerX);
		setPanY(centerY);
	}, []);

	return (
		<div
			className="node-container"
			style={{
				transform: `translate(${panX}px, ${panY}px)`,
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
						</g>
					);
				})}
			</svg>

			{nodes.map((node) => (
				<PreviewNodeComponent
					key={node.id}
					node={node}
					icons={icons.filter((icon) => icon.node.id === node.id)}
					files={files.filter((file) => file.node.id === node.id)}
				/>
			))}
		</div>
	);
};

export default PreviewNodesContainer;
