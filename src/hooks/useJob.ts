import { useState, useEffect, useCallback } from 'react';
import { jobEngine, Job } from '../services/jobEngine';

export function useJob(jobId: string | null) {
  const [job, setJob] = useState<Job | null>(null);

  useEffect(() => {
    if (!jobId) {
      setJob(null);
      return;
    }

    const unsubscribe = jobEngine.subscribe(jobId, (updatedJob) => {
      setJob(updatedJob);
    });

    return () => {
      unsubscribe();
    };
  }, [jobId]);

  const cancelJob = useCallback(() => {
    if (jobId) {
      jobEngine.cancelJob(jobId);
    }
  }, [jobId]);

  return { job, cancelJob };
}
