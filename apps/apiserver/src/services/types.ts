import { Job } from 'bullmq';
import { Resources } from '../types/Resources';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface JobWithResources<DataType = any, ReturnType = any, NameType extends string = string> {
  resources: Resources;
  job: Job<DataType, ReturnType, NameType>;
}
