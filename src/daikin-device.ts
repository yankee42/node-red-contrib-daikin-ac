import { DaikinAC } from 'daikin-controller';
import { NodeAPI, NodeDef } from 'node-red';
import { DaikinDeviceNode } from './daikin-device-node';
import { BaseNode } from './BaseNode';

interface DaikinDeviceConfig {
    host: string;
    useGetToPost: boolean;
}

function init(RED: NodeAPI) {
    class DaikinDeviceNodeImpl extends BaseNode implements DaikinDeviceNode {
        controller: DaikinAC;

        constructor(protected config: DaikinDeviceConfig & NodeDef) {
            super(config, RED);
            this.controller = new DaikinAC(
                config.host,
                {useGetToPost: config.useGetToPost},
                (error) => {
                    if (error) {
                        this.error(`Could not connect to A/C at ${config.host}: ${error}`);
                    } else {
                        this.trace(`Daikin A/C at ${config.host} connected`);
                    }
                }
            );
        }
    }

    RED.nodes.registerType('daikin-device', <any>DaikinDeviceNodeImpl);
}

export = init
