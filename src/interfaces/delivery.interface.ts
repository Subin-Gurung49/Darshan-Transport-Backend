export interface DeliveryStatus {
  status: 'waiting' | 'on the way' | 'delivered';
  consignee?: string;
  consigner?: string;
  from?: string;
  to?: string;
  error?: string;
}