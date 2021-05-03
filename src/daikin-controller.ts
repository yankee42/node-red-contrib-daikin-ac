import { DaikinAC, DaikinCallback } from 'daikin-controller';
import { NodeAPI, NodeDef, NodeMessage } from 'node-red';
import { DaikinDeviceNode } from './daikin-device-node';
import { BaseNode } from './BaseNode';

type ControllerMethod =
    'setUpdate'
    | 'updateData'
    | 'stopUpdate'
    | 'getCommonBasicInfo'
    | 'getCommonRemoteMethod'
    | 'getACControlInfo'
    | 'setACControlInfo'
    | 'getACSensorInfo'
    | 'getACModelInfo'
    | 'getACWeekPower'
    | 'getACYearPower'
    | 'getACWeekPowerExtended'
    | 'getACYearPowerExtended'
    | 'setACSpecialMode'
    | 'enableAdapterLED'
    | 'disableAdapterLED'
    | 'rebootAdapter';

interface DaikinNodeConfig {
    device: string;
    method: ControllerMethod | '';
}

interface DaikinControllerMessage extends NodeMessage {
    topic?: ControllerMethod;
}

function init(RED: NodeAPI) {
    class DaikinControllerNode extends BaseNode {
        private readonly acController: DaikinAC;
        private readonly configMethodName: ControllerMethod | '';

        constructor(config: DaikinNodeConfig & NodeDef) {
            super(config, RED);

            const deviceNode: DaikinDeviceNode = <any>RED.nodes.getNode(config.device);
            this.acController = deviceNode.controller;
            this.configMethodName = config.method;

            this.on('input', message => {
                this.receiveMessage(message);
            });
            this.initializeStatus();
        }

        private initializeStatus() {
            this.status({fill: 'yellow', shape: 'dot', text: 'Connecting...'});
            this.acController.getCommonBasicInfo((error, basicInfo) => {
                if (error) {
                    const txt = `${error}`
                    this.error(`Could not get basic info: ${txt}`);
                    this.status({fill: 'red', shape: 'dot', text: txt});
                } else {
                    this.status({
                        fill: 'green',
                        shape: 'dot',
                        text: `${basicInfo.name}#${this.configMethodName || 'msg.topic'}`
                    });
                }
            });
        }

        private receiveMessage(message: DaikinControllerMessage): void {
            try {
                this.callDaikinController(message);
            } catch (e) {
                this.error(e);
            }
        }

        private callDaikinController(message: DaikinControllerMessage): void {
            const methodName = this.getMethodNameFromMessage(message);
            const func = this.getMethodFromName(methodName);
            if (func.length > 2) {
                throw `function ${methodName} unexpectedly requests ${func.length} args (expected <=2 args)`;
            } else {
                const callback = this.createDaikinCallback(methodName, message.payload);
                if (func.length == 2) {
                    func.call(this.acController, message.payload, callback);
                } else {
                    func.call(this.acController, callback);
                }
            }
        }

        private getMethodFromName(name: ControllerMethod): Function {
            const result = this.acController[name];
            if (!result) {
                throw `Unknown method '${result}'`
            }
            return result;
        }

        private getMethodNameFromMessage(message: DaikinControllerMessage): ControllerMethod {
            if (!this.configMethodName) {
                const topic = message.topic;
                if (!topic) {
                    throw 'No methodName supplied in configuration and no topic present on message';
                }
                return topic;
            }
            return this.configMethodName;
        }

        private createDaikinCallback(methodName: ControllerMethod, payload: any): DaikinCallback {
            return (error: any, response: any) => {
                if (error) {
                    this.error(`Error calling ${methodName}(${JSON.stringify(payload)}): ${error}`);
                } else {
                    this.send({payload: response});
                }
            };
        }
    }

    RED.nodes.registerType('daikin-controller', <any>DaikinControllerNode);
}

export = init
