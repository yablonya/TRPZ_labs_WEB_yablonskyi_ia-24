import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import "./MapControlPanel.scss"

interface MapControlPanelProps {
	mindMapId: number;
	controlState: string;
	setControlState: Dispatch<SetStateAction<string>>;
	onAddNodeClick: () => void;
}

const MapControlPanel: FC<MapControlPanelProps> = ({ onAddNodeClick }) => {
	return (
		<div className="panel-container">
			<button onClick={onAddNodeClick}>Add node</button>
			<button>Comment</button>
		</div>
	);
};

export default MapControlPanel;
