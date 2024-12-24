import {MindMapType} from "@/types/MindMapType";
import {NodeType} from "@/types/NodeType";
import {ConnectionType} from "@/types/ConnectionType";
import {NodeIcon} from "@/types/NodeIcon";
import {NodeFile} from "@/types/NodeFile";

export type FullMindMapType = {
	snapshotId: string,
	mindMap: MindMapType;
	nodes: NodeType[];
	connections: ConnectionType[];
	icons: NodeIcon[];
	files: NodeFile[];
	savedAt: string;
}
