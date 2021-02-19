module.exports = {
  apps: [
    {
      name: "kova-api",
      script: "dist/main.js",
      cwd: "./", // current workspace
      watch: [
        // watch directorys and restart when they change
        "dist",
      ],
      ignore_watch: [
        // ignore watch
        "node_modules",
        "logs",
        "static",
      ],
      autorestart: true,
      instances: 1, // start 2 instances
      env: {
        NODE_ENV: "production",
        PORT: 3001,
      },
      out_file: "./logs/out.log", // normal log
      error_file: "./logs/err.log", // error log
      merge_logs: true,
      log_date_format: "YYYY-MM-DD HH:mm Z", // date format
    },
  ],
}
