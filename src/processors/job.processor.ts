import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { QUEUE } from 'src/bullmq/constant';
import { QueueStopperService } from 'src/queue-stopper/queue-stopper.service';

@Processor({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING }, { concurrency: 1 })
export class JobProcessor extends WorkerHost {
    constructor(private queueStopperService: QueueStopperService) {
        super();
    }


    async onModuleInit() {
        this.queueStopperService.registerWorker(this.worker);
    }

    async process(job: Job) {
        console.log(`START job ${job.id}`);

        await new Promise((r) => setTimeout(r, 10000)); // long job

        console.log(`END job ${job.id}`);  // <-- KEY CHECKPOINT

        return { success: true };
    }
}
