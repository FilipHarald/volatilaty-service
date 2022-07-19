import {InfluxDB, Point, HttpError, WriteApi} from '@influxdata/influxdb-client';

// TODO: exctract to own file and use env-vars in docker-compose
const url = process.env['INFLUX_URL'] || 'http://localhost:8086'
const token = process.env['INFLUX_TOKEN'] || 'my-token'
const org = process.env['INFLUX_ORG'] || 'my-org'
const bucket = 'my-bucket'
const username = 'my-user'
const password = 'my-password'

let writeApi: WriteApi;

const init = () => {
  // TODO: set-up DB
};

const write = () => {
};

export {
  init,
  write
};


