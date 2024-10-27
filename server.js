const express = require('express');
const cluster = require('cluster');
const os = require('os');
const bodyParser = require('body-parser');


if (cluster.isMaster) {
  const numCPUs = os.cpus().length;
  console.log(`Master process is running with PID ${process.pid}`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }
  cluster.on('exit', (worker, code, signal) => {
    console.log(`Worker ${worker.process.pid} exited. Starting a new worker...`);
    cluster.fork();
  });
} else {
  const app = express();
  app.use(bodyParser.json());

  // Use routes
//   app.use('/api', routes); 

const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Worker server running on port ${PORT}, PID: ${process.pid}`);
  });
}
