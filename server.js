const express = require('express');
const cluster = require('cluster');
const os = require('os');
const bodyParser = require('body-parser');
const AppError = require('./utils/appError');
const globalErrorHandler=require('./utils/errorController');
const db=require('./config/database');
const userRouter = require('./routes/UserRouter');
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
db.connect();
  // Use routes
//   app.use('/api', routes);

app.use('/api/v1/users', userRouter);

const PORT = process.env.PORT || 4000;


app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log(`Worker server running on port ${PORT}, PID: ${process.pid}`);
  });
}
