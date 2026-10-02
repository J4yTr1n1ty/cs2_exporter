const { connect } = require('@unyxos/working-rcon');
const validator = require('express-joi-validation').createValidator({});
const express = require('express');
const app = express();

const { metricsParamsSchema } = require('./utils/joi-schema');
const { metrics, registry } = require('./utils/metrics');
const logger = require('./utils/logging');

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/utils/homepage.html');
});

app.get('/metrics', validator.query(metricsParamsSchema), async (req, res) => {
    const { ip, port, password } = req.query;

    try {
        const client = await connect(ip, port, password, 5 * 1000);
        const statusJsonResponse = await client.command('status_json');
        await client.disconnect();

        // Strip control characters from player names before parsing
        const statusJson = JSON.parse(statusJsonResponse.replace(/[\x00-\x1F\x7F]/g, ''));
        const labels = { ip, port };

        const srv = statusJson.server;

        metrics.frametimeMs.set(labels, statusJson.frametime_ms || 0);
        metrics.framecomputetimeMs.set(labels, statusJson.framecomputetime_ms || 0);
        metrics.processUptime.set(labels, statusJson.process_uptime || 0);
        metrics.buildVersion.set(labels, statusJson.build_version || 0);
        metrics.memPhysAvailGb.set(labels, statusJson.mem_phys_avail_gb || 0);
        metrics.clientsHuman.set(labels, srv.clients_human || 0);
        metrics.clientsBot.set(labels, srv.clients_bot || 0);
        metrics.cpuUsage.set(labels, srv.cpu_usage || 0);
        metrics.hibernating.set(labels, srv.hibernating ? 1 : 0);
        metrics.gcSession.set(labels, srv.gc_status === 'GCConnectionStatus_HAVE_SESSION' ? 1 : 0);
        metrics.networkLossAvg.set(labels, srv.player_network_loss_avg || 0);
        metrics.networkLossMax.set(labels, srv.player_network_loss_max || 0);
        metrics.networkLagAvg.set(labels, srv.player_network_lag_avg || 0);
        metrics.networkLagMax.set(labels, srv.player_network_lag_max || 0);
        metrics.frameTime50th.set(labels, (srv.frame_time_50th_percentile || 0) * 1000);
        metrics.frameTime95th.set(labels, (srv.frame_time_95th_percentile || 0) * 1000);
        metrics.frameTimeMax.set(labels, (srv.frame_time_max || 0) * 1000);
        metrics.up.set(labels, 1);

    } catch (err) {
        logger.error({ step: 'FETCH_METRICS', err: err.message }, 'error while fetching metrics from server');
        // leave the other gauges at their last known value so a failed scrape doesn't
        // zero out a graph — cs2_up is what should drive alerting on staleness
        metrics.up.set({ ip, port }, 0);
    } finally {
        res.set('Content-Type', registry.contentType);
        res.end(registry.metrics());
    }
});

const port = process.env.HTTP_PORT || 9591;
app.listen(port, () => {
    logger.info(`Metrics server listening on port ${port}`);
});

process.on('uncaughtException', (err) => {
    logger.error({ step: 'UNCAUGHT_EXCEPTION', err: err.message }, 'uncaught exception');
});
