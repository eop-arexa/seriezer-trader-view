module.exports = {
  apps: [
    {
      name: 'arexa-trader-view',
      script: 'node dist/src/main.js',
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      namespace: 'arexa',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      time: true,
    },
    {
      name: 'arexa-trader-view-notifier',
      script: 'node dist/src/notifier.js',
      node_args: '-r dotenv/config',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
      },
      namespace: 'arexa',
      log_date_format: 'YYYY-MM-DD HH:mm Z',
      time: true,
    },
  ],
};
