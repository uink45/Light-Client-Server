import * as fastify from "fastify";
import { ReqGeneric, RouteGeneric, RouteGroupDefinition } from "../../utils/types";
import { IChainForkConfig } from "@chainsafe/lodestar-config";
export declare type ServerRoute<Req extends ReqGeneric = ReqGeneric> = {
    url: string;
    method: fastify.HTTPMethods;
    handler: FastifyHandler<Req>;
    schema?: fastify.FastifySchema;
    /** OperationId as defined in https://github.com/ethereum/beacon-APIs/blob/v2.1.0/apis/beacon/blocks/attestations.yaml#L2 */
    id: string;
};
/** Adaptor for Fastify v3.x.x route type which has a ton of arguments */
declare type FastifyHandler<Req extends ReqGeneric> = fastify.RouteHandlerMethod<fastify.RawServerDefault, fastify.RawRequestDefaultExpression<fastify.RawServerDefault>, fastify.RawReplyDefaultExpression<fastify.RawServerDefault>, {
    Body: Req["body"];
    Querystring: Req["query"];
    Params: Req["params"];
}, fastify.ContextConfigDefault>;
export declare type ServerRoutes<Api extends Record<string, RouteGeneric>, ReqTypes extends {
    [K in keyof Api]: ReqGeneric;
}> = {
    [K in keyof Api]: ServerRoute<ReqTypes[K]>;
};
export declare function getGenericJsonServer<Api extends Record<string, RouteGeneric>, ReqTypes extends {
    [K in keyof Api]: ReqGeneric;
}>({ routesData, getReqSerializers, getReturnTypes }: RouteGroupDefinition<Api, ReqTypes>, config: IChainForkConfig, api: Api): ServerRoutes<Api, ReqTypes>;
export {};
//# sourceMappingURL=server.d.ts.map