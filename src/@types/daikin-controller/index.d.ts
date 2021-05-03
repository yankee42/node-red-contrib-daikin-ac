declare module 'daikin-controller' {

    type DaikinCallback = (error: any, response: any) => void;

    export class DaikinAC {
        /*
         * Constructor to initialize the Daikin instance to interact with the device.
         * Usage see example above, the "options" paraeter is optional. Using "options" you can set a **logger** function (see example). Additionally you can set the special flag **useGetToPost** for older Firmwares of the Daikin-WLAN-Interfaces (<1.4) that only supported HTTP GET also to set data. So if you get errors using it then you try if it works better with this flag.
         * The callback function is called after initializing the device and requesting currentCommonBasicInfo and currentACModelInfo.
         */
        constructor(ip: String, options: any, callback: DaikinCallback)

        /**
         * Use this method to initialize polling to get currentACControlInfo and currentACSensorInfo filled on the given interval. The interval is given in ms.
         * The callback function is called **after each polling/update**.
         */
        setUpdate(updateInterval: Number, callback: DaikinCallback): void

        /**
         * This method is mainly used internally to update the data, but can also be used to update the data in between of the pollings.
         * On result the callback from "setUpdate" is called, else only values are updated.
         */
        updateData(): void

        /**
         * End the auto-update and clear all polling timeouts.
         */
        stopUpdate(): void

        /**
         * Get the "Basic-Info" details from the Daikin-Device. The callback will be called with the result.
         */
        getCommonBasicInfo(callback: DaikinCallback): void

        /**
         * Get the "Remote Method" details from the Daikin-Device. The callback will be called with the result.
         */
        getCommonRemoteMethod(callback: DaikinCallback): void

        /**
         * Get the "Control-Info" details from the Daikin-Device. The callback will be called with the result.
         */
        getACControlInfo(callback: DaikinCallback): void

        /**
         * Send an update for the "Control-Info" data to the device. values is an object with the following possible keys:
         * - power: Boolean, enable or disable the device, you can also use DaikinAC-Power for allowed values in human readable format
         * - mode: Integer, set operation Mode of the device, you can also use DaikinAC-Mode for allowed values in human readable format
         * - targetTemperature: Float or "M" for mode 2 (DEHUMDIFICATOR)
         * - targetHumidity: Float or "AUTO"/"--" for mode 6 (FAN)
         * - fanRate: Integer or "A"/"B", you can also use DaikinAC-FanRate for allowed values in human readable format
         * - fanDirection: Integer, you can also use DaikinAC-FanDirection for allowed values in human readable format
         *
         * You can also set single of those keys (e.g. only "Power=true"). When this happends the current data are requested from the device, the relevant values will be changed and all required fields will be re-send to the device. Be carefull, especially on mode changes some values may be needed to be correct (e.g. when changing back from "FAN" to "AUTO" then temperature is empty too, but Auto needs a set temperature).
         */
        setACControlInfo(values: DaikinAcControlInfo, callback: DaikinCallback): void

        /**
         * Get the "Sensor-Info" details from the Daikin-Device. The callback will be called with the result.
         */
        getACSensorInfo(callback: DaikinCallback): void

        /**
         * Get the "Model-Info" details from the Daikin-Device. The callback will be called with the result.
         */
        getACModelInfo(callback: DaikinCallback): void

        /**
         * Get the "Week-Power" details from the Daikin-Device. The callback will be called with the result.
         */
        getACWeekPower(callback: DaikinCallback): void

        /**
         * Get the "Year-Power" details from the Daikin-Device. The callback will be called with the result.
         */
        getACYearPower(callback: DaikinCallback): void

        /**
         * Get the "Extended Week-Power" details from the Daikin-Device. The callback will be called with the result.
         */
        getACWeekPowerExtended(callback: DaikinCallback): void

        /**
         * Get the "Extended Year-Power" details from the Daikin-Device. The callback will be called with the result.
         */
        getACYearPowerExtended(callback: DaikinCallback): void

        /**
         * Send an update for the "Special Mode" data to the device. values is an object with the following possible keys:
         * - state: Integer, enable or disable the special mode, you can also use DaikinAC-SpecialModeState for allowed values in human readable format
         * - kind: Integer, the kind of the special mode, you can also use DaikinAC-SpecialModeKind for allowed values in human readable format
         *
         * Response:
         * - specialMode: String, the current special mode, you can also use DaikinAC-SpecialModeResponse for allowed values in human readable format
         *
         * It's possible to set STREAMER mode for a turned off device. POWERFUL/ECONOMY modes will only work when the the device is turned on.
         */
        setACSpecialMode(values: any, callback: DaikinCallback): void


        /**
         * Enables the Wifi Controller LEDs.
         */
        enableAdapterLED(callback: DaikinCallback): void

        /**
         * Disables the Wifi Controller LEDs.
         */
        disableAdapterLED(callback: DaikinCallback): void

        /**
         * Reboot the Wifi Controller. After this the Basic data are requested agsin and updated locally.
         */
        rebootAdapter(callback: DaikinCallback): void

        static Power: DaikinPower;
        static Mode: DaikinMode;
        static FanRate: DaikinFanRate;
        static FanDirection: DaikinFanDirection;
        static SpecialModeState: DaikinSpecialModeState;
        static SpecialModeKind: DaikinSpecialModeKind;
        static SpecialModeResponse: DaikinSpecialModeResponse;
    }

    export function discover(waitForCount: number, callback: (obj: any) => void): void

    interface DaikinPower {
        OFF: boolean
        ON: boolean
    }

    interface DaikinMode {
        AUTO: number;
        AUTO1: number;
        AUTO2: number;
        DEHUMDID: number;
        COLD: number;
        HOT: number;
        FAN: number;
    }

    interface DaikinFanRate {
        AUTO: string;
        SILENCE: string;
        LEVEL_1: number;
        LEVEL_2: number;
        LEVEL_3: number;
        LEVEL_4: number;
        LEVEL_5: number;
    }

    interface DaikinFanDirection {
        STOP: number;
        VERTICAL: number;
        HORIZONTAL: number;
        VERTICAL_AND_HORIZONTAL: number;
    }

    interface DaikinSpecialModeState {
        OFF: string;
        ON: string;
    }

    interface DaikinSpecialModeKind {
        STREAMER: string; // Flash STREAMER Air-Purifier
        POWERFUL: string; // POWERFUL Operation
        ECONO: string; // ECONO Operation
    }

    interface DaikinSpecialModeResponse {
        ['N/A']: string;
        POWERFUL: string;
        ECONO: string;
        STREAMER: string;
        ['POWERFUL/STREAMER']: string;
        ['ECONO/STREAMER']: string;
    }

    interface DaikinAcControlInfo {
        power?: boolean;
        mode?: number;
        targetTemperature?: number;
        targetHumidity?: number;
        fanRate?: number | string;
        fanDirection?: number;
    }
}
