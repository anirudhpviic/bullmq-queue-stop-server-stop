import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE } from 'src/bullmq/constant';

@Processor({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING })
export class JobProcessor extends WorkerHost {

    async process(job: Job<any, any, string>) {
        console.log(`Processing job ${job.id}`);

        await new Promise((resolve) => setTimeout(resolve, 5000)); // long job

        console.log(`Job ${job.id} completed`);

        return { success: true };
    }

    // Graceful shutdown hook
    async onModuleDestroy() {
        console.log('🛑 Gracefully shutting down worker...');

        // 1. Stop taking new jobs
        await this.worker.pause(true);

        // 2. Wait for active jobs to finish
        await this.worker.close();

        console.log('✅ Worker shutdown complete');
    }
}
