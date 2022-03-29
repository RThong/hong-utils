// 获取类型为number的key
type GetNumKey<T extends { [key: string]: unknown }, U extends keyof T = keyof T> = U extends U
  ? T[U] extends number
    ? U
    : never
  : never;

// type A = GetNumKey<{ a: number; b: string; c: boolean }>

/**
 * 计算对象数组中的每项所占百分比，返回的每项中的percent是number类型，展示时需要加上%
 * 不会修改原数据，返回的新数组是在每项上加上新的percent属性
 *
 * 采用Math.floor向下取整，不使用四舍五入是因为当其中一项特别大时，会出现前几项四舍五入后就已经是100%的情况
 * @param arr 数据对象数组
 * @param valueKey 具体数量对应的key
 * @param fractionDigits 保留小数位数，默认不保留
 * @returns 返回的新数组
 */

const computePercent = <T extends { [key: string]: unknown }, Q extends GetNumKey<T>>(
  arr: T[],
  valueKey: Q,
  fractionDigits = 0,
) => {
  const total = arr.reduce((prev, curr) => prev + (curr[valueKey] as number), 0);

  // 标记百分比过大的数据的数量
  let bigNum = 0;

  const getZeroStr = () => new Array(fractionDigits - 1).fill('0').join('');

  // 有的数据项太小，floor之后会变成0，所以要手动给个最小值
  const getPercent = (val: number) =>
    Math.floor((val / total) * 100 * coefficient) === 0
      ? fractionDigits > 0
        ? Number(`0.${getZeroStr()}1`) * coefficient
        : 1
      : Math.floor((val / total) * 100 * coefficient);

  // 过滤掉数字为0的数据项后数组的长度
  const filteredZeroArr = arr
    .filter((item) => (item[valueKey] as number) !== 0)
    .map((item) => {
      const temp = Math.floor(((item[valueKey] as number) / total) * 100);
      // 超过90%就标记
      if (temp > 90) {
        bigNum = item[valueKey] as number;
      }
      return {
        ...item,
        tempPercent: temp,
      };
    });

  let tempIndex = 0;
  let tempPercent = 0;

  // 处理js浮点数不精确的问题
  // 保留几位小数，就放大对应倍数的系数
  const coefficient = Math.pow(10, fractionDigits);

  // 如果没有单个数据项超过90%，则按照默认的方式计算，最后一项是100%去减去之前的百分比
  if (!bigNum) {
    return arr.map((item) => {
      if ((item[valueKey] as number) === 0) {
        return {
          ...item,
          percent: 0,
        };
      }

      if (tempIndex === filteredZeroArr.length - 1) {
        return {
          ...item,
          percent: (100 * coefficient - tempPercent) / coefficient,
        };
      }

      const percent = getPercent(item[valueKey] as number);

      tempIndex += 1;
      tempPercent += percent;

      return {
        ...item,
        percent: percent / coefficient,
      };
    });
  }

  // 如果有单个数据项超过90%，则先计算其他，再计算该数据项
  return arr
    .map((item) => {
      if ((item[valueKey] as number) === 0) {
        return {
          ...item,
          percent: 0,
        };
      }

      if ((item[valueKey] as number) !== bigNum) {
        const percent = getPercent(item[valueKey] as number);

        tempIndex += 1;
        tempPercent += percent;

        return {
          ...item,
          percent: percent / coefficient,
        };
      }
      return item;
    })
    .map((item) =>
      (item[valueKey] as number) === bigNum
        ? {
            ...item,
            percent: (100 * coefficient - tempPercent) / coefficient,
          }
        : item,
    ) as (T & { percent: number })[];
};

export default computePercent;
