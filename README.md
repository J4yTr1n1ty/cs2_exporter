# CS2 Prometheus exporter
### The goal of this project is to provide a simple way to get metrics from CS2 game servers and store them on Prometheus.

## Dashboard

![CS2 Servers Grafana Dashboard](docs/dashboard.png)

Import `grafana-dashboard.json` via Grafana → Dashboards → Import.

## Metrics

All metrics carry `ip` and `port` labels, so a single exporter instance can serve multiple servers without label collision.

| Metric | Description |
|---|---|
| `cs2_frametime_ms` | Frame time in milliseconds |
| `cs2_framecomputetime_ms` | Frame compute time in milliseconds |
| `cs2_process_uptime` | Process uptime in seconds |
| `cs2_build_version` | Build version |
| `cs2_clients_human` | Number of human players |
| `cs2_up` | 1 if the last scrape succeeded, 0 otherwise |

## How to install

### Method 1 : With docker
`docker run -d -p <external port>:9591 --name cs2_exporter --restart=always ghcr.io/j4ytr1n1ty/cs2_exporter:latest`

### Method 2 : Download sources and run

You need to have NodeJS installed if you want to run the sources, NVM (Node Version Manager) is a simple tool to get it running : https://github.com/nvm-sh/nvm

1. Download the repo (using git clone or direct zip download)
2. Enter the cs2_exporter directory and run `npm i`, this will install all required dependencies
3. Start the script with node : `node index.js`, you can create a service or run it in a screen to keep it active in background

By default, the exporter runs on port 9591, it's possible to customize this by setting the HTTP_PORT variable to the desired port.

## Configure the game server

1. Configure a rcon password password either via command line:
```
+rcon_password <password>
```

or under your server.cfg file:
```
rcon_password "<password>"
```

2. Make sure that your server's firewall allows the exporter to connect to the game server's RCON port (TCP).

## Configure Prometheus

Add the following configuration to Prometheus static configuration :

```
- job_name: 'cs2_exporter'
    static_configs:
      - targets: ["<ip>:<port>:<rconpassword>"]


    relabel_configs:
      - source_labels: [__address__]
        regex: "(.+):.+:.+"
        replacement: "$1"
        target_label: __param_ip
      - source_labels: [__address__]
        regex: ".+:(.+):.+"
        replacement: "$1"
        target_label: __param_port
      - source_labels: [__address__]
        regex: ".+:.+:(.+)"
        replacement: "$1"
        target_label: __param_password
      - source_labels: [__param_target]
        target_label: instance
      - target_label: __address__
        replacement: <IP>:<port> # Real exporter's IP:Port
```

## How to access

If you want to see what the exporter returns, you can access :

 `http://<ip>:9591/metrics?ip=<server ip>&port=<server port>&password=<rcon password>`

### Support

If you encounter any issue, feel free to open an issue on the github repository!
