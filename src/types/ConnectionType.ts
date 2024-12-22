import {NodeType} from "@/types/NodeType";

export interface ConnectionType {
	id: string;
	fromNode: NodeType;
	toNode: NodeType;
}
