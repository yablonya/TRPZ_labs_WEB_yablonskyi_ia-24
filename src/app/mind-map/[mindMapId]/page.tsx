import React from 'react';
import MindMapPage from "@/components/pages/mind-map-page/MindMapPage";

const MindMap = async ({ params }: { params: Promise<{ mindMapId: string }> }) => {
	const mindMapId = (await params).mindMapId;
	
	return (
		<MindMapPage mindMapId={mindMapId}/>
	);
};

export default MindMap;
