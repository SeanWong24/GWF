import * as d3 from "d3";

export class Globals {
    static config: {
        serverEndPoint: string,
        visImageBasePath: string
    };

    static async initialize() {
        Globals.config = JSON.parse(await d3.text("assets/config/config.json"));
    }
}
