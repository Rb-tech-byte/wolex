import { Expose, instanceToPlain, plainToInstance, Type } from 'class-transformer';
import 'reflect-metadata';

export class Announcement {
  @Expose({ name: 'id' }) id: string = '';
  @Expose() title: string = '';
  @Expose() description: string = '';
  @Expose() link: string = '';
  @Expose() imageUrl: string = '';
  @Expose() @Type(() => Date) timestampCreated?: Date | null = null;
  @Expose() @Type(() => Date) timestampUpdated?: Date | null = null;

  static fromJson(json: any): Announcement {
    return plainToInstance(Announcement, json, { exposeDefaultValues: true, excludeExtraneousValues: true });
  }

  static toJson(order: Announcement): any {
    return instanceToPlain(order);
  }
}
