module.exports = {
  apps: [
    {
      name: "api",
      script: "src/server.ts",
      interpreter: "./node_modules/.bin/tsx",
    },
    {
      name: "worker",
      script: "src/workers/index.ts",
      interpreter: "./node_modules/.bin/tsx",
    },
  ],
};