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
			{mindMapsList.map((mindMap) => (
				<MindMapCard 
					key={mindMap.id}
					mindMap={mindMap}
				/>
			))}
		</div>
	);
};

export default MindMapsList;
