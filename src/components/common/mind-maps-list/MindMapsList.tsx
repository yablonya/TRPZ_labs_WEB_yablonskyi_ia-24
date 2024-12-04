import React, { FC } from 'react';
import { MindMapType } from "@/types/MindMapType";
import MindMapCard from "@/components/common/mind-map-card/MindMapCard";
import "./MindMapsList.scss"

interface MindMapsListProps {
	mindMapsList: MindMapType[];
}

const MindMapsList: FC<MindMapsListProps> = ({ mindMapsList }) => {
	return (
		<div className="mind-maps-list">
			{mindMapsList && mindMapsList.map((mindMap) => (
				<MindMapCard mindMap={mindMap} key={mindMap.id} />
			))}
		</div>
	);
};

export default MindMapsList;
