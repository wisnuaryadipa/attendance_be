module.exports = {
    apps : [{
      name   : "api-attendance",
      script : "./src/app.ts",
      interoreter: 'node',
      interpreter_args: '-- -r tsconfig-paths/register -r ts-node/register',
      merge_logs: true,
      max_restarts: 20,
    }]
  }