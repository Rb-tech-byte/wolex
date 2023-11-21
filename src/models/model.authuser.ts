import { Expose, instanceToPlain, plainToInstance, Type } from 'class-transformer';
import 'reflect-metadata';

export class AuthUser {
  @Expose({ name: 'id' }) id: string = '';
  @Expose() uid: string = '';
  @Expose() appBuildNumbery: number = 0;
  @Expose() appVersion: string = '';
  @Expose() email: string = '';
  @Expose() firstName: string = '';
  @Expose() lastName: string = '';
  @Expose() name: string = '';
  @Expose() profileImageUrl: string = '';
  @Expose() isActive: boolean = true;
  @Expose() isNotificationEnabled: boolean = true;
  @Expose() @Type(() => Date) subBillingIssueDetectedAt?: Date | null = null;
  @Expose() @Type(() => Date) subExpirationDate?: Date | null = null;
  @Expose() subIsActive: boolean = false;
  @Expose() subIsLifetime: boolean = false;
  @Expose() subIsSandbox: boolean = false;
  @Expose() @Type(() => Date) subLatestPurchaseDate?: Date | null = null;
  @Expose() @Type(() => Date) subOriginalPurchaseDate?: Date | null = null;
  @Expose() subPeriodType: string = '';
  @Expose() subProductIdentifier: string = '';
  @Expose() @Type(() => Date) subUnsubscribeDetectedAt?: Date | null = null;
  @Expose() subWillRenew: boolean = false;
  @Expose() @Type(() => Date) timestampCreated?: Date | null = null;
  @Expose() @Type(() => Date) timestampLastLogin?: Date | null = null;
  @Expose() @Type(() => Date) timestampUpdated?: Date | null = null;

  static fromJson(json: any): AuthUser {
    return plainToInstance(AuthUser, json, { exposeDefaultValues: true, excludeExtraneousValues: true });
  }

  static toJson(order: AuthUser): any {
    return instanceToPlain(order);
  }
}
