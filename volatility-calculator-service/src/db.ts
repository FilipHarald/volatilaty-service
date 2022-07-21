import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import _ from 'lodash';

const url = process.env['INFLUX_URL'] || 'http://localhost:8086'
const token = process.env['INFLUX_TOKEN'] || 'my-token'
const org = process.env['INFLUX_ORG'] || 'my-org'
const bucket = process.env['INFLUX_BUCKET'] || 'my-bucket'

let writeApi: WriteApi;

const init = async () => {
  writeApi = new InfluxDB({url, token}).getWriteApi(org, bucket, 'ns')
};

const writeVolatilityMetric = (value: Number, tags: string[][]) => {
  if (writeApi && value) {
    const point1 = new Point(`volatility-metric`)
      .floatField('value', value)
    _.forEach(tags, (t) => {
      point1.tag(t[0], t[1])
    });
    writeApi.writePoint(point1)
  }
};

export {
  init,
  writeVolatilityMetric
};


