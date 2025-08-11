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
    consigner: record.ConsignerName || 'Unknown',
    consignee: record.ConsigneeName || 'Unknown',
    from: record.FromPlaceName || 'Unknown',
    to: record.ToPlaceName || 'Unknown',
  };
};
