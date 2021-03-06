import { store } from "src/store";

export const getAuth = (): string => {
  const storeState = store.getState();
  const token = storeState.signin?.session?.token;
  return token ? `Bearer ${token}` : "";
};
