import {NodeFile, NodeIcon, NodeType} from "@/types";
import React, {FC} from "react";
import "../NodeComponent.scss"
import FileComponent from "@/components/common/file-component/FileComponent";

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
				width: "200px"
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
									+icon.content === 1
										? "crimson"
										: +icon.content < 5
											? "goldenrod"
											: +icon.content < 10
												? "forestgreen"
												: "blue",
							}}
						>
							Priority: {icon.content}
						</div>
					))}
				</div>
			)}

			<div className="node-text">
				{node.content}
			</div>

			{files.length > 0 && (
				<div className="files-container">
					{files.map((file) => (
						<FileComponent key={file.id} file={file} />
					))}
				</div>
			)}

			{icons.some((icon) => icon.type === "category") && (
				<div className="categories-container">
					{icons.map((icon) => icon.type === "category" && (
						<div key={icon.id} className="icon category-icon">
							{icon.content}
						</div>
					))}
				</div>
			)}
		</div>
	);
};

export default PreviewNodeComponent;
