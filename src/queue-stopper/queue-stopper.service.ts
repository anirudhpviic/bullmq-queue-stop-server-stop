import { Injectable } from '@nestjs/common';

@Injectable()
export class QueueStopperService {
    private workers: any[] = [];

    // Call this method from your processors to register them
    registerWorker(worker: any) {
        this.workers.push(worker);
    }

    async stopAll() {
        console.log("Pausing all workers on this server...");

        const pausePromises = this.workers.map(async (worker) => {
            if (worker && typeof worker.pause === 'function') {
                await worker.pause();
                console.log(`Worker paused: ${worker.name}`);
            }
        });

        await Promise.all(pausePromises);

        console.log("All workers on this server paused.");
    }

    async closeAll() {
        console.log("Closing all workers on this server...");

        const closePromises = this.workers.map(async (worker) => {
            if (worker && typeof worker.close === 'function') {
                await worker.close();
                console.log(`Worker closed: ${worker.name}`);
            }
        });

        await Promise.all(closePromises);

        console.log("All workers on this server closed.");
    }
}