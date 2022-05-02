import { nanoid } from 'nanoid/non-secure'
export class Subscribable {
    subscribers: Map<string, (obj: any) => void>;
    constructor() {
        this.subscribers = new Map();
    }
    public Subscribe(updateFuction: (obj: any) => void): string {
        const tempname = nanoid(10)
        this.subscribers.set(tempname, updateFuction)
        return tempname
    }
    public Unsubscribe(name: string) {
        this.subscribers.delete(name)
    }

    updateSubScribers() {
        this.subscribers.forEach(updateFunction => {
            updateFunction(this);
        });
    }
}