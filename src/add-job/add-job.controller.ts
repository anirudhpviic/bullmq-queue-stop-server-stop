import { Controller, Get } from "@nestjs/common";
import { AddJobService } from "./add-job.service";

@Controller('add-job')
export class AddJobController {
    constructor(private addJobService: AddJobService) { }

    @Get()
    async addJob() {
        await this.addJobService.addJob();
        return 'success';
    }
}