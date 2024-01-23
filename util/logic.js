const weight = {
  workload: { w1: 1, w2: 0, w3: 0 },
  //   enviroment: { w1: 1, w2: 1, w3: 1 },
  enviroment: { w1: 1, w2: 1, w3: 0 },
};

const minmax = {
  tvoc: { min: 0, max: 17384.8 },
  co2: { min: 400, max: 7256.2 },
  pm1: { min: 0, max: 464.4 },
  pm25: { min: 0, max: 500 },
  pm100: { min: 0, max: 464.4 },
  heartrate: { min: 51, max: 146 },
  // irun: { min: 51, max: 146 },
  // temp: { min: 51, max: 146 },
};

const thresholds = {
  x: { x1: 0.033, x2: 0.084, x3: 0.173, x4: 0.317 },
  y: { y1: 0.284, y2: 0.389, y3: 0.473, y4: 0.589 },
};

module.exports = {
  calcWorkLoadIndex(h, i, t) {
    h =
      (h - minmax.heartrate.min) /
      (minmax.heartrate.max - minmax.heartrate.min);
    // i = i - minmax.irun.min / minmax.irun.max - minmax.irun.min;
    // t = t - minmax.temp.min / minmax.temp.max - minmax.temp.min;

    const calculated =
      (h * weight.workload.w1 +
        i * weight.workload.w2 +
        t * weight.workload.w3) /
      (weight.workload.w1 + weight.workload.w2 + weight.workload.w3);
    return calculated;
  },

  calcEnviromentIndex(t, c, p1, p2, p3) {
    t = (t - minmax.tvoc.min) / (minmax.tvoc.max - minmax.tvoc.min);
    c = (c - minmax.co2.min) / (minmax.co2.max - minmax.co2.min);
    p1 = (p1 - minmax.pm1.min) / (minmax.pm1.max - minmax.pm1.min);
    p2 = (p2 - minmax.pm25.min) / (minmax.pm25.max - minmax.pm25.min);
    p3 = (p3 - minmax.pm100.min) / (minmax.pm100.max - minmax.pm100.min);

    const p = p1 + p2 + p3 / 3;

    const calculated =
      (t * weight.workload.w1 +
        c * weight.workload.w2 +
        p * weight.workload.w3) /
      (weight.enviroment.w1 + weight.enviroment.w2 + weight.enviroment.w3);
    return calculated;
  },

  calclevel(e, w) {
    let env_level = 1;
    for (test in thresholds.x) {
      if (thresholds.x[test] > e) break;
      env_level++;
    }
    let work_level = 1;
    for (test in thresholds.y) {
      if (thresholds.y[test] > w) break;
      work_level++;
    }

    let level = 0;

    if (
      (env_level === 1 && work_level === 1) ||
      (env_level === 2 && work_level === 1) ||
      (env_level === 3 && work_level === 1) ||
      (env_level === 1 && work_level === 2) ||
      (env_level === 1 && work_level === 3) ||
      (env_level === 2 && work_level === 2)
    ) {
      level = 1;
    } else if (
      (env_level === 1 && work_level === 4) ||
      (env_level === 1 && work_level === 5) ||
      (env_level === 2 && work_level === 3) ||
      (env_level === 2 && work_level === 4) ||
      (env_level === 3 && work_level === 2) ||
      (env_level === 3 && work_level === 3) ||
      (env_level === 4 && work_level === 1) ||
      (env_level === 4 && work_level === 2) ||
      (env_level === 5 && work_level === 1)
    ) {
      level = 2;
    } else if (
      (env_level === 2 && work_level === 5) ||
      (env_level === 3 && work_level === 4) ||
      (env_level === 3 && work_level === 5) ||
      (env_level === 4 && work_level === 3) ||
      (env_level === 4 && work_level === 4) ||
      (env_level === 5 && work_level === 3) ||
      (env_level === 5 && work_level === 2)
    ) {
      level = 3;
    } else if (
      (env_level === 4 && work_level === 5) ||
      (env_level === 5 && work_level === 4)
    ) {
      level = 4;
    } else if (env_level === 5 && work_level === 5) {
      level = 5;
    }

    return { env_level, work_level, level };
  },
};
