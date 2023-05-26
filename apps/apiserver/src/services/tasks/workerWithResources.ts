import { Job, Worker, WorkerOptions } from 'bullmq';
import { contextFactory } from '../../context';
import { JobWithResources } from '../types';
import { helloJob } from './jobDefinitions/helloJob';

export const workerWithResources = (name: string, opts: WorkerOptions) => {
  const [, , resources] = contextFactory();
  const worker = new Worker(name, async (job: Job) => {
    const jobWithResources: JobWithResources = {
      job,
      resources,
    };
    switch (job.name) {
      case 'hello':
        await helloJob(jobWithResources);
    }
  }, opts);
  return worker;
}