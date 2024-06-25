module.exports = {
  apps: [
    {
      name: 'nest-be-template',
      script: 'node dist/src/main.js',
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      namespace: 'nest-be-template',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      time: true,
    },
  ],
};
