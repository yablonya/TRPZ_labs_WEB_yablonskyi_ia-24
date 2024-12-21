import {NodeType} from "@/types/NodeType";

export interface ConnectionType {
	id: number;
	fromNode: NodeType;
	toNode: NodeType;
}
