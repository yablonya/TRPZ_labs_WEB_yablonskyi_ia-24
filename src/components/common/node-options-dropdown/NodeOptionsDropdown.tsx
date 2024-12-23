import React, { FC } from "react";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import "./NodeOptionsDropdown.scss"
import {NodeType} from "@/types";

interface NodeOptionsDropdownProps {
	node: NodeType;
	hasPriority: boolean;
	showPriorityForm: boolean;
	setShowPriorityForm: (showPriorityForm: boolean) => void;
	showCategoryForm: boolean;
	setShowCategoryForm: (showCategoryForm: boolean) => void;
	onAddFile: () => void;
	connectionOriginNodeId: string | null;
	setConnectionOriginNodeId: (id: string | null) => void;
	onDeleteNode: (nodeId: string) => void;
}

const NodeOptionsDropdown: FC<NodeOptionsDropdownProps> = ({
	node,
	hasPriority,
	showPriorityForm,
	setShowPriorityForm,
	showCategoryForm,
	setShowCategoryForm,
	onAddFile,
	connectionOriginNodeId,
	setConnectionOriginNodeId,
	onDeleteNode,
}) => {
	return (
		<DropdownMenu.Root>
			<DropdownMenu.Trigger className="dropdown-trigger">
				<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24">
					<path fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5"
					      d="M11 12a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0 7a1 1 0 1 0 2 0a1 1 0 1 0-2 0m0-14a1 1 0 1 0 2 0a1 1 0 1 0-2 0"/>
				</svg>
			</DropdownMenu.Trigger>

			<DropdownMenu.Portal>
				<DropdownMenu.Content 
					className="dropdown-content" 
					sideOffset={5} 
					side={"right"} 
					align={"start"}
				>
					{!hasPriority && !showPriorityForm && (
						<DropdownMenu.Item
							title={"Add priority"}
							className="dropdown-item" 
							onClick={() => setShowPriorityForm(true)}
						>
							Add priority
						</DropdownMenu.Item>
					)}
					{!showCategoryForm && (
						<DropdownMenu.Item
							title={"Add category"}
							className="dropdown-item" 
							onClick={() => setShowCategoryForm(true)}
						>
							Add category
						</DropdownMenu.Item>
					)}
					<DropdownMenu.Item
						title={"Add file"}
						className="dropdown-item"
						onClick={onAddFile}
					>
						Add file
					</DropdownMenu.Item>
					{connectionOriginNodeId === null && (
						<DropdownMenu.Item 
							title={"Connect with other node"}
							className="dropdown-item" 
							onClick={() => setConnectionOriginNodeId(node.id)}
						>
							Connect with other node
						</DropdownMenu.Item>
					)}
					<DropdownMenu.Item
						title={"Delete node"}
						className="dropdown-item"
						onClick={() => onDeleteNode(node.id)}
					>
						Delete node
					</DropdownMenu.Item>
				</DropdownMenu.Content>
			</DropdownMenu.Portal>
		</DropdownMenu.Root>
	);
};

export default NodeOptionsDropdown;
