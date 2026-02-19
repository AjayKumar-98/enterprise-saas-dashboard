import { delay } from './delay';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface Job {
  id: string;
  type: string;
  status: JobStatus;
  progress: number;
  startedAt?: Date;
  completedAt?: Date;
  error?: string;
  metadata?: Record<string, unknown>;
}

type JobUpdateListener = (job: Job) => void;

export class JobEngine {
  private jobs: Map<string, Job> = new Map();
  private listeners: Map<string, Set<JobUpdateListener>> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();

  createJob(type: string, metadata?: Record<string, unknown>): Job {
    const job: Job = {
      id: crypto.randomUUID(),
      type,
      status: 'pending',
      progress: 0,
      metadata,
    };

    this.jobs.set(job.id, job);
    return structuredClone(job);
  }

  async startJob(
    jobId: string,
    options: {
      duration?: number;
      failRate?: number;
      steps?: number;
    } = {}
  ): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    const { duration = 5000, failRate = 0.15, steps = 10 } = options;

    job.status = 'processing';
    job.startedAt = new Date();
    job.progress = 0;
    this.notifyListeners(jobId);

    const stepDuration = duration / steps;
    const progressIncrement = 100 / steps;

    const interval = setInterval(() => {
      const currentJob = this.jobs.get(jobId);
      if (!currentJob || currentJob.status !== 'processing') {
        clearInterval(interval);
        this.intervals.delete(jobId);
        return;
      }

      currentJob.progress = Math.min(
        currentJob.progress + progressIncrement,
        100
      );
      this.notifyListeners(jobId);

      if (currentJob.progress >= 100) {
        clearInterval(interval);
        this.intervals.delete(jobId);

        if (Math.random() < failRate) {
          currentJob.status = 'failed';
          currentJob.error = 'Job processing failed';
        } else {
          currentJob.status = 'completed';
        }

        currentJob.completedAt = new Date();
        this.notifyListeners(jobId);
      }
    }, stepDuration);

    this.intervals.set(jobId, interval);
  }

  subscribe(jobId: string, listener: JobUpdateListener): () => void {
    if (!this.listeners.has(jobId)) {
      this.listeners.set(jobId, new Set());
    }

    this.listeners.get(jobId)!.add(listener);

    const job = this.jobs.get(jobId);
    if (job) {
      listener(structuredClone(job));
    }

    return () => {
      this.listeners.get(jobId)?.delete(listener);
    };
  }

  getJob(jobId: string): Job | undefined {
    const job = this.jobs.get(jobId);
    return job ? structuredClone(job) : undefined;
  }

  cancelJob(jobId: string): void {
    const interval = this.intervals.get(jobId);
    if (interval) {
      clearInterval(interval);
      this.intervals.delete(jobId);
    }

    const job = this.jobs.get(jobId);
    if (job && job.status === 'processing') {
      job.status = 'failed';
      job.error = 'Job cancelled';
      job.completedAt = new Date();
      this.notifyListeners(jobId);
    }
  }

  private notifyListeners(jobId: string): void {
    const job = this.jobs.get(jobId);
    const listeners = this.listeners.get(jobId);

    if (job && listeners) {
      const clonedJob = structuredClone(job);
      listeners.forEach((listener) => listener(clonedJob));
    }
  }

  cleanup(jobId: string): void {
    this.cancelJob(jobId);
    this.jobs.delete(jobId);
    this.listeners.delete(jobId);
  }
}

export const jobEngine = new JobEngine();
