import { JobWithResources } from "../../types";


export const helloJob = ({ resources, job }: JobWithResources): Promise<void> => {
  console.log('Hello job ', new Date().toISOString());
  return Promise.resolve();
};
