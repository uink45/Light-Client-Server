"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForkChoiceUpdateStatus = exports.ExecutePayloadStatus = void 0;
var ExecutePayloadStatus;
(function (ExecutePayloadStatus) {
    /** given payload is valid */
    ExecutePayloadStatus["VALID"] = "VALID";
    /** given payload is invalid */
    ExecutePayloadStatus["INVALID"] = "INVALID";
    /** sync process is in progress */
    ExecutePayloadStatus["SYNCING"] = "SYNCING";
    /** EL error */
    ExecutePayloadStatus["ELERROR"] = "ELERROR";
    /** EL unavailable */
    ExecutePayloadStatus["UNAVAILABLE"] = "UNAVAILABLE";
})(ExecutePayloadStatus = exports.ExecutePayloadStatus || (exports.ExecutePayloadStatus = {}));
var ForkChoiceUpdateStatus;
(function (ForkChoiceUpdateStatus) {
    /** given payload is valid */
    ForkChoiceUpdateStatus["SUCCESS"] = "SUCCESS";
    /** sync process is in progress */
    ForkChoiceUpdateStatus["SYNCING"] = "SYNCING";
})(ForkChoiceUpdateStatus = exports.ForkChoiceUpdateStatus || (exports.ForkChoiceUpdateStatus = {}));
//# sourceMappingURL=interface.js.map