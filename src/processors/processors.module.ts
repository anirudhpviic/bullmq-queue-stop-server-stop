import { Module } from "@nestjs/common";
import { JobProcessor } from "./job.processor";
import { BullModule } from "@nestjs/bullmq";
import { QUEUE } from "src/bullmq/constant";

@Module({
    imports: [BullModule.registerQueue({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING }, { name: QUEUE.WORKING_CHECK })],
    providers: [JobProcessor],
    exports: [JobProcessor]
})
export class ProcessorsModule { }