import {NodeFile, NodeIcon, NodeType} from "@/types";
import React, {FC} from "react";
import "../NodeComponent.scss"

interface PreviewNodeComponentProps {
	node: NodeType;
	icons: NodeIcon[];
	files: NodeFile[];
}

const PreviewNodeComponent: FC<PreviewNodeComponentProps> = ({
	node,
	icons,
	files
}) => {
	return (
		<div
			className="node-component"
			style={{
				left: `${node.xposition}px`,
				top: `${node.yposition}px`,
				position: "absolute",
				cursor: "move",
			}}
		>
			{icons.some((icon) => icon.type === "priority") && (
				<div className="priority-container">
					{icons.map((icon) => icon.type === "priority" && (
						<div
							key={icon.id}
							className="icon priority-icon"
							style={{
								backgroundColor:
									+icon.content === 1 ? "crimson"
										: (+icon.content > 1 && +icon.content < 5 ? "goldenrod"
											: (+icon.content >= 5 ? "forestgreen" : "blue")),
							}}
						>
							Priority: {icon.content}
							<button className="delete-icon-btn">
								&times;
							</button>
						</div>
					))}
				</div>
			)}

			<div className="node-text">
				{node.content}
			</div>

			{files.length > 0 && (
				<div className="files-container">
					{files.map((file) => {
						const isImage = file.type.startsWith("image/");
						const isVideo = file.type.startsWith("video/");

						return (
							isImage ? (
								<div key={file.id} className="file-item image-file">
									<img src={file.url} alt="file" className="file-preview"/>
								</div>
							) : isVideo ? (
								<div key={file.id} className="file-item image-file">
									<video
										src={file.url}
										className="file-preview"
										controls
									/>
								</div>
							) : (
								<div key={file.id} className="file-item other-file">
									<a href={file.url} target="_blank" rel="noopener noreferrer">
										{file.name}
									</a>
								</div>
							)
						)
					})}
				</div>
			)}

			{icons.some((icon) => icon.type === "category") && (
				<div className="categories-container">
					{icons.map((icon) => icon.type === "category" && (
						<div key={icon.id} className="icon category-icon">
							{icon.content}
							<button className="delete-icon-btn">
								&times;
							</button>
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PreviewNodeComponent;
