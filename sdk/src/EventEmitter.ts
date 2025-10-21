import EventEmitter3 from 'eventemitter3';
import type { OracleEvent } from './types';

export class EventEmitter extends EventEmitter3<{
  connected: () => void;
  disconnected: () => void;
  dataUpdate: (data: any) => void;
  error: (error: Error) => void;
  validatorUpdate: (data: any) => void;
}> {
  
  emit<T extends keyof OracleEvent>(event: T, data: any): boolean {
    return super.emit(event as string, data);
  }

  on<T extends keyof OracleEvent>(event: T, listener: (data: any) => void): this {
    return super.on(event as string, listener);
  }

  off<T extends keyof OracleEvent>(event: T, listener: (data: any) => void): this {
    return super.off(event as string, listener);
  }

  once<T extends keyof OracleEvent>(event: T, listener: (data: any) => void): this {
    return super.once(event as string, listener);
  }
}
