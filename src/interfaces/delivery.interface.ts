export interface DeliveryStatus {
  status: 'waiting' | 'on the way' | 'delivered' | 'error' | 'arrived' | 'successful';
  consignee?: string;
  consigner?: string;
  from?: string;
  to?: string;
  message?: string; // For error messages
  error?: string; // Optional error property for error messages
}