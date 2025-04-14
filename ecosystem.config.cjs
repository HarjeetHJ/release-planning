module.exports = {
  apps: [
    {
      name: 'release-calendar-frontend',
      script: 'npm',
      args: 'run preview',
      cwd: './',
      env: {
        NODE_ENV: 'production',
      },
    },
    {
      name: 'release-calendar-backend',
      script: 'npm',
      args: 'start',
      cwd: './server',
      env: {
        NODE_ENV: 'production',
      },
      // Ensure database file is preserved across restarts
      post_deploy: 'cp ../server/db.json ./dist/',
    },
  ],
}