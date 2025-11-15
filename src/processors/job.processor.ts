import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE } from 'src/bullmq/constant';

// @Processor({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING })
export class JobProcessor extends WorkerHost {

    async process(job: Job<any, any, string>) {
        console.log(`Processing job ${job.id}`);

        await new Promise((resolve) => setTimeout(resolve, 50000)); // long job

        console.log(`Job ${job.id} completed`);

        return { success: true };
    }

    async onModuleInit() {
        process.on('SIGTERM', async () => {
            console.log("SIGTERM received... starting graceful shutdown");

            await this.worker.pause(true);   // stop taking new jobs
            console.log("Worker paused");

            await this.worker.close();       // finish active job
            console.log("Worker closed");

            process.exit(0);
        });
    }
}
