import winston from 'winston';


const createTransports = () => {
    const transports: any[] = [];
    if(process.env.NODE_ENV == 'development') {
      transports.push(
        new winston.transports.Console()
      )
    } else {
      transports.push(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.cli(),
            winston.format.splat(),
          )
        }),
        new winston.transports.File({
            filename: 'logs/info.log',
            level: 'info'
          })
      )
    }
    return transports;
}

const transports  = createTransports();

export { transports }