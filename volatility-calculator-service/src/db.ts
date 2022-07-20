import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import { SetupAPI } from '@influxdata/influxdb-client-apis';

// TODO: exctract to own file and use env-vars in docker-compose
const url = process.env['INFLUX_URL'] || 'http://influxdb:8086'
const token = process.env['INFLUX_TOKEN'] || 'my-token'
const org = process.env['INFLUX_ORG'] || 'my-org'
const bucket = 'my-bucket'

let writeApi: WriteApi;

const log = (str: string) => console.log(`DB: ${str}`);


const init = async () => {
  writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns')
};

const writeVolatilityMetric = (rollingWindowSize: Number, version: Number, value: Number) => {
  if (writeApi) {
    const point1 = new Point(`volatility-metric-${rollingWindowSize}`)
      .tag('version', String(version))
      .floatField('value', value)
    writeApi.writePoint(point1)
  }
};

export {
  init,
  writeVolatilityMetric
};


