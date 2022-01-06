"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AvgMinMax = void 0;
const gauge_1 = require("./gauge");
/**
 * Special non-standard "Histogram" that captures the avg, min and max of values
 */
class AvgMinMax {
    constructor(configuration) {
        this.getValuesFn = null;
        this.onCollect = () => {
            if (this.getValuesFn !== null) {
                this.set(this.getValuesFn());
            }
        };
        this.avg = new gauge_1.GaugeExtra({ ...configuration, name: `${configuration.name}_avg` });
        this.min = new gauge_1.GaugeExtra({ ...configuration, name: `${configuration.name}_min` });
        this.max = new gauge_1.GaugeExtra({ ...configuration, name: `${configuration.name}_max` });
    }
    addGetValuesFn(getValuesFn) {
        if (this.getValuesFn === null) {
            this.getValuesFn = getValuesFn;
            this.avg.addCollect(this.onCollect);
        }
        else {
            throw Error("Already registered a getValuesFn");
        }
    }
    set(values) {
        const { avg, min, max } = getStats(values);
        this.avg.set(avg);
        this.min.set(min);
        this.max.set(max);
    }
}
exports.AvgMinMax = AvgMinMax;
function getStats(values) {
    if (values.length < 1) {
        return { avg: 0, min: 0, max: 0 };
    }
    let min = values[0];
    let max = values[0];
    let total = values[0];
    for (let i = 1; i < values.length; i++) {
        const val = values[i];
        if (val < min)
            min = val;
        if (val > max)
            max = val;
        total += val;
    }
    return { avg: total / values.length, min, max };
}
//# sourceMappingURL=avgMinMax.js.map