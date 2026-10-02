const prometheus = require('prom-client');
const { Gauge } = prometheus;

const registry = new prometheus.Registry();

const labelNames = ['ip', 'port'];

const metrics = {
    frametimeMs: new Gauge({ name: 'cs2_frametime_ms', help: 'Frame time in milliseconds', labelNames, registers: [registry] }),
    framecomputetimeMs: new Gauge({ name: 'cs2_framecomputetime_ms', help: 'Frame compute time in milliseconds', labelNames, registers: [registry] }),
    processUptime: new Gauge({ name: 'cs2_process_uptime', help: 'Process uptime in seconds', labelNames, registers: [registry] }),
    buildVersion: new Gauge({ name: 'cs2_build_version', help: 'Build version', labelNames, registers: [registry] }),
    clientsHuman: new Gauge({ name: 'cs2_clients_human', help: 'Number of human players', labelNames, registers: [registry] }),
    clientsBot: new Gauge({ name: 'cs2_clients_bot', help: 'Number of bot players', labelNames, registers: [registry] }),
    cpuUsage: new Gauge({ name: 'cs2_cpu_usage', help: 'Server CPU usage percent', labelNames, registers: [registry] }),
    memPhysAvailGb: new Gauge({ name: 'cs2_mem_phys_avail_gb', help: 'Available physical memory in GB', labelNames, registers: [registry] }),
    hibernating: new Gauge({ name: 'cs2_hibernating', help: '1 if server is hibernating, 0 otherwise', labelNames, registers: [registry] }),
    gcSession: new Gauge({ name: 'cs2_gc_session', help: '1 if GC session is active, 0 otherwise', labelNames, registers: [registry] }),
    networkLossAvg: new Gauge({ name: 'cs2_network_loss_avg', help: 'Average player network packet loss', labelNames, registers: [registry] }),
    networkLossMax: new Gauge({ name: 'cs2_network_loss_max', help: 'Max player network packet loss', labelNames, registers: [registry] }),
    networkLagAvg: new Gauge({ name: 'cs2_network_lag_avg_ms', help: 'Average player network lag in milliseconds', labelNames, registers: [registry] }),
    networkLagMax: new Gauge({ name: 'cs2_network_lag_max_ms', help: 'Max player network lag in milliseconds', labelNames, registers: [registry] }),
    frameTime50th: new Gauge({ name: 'cs2_frame_time_50th_percentile_ms', help: 'Frame time 50th percentile in seconds', labelNames, registers: [registry] }),
    frameTime95th: new Gauge({ name: 'cs2_frame_time_95th_percentile_ms', help: 'Frame time 95th percentile in seconds', labelNames, registers: [registry] }),
    frameTimeMax: new Gauge({ name: 'cs2_frame_time_max_ms', help: 'Frame time max in seconds', labelNames, registers: [registry] }),
    up: new Gauge({ name: 'cs2_up', help: '1 if the last scrape of this server succeeded, 0 otherwise', labelNames, registers: [registry] }),
};

module.exports = {
    registry,
    metrics,
}
