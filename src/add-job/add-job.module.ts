import { Module } from "@nestjs/common";
import { AddJobController } from "./add-job.controller";
import { AddJobService } from "./add-job.service";
import { BullModule } from "@nestjs/bullmq";
import { QUEUE } from "src/bullmq/constant";

@Module({
    imports: [
        BullModule.registerQueue({ name: QUEUE.QUEUE_STOP_SERVER_STOP_TESTING })
    ],
    controllers: [AddJobController],
    providers: [AddJobService]
})
export class AddJobModule { }