import { Module } from "@nestjs/common";
import { JobProcessor } from "./job.processor";
import { BullModule } from "@nestjs/bullmq";
import { QUEUE } from "src/bullmq/constant";
import { QueueStopperModule } from "src/queue-stopper/queue-stopper.module";

@Module({
    imports: [BullModule.registerQueue({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING }, { name: QUEUE.WORKING_CHECK }), QueueStopperModule,],
    providers: [JobProcessor],
    exports: [JobProcessor]
})
export class ProcessorsModule { }