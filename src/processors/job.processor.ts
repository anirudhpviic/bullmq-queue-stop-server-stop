import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job, Worker } from 'bullmq';
import { QUEUE } from 'src/bullmq/constant';

@Processor({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING }, { concurrency: 1 })
export class JobProcessor extends WorkerHost {

    private workerRef: Worker;

    onReady(worker: Worker) {
        this.workerRef = worker;
    }

    async process(job: Job) {
        console.log(`START job ${job.id}`);

        await new Promise((r) => setTimeout(r, 50000)); // long job

        console.log(`END job ${job.id}`);  // <-- KEY CHECKPOINT

        return { success: true };
    }

    async onModuleInit() {
        process.on('SIGTERM', async () => {
            console.log("SIGTERM RECEIVED");  // <-- MUST SEE THIS

            await this.workerRef.pause();
            console.log("PAUSED");

            while (this.workerRef.isRunning()) {
                console.log("Still running...");
                await new Promise((r) => setTimeout(r, 1000));
            }

            console.log("NO ACTIVE JOBS — closing");

            await this.workerRef.close();
            process.exit(0);
        });
    }
}
