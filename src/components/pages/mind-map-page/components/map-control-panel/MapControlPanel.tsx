import React, { FC } from 'react';
import "./MapControlPanel.scss"

interface MapControlPanelProps {
	onSave: () => void;
	onAddNode: () => void;
	handMode: boolean;
	toggleHandMode: () => void;
	outlineMode: boolean;
	toggleOutlineMode: () => void;
}

const MapControlPanel: FC<MapControlPanelProps> = ({
	onSave,
	onAddNode,
	handMode,
	toggleHandMode,
	outlineMode,
	toggleOutlineMode,
}) => (
	<div className="panel-container">
		<button onClick={onAddNode}>Add Node</button>
		<button onClick={onSave}>Save Map</button>
		<button onClick={toggleHandMode}>
			{handMode ? "Disable Hand Mode" : "Enable Hand Mode"}
		</button>
		<button onClick={toggleOutlineMode}>
			{outlineMode ? "Disable Outline Mode" : "Enable Outline Mode"}
		</button>
	</div>
);

export default MapControlPanel;
