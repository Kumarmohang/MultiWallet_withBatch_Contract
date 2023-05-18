const storageType: Storage = localStorage; // localStorage || sessionStorage

/**
 * @description This function set data to desired storage
 * @param {string} keyName
 * @param {Object} value
 * @returns void
 */
export const setData = (keyName: string, value: any): void => {
  storageType.setItem(keyName, JSON.stringify(value));
};
/**
 * @description This function delete all data from desired storage
 * @returns {void} void
 */
export const deleteData = (): void => {
  storageType.clear();
};
/**
 * @description This function get data from desired storage
 * @param {string} keyName
 * @returns {Object} value
 */
export const getData = (keyName: string): object | null => {
  let data = null;
  try {
    const storageData = storageType.getItem(keyName);
    if (storageData) {
      data = JSON.parse(storageData);
    } else {
      deleteData();
    }
  } catch (error) {
    deleteData();
    location.reload();
  }
  return data;
};
