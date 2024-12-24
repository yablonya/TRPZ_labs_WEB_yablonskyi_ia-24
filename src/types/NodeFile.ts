import {NodeType} from "@/types/NodeType";

export interface NodeFile {
	id: string;
	node: NodeType;
	name: string;
	url: string;
	type: string;
}
