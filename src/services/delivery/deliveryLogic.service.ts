import { DeliveryStatus } from '@interfaces/delivery.interface';

export const processDeliveryStatus = (record: any): DeliveryStatus => {
  if (!record) {
    return { status: 'error', message: 'CNote not found. Please check the entered data.' };
  }

  let status: DeliveryStatus['status'] = 'waiting';

  if (record.GoodsReceiptDSeries) {
    status = 'delivered';
  } else if (record.FreightDSeries) {
    status = 'ongoing';
  }

  return {
    status,
    consignee: record.ConsigneeName || 'Unknown',
    consigner: record.ConsignerName || 'Unknown',
    from: record.FromPlaceName || 'Unknown',
    to: record.ToPlaceName || 'Unknown',
  };
};
