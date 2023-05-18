import { deleteData, getData, setData } from "./storageService";

export const clearSession = (): void => {
  deleteData();
};

type Session = {
  token: string;
};

export const addSession = (session: Session): void => {
  setData("isLoggedIn", true);
  setData(`Token`, session.token);
};

export const checkIfLogin = (): boolean => !!getData("isLoggedIn") || false;

export const getAuthHeader = (): object | string | null => getData(`Token`);
