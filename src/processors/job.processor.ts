import { Processor, WorkerHost, OnWorkerEvent } from '@nestjs/bullmq';
import { Job, Worker } from 'bullmq';
import { QUEUE } from 'src/bullmq/constant';

@Processor(QUEUE.QUEUE_STOP_SERVER_STOP_TESTING, {
    concurrency: 1, // VERY IMPORTANT for graceful shutdown
})
export class JobProcessor extends WorkerHost {

    private workerRef: Worker;

    async process(job: Job) {
        console.log(`Processing job ${job.id}`);

        await new Promise((resolve) => setTimeout(resolve, 50000));

        console.log(`Job ${job.id} completed`);

        return { success: true };
    }

    // NestJS gives worker instance here
    onReady(worker: Worker) {
        this.workerRef = worker;
    }

    async onModuleInit() {
        process.on('SIGTERM', async () => {
            console.log("SIGTERM received... pausing worker...");

            // 1. Stop accepting new jobs
            await this.workerRef.pause();
            console.log("Worker paused");

            // 2. Wait for active job to finish
            while (this.workerRef.isRunning()) {
                console.log("Waiting for active job to finish...");
                await new Promise((r) => setTimeout(r, 1000));
            }

            console.log("Active job finished. Closing worker...");

            // 3. Safe close
            await this.workerRef.close();

            console.log("Worker closed. Exiting...");
            process.exit(0);
        });
    }
}
