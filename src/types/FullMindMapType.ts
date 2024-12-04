import {MindMapType} from "@/types/MindMapType";
import {NodeType} from "@/types/NodeType";

export type FullMindMapType = {
	mindMap: MindMapType;
	nodes: NodeType[];
	savedAt: string;
}
