import apiClient, { discardHeader, setHeader } from "./apiClient";
export * as session from "./sessionManagement";

export function indexOf(list: Array<object>, item: object): number {
  return list.findIndex((x) => JSON.stringify(x) === JSON.stringify(item));
}

export const isEmpty = (obj: object): boolean => !Object.keys(obj || {}).length;
export const headerUtils = { discardHeader, setHeader };
export default apiClient;
