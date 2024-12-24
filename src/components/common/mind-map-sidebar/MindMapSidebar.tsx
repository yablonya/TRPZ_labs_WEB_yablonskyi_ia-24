import React, { FC } from 'react';
import {MindMapType} from "@/types";
import "./MindMapSidebar.scss";
import {deleteMindMap} from "@/services/mindMapService";

interface MindMapSidebarProps {
	allMindMaps: MindMapType[]
	style?: React.CSSProperties;
}

const MindMapSidebar: FC<MindMapSidebarProps> = ({ allMindMaps, style }) => {
	const handleDeleteMindMap = async (mindMapId: string) => {
		try {
			await deleteMindMap(mindMapId);
		} catch (error) {
			console.error('Error fetching user:', error);
		}
	};
	
	return (
		<div 
			className="mind-map-sidebar"
			style={style}
		>
			{allMindMaps && allMindMaps.map((map) => (
				<div key={map.id}>
					<a 
						href={`/mind-map/${map.id}`}
						className="mind-map-link"
					>
						{map.name}
					</a>
					<a 
						href={"/"} 
						onClick={() => handleDeleteMindMap(map.id)}
						className="delete-btn"
					>
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
							<path fill="currentColor"
							      d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"/>
						</svg>
					</a>
				</div>
			))}
		</div>
	);
};

export default MindMapSidebar;
