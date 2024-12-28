import React, {FC, useState} from 'react';
import {NodeFile} from "@/types";

interface FileComponentProps {
	file: NodeFile;
	onRemoveFile?: (fileId: string) => void;
}

const FileComponent: FC<FileComponentProps> = ({ file, onRemoveFile }) => {
	const [showControls, setShowControls] = useState(false);
	const isImage = file.type.startsWith("image/");
	const isVideo = file.type.startsWith("video/");

	const handleMouseEnter = (event: React.MouseEvent<HTMLVideoElement>) => {
		const videoElement = event.currentTarget;
		videoElement.play();
	};

	const handleMouseLeave = (event: React.MouseEvent<HTMLVideoElement>) => {
		const videoElement = event.currentTarget;
		videoElement.pause();
		videoElement.currentTime = 0;
	};

	return (
		isImage ? (
			<div key={file.id} className="file-item image-file">
				<img src={file.url} alt="file" className="file-preview"/>
				{onRemoveFile && (
					<button onClick={() => onRemoveFile(file.id)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
							<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5"
							      d="M20 20L4 4m16 0L4 20"/>
						</svg>
					</button>
				)}
			</div>
		) : isVideo ? (
			<div
				key={file.id}
				className="file-item image-file"
				onMouseOver={() => setShowControls(true)}
				onMouseLeave={() => setShowControls(false)}
			>
				<video
					src={file.url}
					className="file-preview"
					controls={showControls}
					onMouseOver={handleMouseEnter}
					onMouseLeave={handleMouseLeave}
				/>
				{onRemoveFile && (
					<button onClick={() => onRemoveFile(file.id)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
							<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5"
							      d="M20 20L4 4m16 0L4 20"/>
						</svg>
					</button>
				)}
			</div>
		) : (
			<div key={file.id} className="file-item other-file">
				<a href={file.url} target="_blank">
					{file.name}
				</a>
				{onRemoveFile && (
					<button onClick={() => onRemoveFile(file.id)}>
						<svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24">
							<path fill="none" stroke="black" strokeLinecap="round" strokeWidth="1.5"
							      d="M20 20L4 4m16 0L4 20"/>
						</svg>
					</button>
				)}
			</div>
		)
	);
};

export default FileComponent;
