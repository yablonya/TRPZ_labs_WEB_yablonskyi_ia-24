import React, { FC } from 'react';
import "./MapControlPanel.scss"

interface MapControlPanelProps {
	onSave: () => void;
	onAddNode: () => void;
}

const MapControlPanel: FC<MapControlPanelProps> = ({ onSave, onAddNode }) => (
	<div className="panel-container">
		<button onClick={onAddNode}>Add Node</button>
		<button onClick={onSave}>Save Map</button>
	</div>
);

export default MapControlPanel;
