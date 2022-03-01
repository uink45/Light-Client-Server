import { GaugeConfiguration } from "prom-client";
declare type GetValuesFn = () => number[];
/**
 * Special non-standard "Histogram" that captures the avg, min and max of values
 */
export declare class AvgMinMax<T extends string> {
    private readonly avg;
    private readonly min;
    private readonly max;
    private getValuesFn;
    constructor(configuration: GaugeConfiguration<T>);
    addGetValuesFn(getValuesFn: GetValuesFn): void;
    set(values: number[]): void;
    private onCollect;
}
export {};
//# sourceMappingURL=avgMinMax.d.ts.map