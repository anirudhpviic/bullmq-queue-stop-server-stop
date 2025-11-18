import { Injectable, Optional } from '@nestjs/common';
import { QueueStopperService } from './queue-stopper/queue-stopper.service';
import { InjectQueue } from '@nestjs/bullmq';
import { QUEUE } from './bullmq/constant';
import { Queue } from 'bullmq';

@Injectable()
export class AppService {
  constructor(
    private stopper: QueueStopperService,
    @Optional() @InjectQueue(QUEUE.WORKING_CHECK) private queueWorkingCheck?: Queue,
  ) { }

  async onModuleInit() {
    ['SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK'].forEach(sig => {
      process.on(sig, async () => {
        console.log(`${sig} received. Stopping queues...`);
        if (this.queueWorkingCheck) {
          await this.queueWorkingCheck.add(`${sig}-job`, { foo: 'bar' }, { attempts: 1 });
        }
        await this.stopper.stopAll();
        // feels like stopper already waiting for the current processing jobs to complete
        // await new Promise((r) => setTimeout(r, 65000));
        await this.stopper.closeAll();
        process.exit(0);
      });
    });


    // process.on('SIGTERM', async () => {
    //   console.log("SIGTERM received. Stopping queues...");
    //   if (this.queueWorkingCheck) {
    //     await this.queueWorkingCheck.add('sigterm-job', { foo: 'bar' }, { attempts: 1 });
    //   }
    //   await this.stopper.stopAll();
    //   // await new Promise((r) => setTimeout(r, 65000));
    //   await this.stopper.closeAll();
    //   process.exit(0);
    // });
  }

  getHello(): string {
    return 'Hello World!';
  }
}
