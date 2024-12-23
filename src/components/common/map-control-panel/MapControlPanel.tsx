import React, { FC } from 'react';
import "./MapControlPanel.scss"

interface MapControlPanelProps {
	mode: "hand" | "outline" | null;
	toggleOutlineMode: () => void;
	toggleHandMode: () => void;
	onAddNode: () => void;
	onSave: () => void;
	onHistory: () => void;
}

const MapControlPanel: FC<MapControlPanelProps> = ({
	mode,
	toggleHandMode,
	toggleOutlineMode,
	onAddNode,
	onSave,
	onHistory,
}) => (
	<div className="panel-container">
		<button 
			title={"Hand mode"} 
			onClick={toggleHandMode}
			style={mode === "hand" ? {backgroundColor: "rgba(0, 0, 0, 0.06)"} : {}}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
				<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
					<path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-6.5v-2a1.5 1.5 0 1 1 3 0V12m0-6.5a1.5 1.5 0 0 1 3 0V12"/>
					<path
						d="M17 7.5a1.5 1.5 0 0 1 3 0V16a6 6 0 0 1-6 6h-2h.208a6 6 0 0 1-5.012-2.7L7 19q-.468-.718-3.286-5.728a1.5 1.5 0 0 1 .536-2.022a1.87 1.87 0 0 1 2.28.28L8 13"/>
				</g>
			</svg>
		</button>
		<button 
			title={"Outline mode"} 
			onClick={toggleOutlineMode}
			style={mode === "outline" ? {backgroundColor: "rgba(0, 0, 0, 0.06)"} : {}}
		>
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
				<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
				      d="M8 9a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v6a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm4 11v.01m4-.01v.01M8 20v.01M4 20v.01M4 16v.01M4 12v.01M4 8v.01M4 4v.01M8 4v.01M12 4v.01M16 4v.01M20 4v.01M20 8v.01M20 12v.01M20 16v.01M20 20v.01"/>
			</svg>
		</button>
		
		<hr className="panel-divider" />
		
		<button title={"Add node"} onClick={onAddNode}>
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
				<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
				      d="M12.5 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v7.5M16 19h6m-3-3v6"/>
			</svg>
		</button>
		<button title={"Save mind map snapshot"} onClick={onSave}>
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
				<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
				      d="M9 12a3 3 0 1 0 6 0a3 3 0 1 0-6 0m3-9v6m0 6v6"/>
			</svg>
		</button>
		<button title={"History"} onClick={onHistory}>
			<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24">
				<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5">
					<path d="M12 8v4l2 2"/>
					<path d="M3.05 11a9 9 0 1 1 .5 4m-.5 5v-5h5"/>
				</g>
			</svg>
		</button>
	</div>
);

export default MapControlPanel;
