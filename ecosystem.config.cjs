module.exports = {
  apps: [
    {
      name: "api",
      script: "src/index.ts",
      interpreter: "./node_modules/.bin/tsx",
    },
    {
      name: "worker",
      script: "src/worker.ts",
      interpreter: "./node_modules/.bin/tsx",
    },
  ],
};