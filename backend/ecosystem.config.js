// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config()

module.exports = {
  apps: [
    {
      name: 'fio-e-flor-api',
      script: './dist/server.js',
      env: {
        NODE_ENV: 'production',
        ...process.env,
      },
    },
  ],
}