import { computePercent } from '..';

describe('computePercent', () => {
  test('常规情况', () => {
    const data1 = [
      { type: 'a', value: 100 },
      { type: 'b', value: 200 },
      { type: 'c', value: 300 },
      { type: 'd', value: 400 },
    ];

    const data2 = [
      { type: 'a', value: 100 },
      { type: 'e', value: 0 },

      { type: 'b', value: 200 },
      { type: 'c', value: 300 },
      { type: 'f', value: 0 },
      { type: 'd', value: 400 },
    ];

    const data3 = [
      { type: 'a', value: 1 },
      { type: 'b', value: 3 },
      { type: 'c', value: 5 },
      { type: 'd', value: 7 },
    ];

    expect(computePercent(data1, 'value')).toEqual([
      { type: 'a', value: 100, percent: 10 },
      { type: 'b', value: 200, percent: 20 },
      { type: 'c', value: 300, percent: 30 },
      { type: 'd', value: 400, percent: 40 },
    ]);

    expect(computePercent(data2, 'value')).toEqual([
      { type: 'a', value: 100, percent: 10 },
      { type: 'e', value: 0, percent: 0 },
      { type: 'b', value: 200, percent: 20 },
      { type: 'c', value: 300, percent: 30 },
      { type: 'f', value: 0, percent: 0 },
      { type: 'd', value: 400, percent: 40 },
    ]);

    expect(computePercent(data3, 'value', 1)).toEqual([
      { type: 'a', value: 1, percent: Math.floor((1 / 16) * 1000) / 10 },
      { type: 'b', value: 3, percent: Math.floor((3 / 16) * 1000) / 10 },
      { type: 'c', value: 5, percent: Math.floor((5 / 16) * 1000) / 10 },
      {
        type: 'd',
        value: 7,
        percent:
          (100 * 10 -
            Math.floor((1 / 16) * 1000) -
            Math.floor((3 / 16) * 1000) -
            Math.floor((5 / 16) * 1000)) /
          10,
      },
    ]);

    expect(computePercent(data3, 'value', 2)).toEqual([
      { type: 'a', value: 1, percent: Math.floor((1 / 16) * 100 * 100) / 100 },
      { type: 'b', value: 3, percent: Math.floor((3 / 16) * 100 * 100) / 100 },
      { type: 'c', value: 5, percent: Math.floor((5 / 16) * 100 * 100) / 100 },
      {
        type: 'd',
        value: 7,
        percent:
          (100 * 100 -
            Math.floor((1 / 16) * 100 * 100) -
            Math.floor((3 / 16) * 100 * 100) -
            Math.floor((5 / 16) * 100 * 100)) /
          100,
      },
    ]);
  });

  test('其中一项数据量特别大', () => {
    const data1 = [
      { type: 'a', value: 99999 },
      { type: 'b', value: 1 },
      { type: 'c', value: 1 },
      { type: 'd', value: 1 },
    ];

    expect(computePercent(data1, 'value')).toEqual([
      { type: 'a', value: 99999, percent: 97 },
      { type: 'b', value: 1, percent: 1 },
      { type: 'c', value: 1, percent: 1 },
      { type: 'd', value: 1, percent: 1 },
    ]);

    expect(computePercent(data1, 'value', 1)).toEqual([
      { type: 'a', value: 99999, percent: 99.7 },
      { type: 'b', value: 1, percent: 0.1 },
      { type: 'c', value: 1, percent: 0.1 },
      { type: 'd', value: 1, percent: 0.1 },
    ]);

    expect(computePercent(data1, 'value', 2)).toEqual([
      { type: 'a', value: 99999, percent: 99.97 },
      { type: 'b', value: 1, percent: 0.01 },
      { type: 'c', value: 1, percent: 0.01 },
      { type: 'd', value: 1, percent: 0.01 },
    ]);

    expect(computePercent(data1, 'value', 3)).toEqual([
      { type: 'a', value: 99999, percent: 99.997 },
      { type: 'b', value: 1, percent: 0.001 },
      { type: 'c', value: 1, percent: 0.001 },
      { type: 'd', value: 1, percent: 0.001 },
    ]);
  });
});
