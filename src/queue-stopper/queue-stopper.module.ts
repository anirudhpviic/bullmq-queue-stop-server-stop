import { Module } from "@nestjs/common";
import { QueueStopperService } from "./queue-stopper.service";
import { BullModule } from "@nestjs/bullmq";
import { QUEUE } from "src/bullmq/constant";

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING })
    ],
    providers: [QueueStopperService],
    exports: [QueueStopperService]
})
export class QueueStopperModule { }