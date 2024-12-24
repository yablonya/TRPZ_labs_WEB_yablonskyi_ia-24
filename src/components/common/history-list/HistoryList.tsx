import React, {FC, useEffect, useState} from 'react';
import {deleteSnapshot, getMindMapHistory, restoreSnapshot} from "@/services/mindMapService";
import {FullMindMapType} from "@/types";
import "./HistoryList.scss"

interface HistoryListProps {
	mindMapId: string;
	snapshot: FullMindMapType | null;
	setHoverSnapshot: (snapshot: FullMindMapType | null) => void;
	updateMindMap: () => void;
	onClose: () => void;
}

const HistoryList: FC<HistoryListProps> = ({
	mindMapId,
	snapshot,
	setHoverSnapshot,
	updateMindMap,
	onClose
}) => {
	const [history, setHistory] = useState<FullMindMapType[]>([]);

	const getHistory = async () => {
		try {
			const historyData = await getMindMapHistory(mindMapId);
			setHistory(historyData);
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	const handleRestoreSnapshot = async (snapshotId: string) => {
		try {
			await restoreSnapshot(mindMapId, snapshotId);
			updateMindMap();
			onClose();
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	const handleDeleteSnapshot = async (snapshotId: string) => {
		try {
			await deleteSnapshot(mindMapId, snapshotId);
			getHistory();
			onClose();
		} catch (error) {
			console.error('Error adding connection:', error);
		}
	};

	useEffect(() => {
		getHistory();
	}, []);
	
	return (
		<div className="history-list">
			{history.length !== 0 ? (
				<h3>Mind map history</h3>
			) : (
				<h3>Mind map has no saved history...</h3>
			)}
			{history.length !== 0 && history.map((innerSnapshot: FullMindMapType) => (
				<div
					key={innerSnapshot.savedAt}
					className="snapshot-item"
				>
					Date: {innerSnapshot.savedAt.split("T")[0]} ({innerSnapshot.savedAt.split("T")[1].split(".")[0]})
					<div className="snapshot-item-controls">
						<button
							onClick={() => setHoverSnapshot(snapshot === innerSnapshot ? null : innerSnapshot)}
							style={snapshot === innerSnapshot ? {
								backgroundColor: "rgba(0, 0, 0, 0.08)"
							} : {}}
						>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 14 14">
								<g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
									<path
										d="M13.23 6.246c.166.207.258.476.258.754c0 .279-.092.547-.258.754C12.18 9.025 9.79 11.5 7 11.5S1.82 9.025.77 7.754A1.2 1.2 0 0 1 .512 7c0-.278.092-.547.258-.754C1.82 4.975 4.21 2.5 7 2.5s5.18 2.475 6.23 3.746"/>
									<path d="M7 9a2 2 0 1 0 0-4a2 2 0 0 0 0 4"/>
								</g>
							</svg>
						</button>
						
						<button onClick={() => handleRestoreSnapshot(innerSnapshot.snapshotId)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
								<path fill="currentColor"
								      d="M12 21q-3.15 0-5.575-1.912T3.275 14.2q-.1-.375.15-.687t.675-.363q.4-.05.725.15t.45.6q.6 2.25 2.475 3.675T12 19q2.925 0 4.963-2.037T19 12t-2.037-4.962T12 5q-1.725 0-3.225.8T6.25 8H8q.425 0 .713.288T9 9t-.288.713T8 10H4q-.425 0-.712-.288T3 9V5q0-.425.288-.712T4 4t.713.288T5 5v1.35q1.275-1.6 3.113-2.475T12 3q1.875 0 3.513.713t2.85 1.924t1.925 2.85T21 12t-.712 3.513t-1.925 2.85t-2.85 1.925T12 21m0-7q-.825 0-1.412-.587T10 12t.588-1.412T12 10t1.413.588T14 12t-.587 1.413T12 14"/>
							</svg>
						</button>
						
						<button onClick={() => handleDeleteSnapshot(innerSnapshot.snapshotId)}>
							<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
								<path fill="currentColor"
								      d="M7 21q-.825 0-1.412-.587T5 19V6q-.425 0-.712-.288T4 5t.288-.712T5 4h4q0-.425.288-.712T10 3h4q.425 0 .713.288T15 4h4q.425 0 .713.288T20 5t-.288.713T19 6v13q0 .825-.587 1.413T17 21zM17 6H7v13h10zm-7 11q.425 0 .713-.288T11 16V9q0-.425-.288-.712T10 8t-.712.288T9 9v7q0 .425.288.713T10 17m4 0q.425 0 .713-.288T15 16V9q0-.425-.288-.712T14 8t-.712.288T13 9v7q0 .425.288.713T14 17M7 6v13z"/>
							</svg>
						</button>
					</div>
				</div>
			))}
		</div>
	);
};

export default HistoryList;
