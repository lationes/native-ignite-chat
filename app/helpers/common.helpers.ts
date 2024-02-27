import moment from "moment";

export function calcPercentage(x: number, y: number, fixed = 2) {
  const percent = (x / y) * 100;

  if (!isNaN(percent)) {
    return Number(percent.toFixed(fixed));
  } else {
    return null;
  }

}

export function buildUrlParams(params: any) {
  const queryString = Object.keys(params)
      .map(key => {
        if (Array.isArray(params[key])) {
          // If the value is an array, format it with square brackets
          return params[key].map(item => `${encodeURIComponent(key)}%5B%5D=${encodeURIComponent(item)}`).join('&');
        } else {
          // For non-array values, encode key and value normally
          return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
        }
      })
      .join('&');

  return '?' + queryString;
}

export function convertDateToAmericanFormat(date: string | Date) {
   return moment(date).format('MM-DD-YYYY');
}

