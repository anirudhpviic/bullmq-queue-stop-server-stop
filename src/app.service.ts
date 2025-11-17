import { Injectable } from '@nestjs/common';
import { QueueStopperService } from './queue-stopper/queue-stopper.service';

@Injectable()
export class AppService {
  constructor(private stopper: QueueStopperService) { }

  async onModuleInit() {
    process.on('SIGINT', async () => {
      console.log("SIGINT received. Stopping queues...");
      await this.stopper.stopAll();
      await new Promise((r) => setTimeout(r, 65000));
      await this.stopper.closeAll();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log("SIGTERM received. Stopping queues...");
      await this.stopper.stopAll();
      await new Promise((r) => setTimeout(r, 65000));
      await this.stopper.closeAll();
      process.exit(0);
    });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
