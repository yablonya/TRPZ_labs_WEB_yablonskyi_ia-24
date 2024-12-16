import React, {Dispatch, FC, SetStateAction, useEffect, useRef, useState} from 'react';
import "./MapControlPanel.scss"

interface MapControlPanelProps {
	mindMapId: number;
	controlState: string;
	setControlState: Dispatch<SetStateAction<string>>;
}

const MapControlPanel: FC<MapControlPanelProps> = ({mindMapId, controlState, setControlState}) => {
	const controlPanelRef = useRef<HTMLDivElement>(null);
	const [isNodeAdding, setIsNodeAdding] = useState<boolean>(false);

	useEffect(() => {
		if (isNodeAdding) {
			setControlState("add-node");
		} else {
			setControlState("view");
		}
	}, [isNodeAdding]);
	
	return (
		<div 
			ref={controlPanelRef}
			className="panel-container"
		>
			<button
				style={
					(((controlState === "add-node") && isNodeAdding) ? {
						backgroundColor: "#808080"
					} : {})
				}
				onClick={() => setIsNodeAdding(!isNodeAdding)}
			>
				Add node
			</button>
			<button>Comment</button>
		</div>
	);
};

export default MapControlPanel;
