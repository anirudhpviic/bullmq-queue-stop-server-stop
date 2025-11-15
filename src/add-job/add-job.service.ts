import { InjectQueue } from "@nestjs/bullmq";
import { Injectable, Optional } from "@nestjs/common";
import { Queue } from "bullmq";
import { QUEUE } from "src/bullmq/constant";

@Injectable()
export class AddJobService {
    constructor(
        @Optional() @InjectQueue(QUEUE.QUEUE_STOP_SERVER_STOP_TESTING) private queueStopServerStopTesting?: Queue
    ) { }

    async addJob() {
        if (this.queueStopServerStopTesting) {
            await this.queueStopServerStopTesting.add('job1', { foo: 'bar' });
        }
    }
}