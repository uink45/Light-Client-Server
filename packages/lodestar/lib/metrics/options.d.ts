/**
 * @module metrics
 */
export interface IMetricsOptions {
    enabled: boolean;
    timeout?: number;
    serverPort?: number;
    gatewayUrl?: string;
    listenAddr?: string;
    /** Optional metadata to send to Prometheus */
    metadata?: LodestarGitData & {
        network: string;
    };
}
export declare const defaultMetricsOptions: IMetricsOptions;
export declare type LodestarGitData = {
    /** "0.16.0" */
    semver: string;
    /** "developer/feature-1" */
    branch: string;
    /** "4f816b16dfde718e2d74f95f2c8292596138c248" */
    commit: string;
    /** "0.16.0 developer/feature-1 ac99f2b5" */
    version: string;
};
//# sourceMappingURL=options.d.ts.map