import { promisify } from "util";
export const wait = promisify(setTimeout);

export const choose = (arr) => {
  return arr[Math.floor(Math.random() * arr.length)];
};
