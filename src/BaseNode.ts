import { Node, NodeAPI, NodeDef } from 'node-red';

export abstract class BaseNode {
    protected constructor(config: NodeDef, RED: NodeAPI) {
        RED.nodes.createNode(this, config);
    }
}

export interface BaseNode extends Node {}
