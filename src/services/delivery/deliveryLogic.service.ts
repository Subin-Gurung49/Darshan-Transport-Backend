import { DeliveryStatus } from '../../interfaces/delivery.interface';
import { AppError, ErrorTypes } from '../../middleware/errorHandler.middleware';

export const processDeliveryStatus = (record: any): DeliveryStatus => {
  if (!record) {
    throw new AppError(
      'CNote not found. Please check the entered data.',
      404,
      ErrorTypes.NOT_FOUND
    );
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
