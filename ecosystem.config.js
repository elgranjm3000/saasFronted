module.exports = {
  apps: [{
    name: "saas-frontend",
    cwd: "/home/saas",
    script: "npm",
    args: "run start",
    env: {
      NODE_ENV: "production",
      PORT: "3000"
    },
    error_file: "/home/saas/logs/pm2-error.log",
    out_file: "/home/saas/logs/pm2-out.log",
    log_file: "/home/saas/logs/pm2-combined.log",
    time: true
  }]
}
