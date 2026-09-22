const prometheus = require('prom-client');
const { Gauge } = prometheus;

const registry = new prometheus.Registry();

const labelNames = ['ip', 'port'];

const metrics = {
    frametimeMs: new Gauge({ name: 'cs2_frametime_ms', help: 'Frame time in milliseconds', labelNames, registers: [registry] }),
    framecomputetimeMs: new Gauge({ name: 'cs2_framecomputetime_ms', help: 'Frame compute time in milliseconds', labelNames, registers: [registry] }),
    processUptime: new Gauge({ name: 'cs2_process_uptime', help: 'Process uptime in seconds', labelNames, registers: [registry] }),
    buildVersion: new Gauge({ name: 'cs2_build_version', help: 'Build version', labelNames, registers: [registry] }),
    clientsHuman: new Gauge({ name: 'cs2_clients_human', help: 'Number of players', labelNames, registers: [registry] }),
    up: new Gauge({ name: 'cs2_up', help: '1 if the last scrape of this server succeeded, 0 otherwise', labelNames, registers: [registry] }),
};

module.exports = {
    registry,
    metrics,
}
