"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BestPartialLightClientUpdateRepository = void 0;
const lodestar_db_1 = require("@chainsafe/lodestar-db");
const lodestar_params_1 = require("@chainsafe/lodestar-params");
const lodestar_types_1 = require("@chainsafe/lodestar-types");
const ssz_1 = require("@chainsafe/ssz");
/**
 * Best PartialLightClientUpdate in each SyncPeriod
 *
 * Used to prepare light client updates
 */
class BestPartialLightClientUpdateRepository extends lodestar_db_1.Repository {
    constructor(config, db, metrics) {
        // super.type will not be used
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        super(config, db, lodestar_db_1.Bucket.lightClient_bestPartialLightClientUpdate, lodestar_types_1.ssz.altair.LightClientUpdate, metrics);
        this.typeFinalized = new ssz_1.ContainerType({
            fields: {
                // isFinalized: true
                isFinalized: ssz_1.booleanType,
                header: lodestar_types_1.ssz.phase0.BeaconBlockHeader,
                blockRoot: lodestar_types_1.ssz.Root,
                finalityBranch: new ssz_1.VectorType({ length: lodestar_params_1.FINALIZED_ROOT_DEPTH, elementType: lodestar_types_1.ssz.Root }),
                finalizedCheckpoint: lodestar_types_1.ssz.phase0.Checkpoint,
                finalizedHeader: lodestar_types_1.ssz.phase0.BeaconBlockHeader,
                ...lodestar_types_1.ssz.altair.SyncAggregate.fields,
            },
        });
        this.typeNonFinalized = new ssz_1.ContainerType({
            fields: {
                // isFinalized: false
                isFinalized: ssz_1.booleanType,
                header: lodestar_types_1.ssz.phase0.BeaconBlockHeader,
                blockRoot: lodestar_types_1.ssz.Root,
                ...lodestar_types_1.ssz.altair.SyncAggregate.fields,
            },
        });
    }
    encodeValue(value) {
        if (value.isFinalized) {
            return this.typeFinalized.serialize(value);
        }
        else {
            return this.typeNonFinalized.serialize(value);
        }
    }
    decodeValue(data) {
        const firstByte = data[0];
        if (firstByte === 1) {
            return this.typeFinalized.deserialize(data);
        }
        else {
            return this.typeNonFinalized.deserialize(data);
        }
    }
}
exports.BestPartialLightClientUpdateRepository = BestPartialLightClientUpdateRepository;
//# sourceMappingURL=lightclientBestPartialUpdate.js.map