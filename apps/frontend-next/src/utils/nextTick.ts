import { sleep } from "./sleep";

export const nextTick = <T>(callback: () => T) => sleep(0, callback);
