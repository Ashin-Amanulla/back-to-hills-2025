module.exports = {
  apps: [
    {
      name: "back-to-hills-backend",
      script: "./app.js",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "500M",
      env: {
        NODE_ENV: "production",
      },
      env_production: {
        NODE_ENV: "production",
      },
      env_development: {
        NODE_ENV: "development",
      },
      error_file: "./logs/pm2-err.log",
      out_file: "./logs/pm2-out.log",
      log_file: "./logs/pm2-combined.log",
      time: true,
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      // Cluster mode settings (optional, for horizontal scaling)
      // instances: 'max', // Use all CPU cores
      // exec_mode: 'cluster',

      // Advanced PM2 features
      min_uptime: "10s",
      max_restarts: 10,
      kill_timeout: 5000,
      listen_timeout: 3000,

      // Node.js arguments
      node_args: "--max-old-space-size=2048",

      // Auto restart on cron pattern (optional)
      // cron_restart: '0 0 * * *', // Restart every day at midnight

      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
    },
  ],

  deploy: {
    production: {
      user: "ubuntu",
      host: "your-ec2-ip",
      ref: "origin/main",
      repo: "git@github.com:username/back-to-hills-2025.git",
      path: "/home/ubuntu/apps/back-to-hills-backend",
      "post-deploy":
        "npm install && pm2 reload ecosystem.config.js --env production",
      "pre-setup": 'echo "Setting up project..."',
    },
  },
};
