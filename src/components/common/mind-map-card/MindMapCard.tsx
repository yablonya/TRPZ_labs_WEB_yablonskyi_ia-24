import React, {FC} from 'react';
import {MindMapType} from "@/types/MindMapType";
import "./MindMapCard.scss"

interface MindMapProps {
	mindMap: MindMapType;
}

const MindMapCard: FC<MindMapProps> = ({ mindMap }) => {
	return (
		<a 
			href={`/mind-map/${mindMap.id}`}
			className="mind-map-card"
		>
			<h2>
				{mindMap.name}
			</h2>
		</a>
	)
		;
};

export default MindMapCard;
