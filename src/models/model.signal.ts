import { Expose, instanceToPlain, plainToInstance, Type } from 'class-transformer';
import 'reflect-metadata';

export class Signal {
  @Expose({ name: 'id' }) id: string = '';
  @Expose() symbol: string = '';
  @Expose() entry: number = 0;
  @Expose() stopLoss: number = 0;
  @Expose() takeProfit1: number = 0;
  @Expose() takeProfit2: number = 0;
  @Expose() comment: string = '';
  @Expose() type: string = '';
  @Expose() isActive: boolean = true;
  @Expose() isFree: boolean = false;
  @Expose() @Type(() => Date) signalDate?: Date | null = null;
  @Expose() @Type(() => Date) signalTime?: Date | null = null;
  @Expose() @Type(() => Date) signalDatetime?: Date | null = null;
  @Expose() @Type(() => Date) timestampCreated?: Date | null = null;
  @Expose() @Type(() => Date) timestampUpdated?: Date | null = null;

  static fromJson(json: any): Signal {
    return plainToInstance(Signal, json, { exposeDefaultValues: true, excludeExtraneousValues: true });
  }

  static toJson(order: Signal): any {
    return instanceToPlain(order);
  }
}
