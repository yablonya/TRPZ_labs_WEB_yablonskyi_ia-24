import React, { FC } from 'react';
import { FullMindMapType } from "@/types/FullMindMapType";
import NodesContainer from "@/components/common/nodes-container/NodesContainer";
import "./MindMapPage.scss";

interface MindMapPageProps {
	fullMindMap: FullMindMapType;
}

const MindMapPage: FC<MindMapPageProps> = ({ fullMindMap }) => {
	return (
		<div className="mind-map-page">
			<h2>{fullMindMap.mindMap.name}</h2>
			<NodesContainer nodes={fullMindMap.nodes}/>
		</div>
	);
};

export default MindMapPage;
