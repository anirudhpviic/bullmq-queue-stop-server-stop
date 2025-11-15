import { Module } from "@nestjs/common";
import { JobProcessor } from "./job.processor";

@Module({
    providers: [JobProcessor],
    exports: [JobProcessor]
})
export class ProcessorsModule { }