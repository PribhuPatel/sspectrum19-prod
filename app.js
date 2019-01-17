const cluster = require('cluster');
const numCPUs = require('os').cpus().length;

if (cluster.isMaster) {
  // Fork workers.
  for (var i = 0; i < numCPUs-1; i++) {
      console.log(i);
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    require('index');
  });
} else {
        require('./index');
}