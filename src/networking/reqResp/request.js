const { REQUEST_TIMEOUT, DIAL_TIMEOUT } = require("./configuration");
const { TimeoutError } = require("./timeout/errors");
const { withTimeout } = require("./timeout/timeout");
const { formatProtocolId } = require("./utilities");
const { RequestInternalError, RequestErrorCode} = require("./errors");
const { responseTimeoutsHandler, maxTotalResponseTimeout } = require("./handler/responseTimeoutsHandler");
const it_pipe_1 = require("it-pipe");


async function submitRequest({libp2p, forkDigestContext}, peerId, method, encoding, versions, requestBody, maxResponses){
   
    console.log("Req  dialing peer");
    try {
        // From Altair block query methods have V1 and V2. Both protocols should be requested.
        // On stream negotiation `libp2p.dialProtocol` will pick the available protocol and return
        // the picked protocol in `connection.protocol`
        const protocols = new Map(versions.map((version) => [formatProtocolId(method, version, encoding), { method, version, encoding }]));
        // As of October 2020 we can't rely on libp2p.dialProtocol timeout to work so
        // this function wraps the dialProtocol promise with an extra timeout
        //
        // > The issue might be: you add the peer's addresses to the AddressBook,
        //   which will result in autoDial to kick in and dial your peer. In parallel,
        //   you do a manual dial and it will wait for the previous one without using
        //   the abort signal:
        //
        // https://github.com/ChainSafe/lodestar/issues/1597#issuecomment-703394386
        // DIAL_TIMEOUT: Non-spec timeout from dialing protocol until stream opened
        const { stream, protocol: protocolId } = await withTimeout(async (timeoutAndParentSignal) => {
            const protocolIds = Array.from(protocols.keys());
            const conn = await libp2p.dialProtocol(peerId, protocolIds, { signal: timeoutAndParentSignal });
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            if (!conn)
                throw Error("dialProtocol timeout");
            // TODO: libp2p-ts type Stream does not declare .abort() and requires casting to unknown here
            // Remove when https://github.com/ChainSafe/lodestar/issues/2167
            // After #2167 upstream types are still not good enough, and require casting
            return conn;
        }, DIAL_TIMEOUT, signal).catch((e) => {
            if (e instanceof TimeoutError) {
                throw new RequestInternalError({ code: RequestErrorCode.DIAL_TIMEOUT });
            }
            else {
                throw new RequestInternalError({ code: RequestErrorCode.DIAL_ERROR, error: e });
            }
        });
        // Parse protocol selected by the responder
        const protocol = protocols.get(protocolId);
        if (!protocol)
            throw Error(`dialProtocol selected unknown protocolId ${protocolId}`);
        console.log("Req  sending request");
        
        // Spec: The requester MUST close the write side of the stream once it finishes writing the request message
        // Impl: stream.sink is closed automatically by js-libp2p-mplex when piped source is exhausted
        // REQUEST_TIMEOUT: Non-spec timeout from sending request until write stream closed by responder
        // Note: libp2p.stop() will close all connections, so not necessary to abort this pipe on parent stop
        await withTimeout(() => it_pipe_1.default(requestEncode_1.requestEncode(protocol, requestBody), stream.sink), REQUEST_TIMEOUT, signal).catch((e) => {
            // Must close the stream read side (stream.source) manually AND the write side
            stream.abort(e);
            if (e instanceof TimeoutError) {
                throw new RequestInternalError({ code: RequestErrorCode.REQUEST_TIMEOUT });
            }
            else {
                throw new RequestInternalError({ code: RequestErrorCode.REQUEST_ERROR, error: e });
            }
        });
        console.log("Req  request sent");
        try {
            // Note: libp2p.stop() will close all connections, so not necessary to abort this pipe on parent stop
            const responses = await withTimeout(() => it_pipe_1.default(stream.source, responseTimeoutsHandler(responseDecode_1.responseDecode(forkDigestContext, protocol), options), collectResponses_1.collectResponses(method, maxResponses)), maxTotalResponseTimeout(maxResponses, options)).catch((e) => {
                // No need to close the stream here, the outter finally {} block will
                if (e instanceof TimeoutError) {
                    throw new RequestInternalError({ code: RequestErrorCode.RESPONSE_TIMEOUT });
                }
                else {
                    throw e; // The error will be typed in the outter catch {} block
                }
            });
            // NOTE: Only log once per request to verbose, intermediate steps to debug
            // NOTE: Do not log the response, logs get extremely cluttered
            // NOTE: add double space after "Req  " to align log with the "Resp " log
            const numResponse = Array.isArray(responses) ? responses.length : 1;
            logger.verbose("Req  done", { ...logCtx, numResponse });
            return responses;
        }
        finally {
            // Necessary to call `stream.close()` since collectResponses() may break out of the source before exhausting it
            // `stream.close()` libp2p-mplex will .end() the source (it-pushable instance)
            // If collectResponses() exhausts the source, it-pushable.end() can be safely called multiple times
            stream.close();
        }
    }
    catch (e) {
        const metadata = { method, encoding };
        if (e instanceof response_1.ResponseError) {
            throw new errors_1.RequestError(errors_1.responseStatusErrorToRequestError(e), metadata);
        }
        else if (e instanceof errors_1.RequestInternalError) {
            throw new errors_1.RequestError(e.type, metadata);
        }
        else {
            throw e;
        }
    }
}
exports.submitRequest = submitRequest;