export type DeliveryStatusType = 'error' | 'waiting' | 'ongoing' | 'delivered' | 'arrived' | 'successful';

export interface DeliveryStatus {
  status: DeliveryStatusType;
  consigner?: string;
  consignee?: string;
  from?: string;
  to?: string;
  message?: string; // For error messages
  error?: string; // Optional error property for error messages
}