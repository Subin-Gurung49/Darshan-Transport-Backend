import { sql } from '../config/db';
import { DeliveryStatus } from '../interfaces/delivery.interface';

export const checkDeliveryStatus = async (series: string, invoiceNumber: string): Promise<DeliveryStatus> => {
  try {
    // Check if delivered (in GoodsReceipt_Master)
    const deliveredResult = await sql.query`
      SELECT *
      FROM GoodsReceipt_Details
      WHERE DSeries = ${series} AND CNumber = ${parseInt(invoiceNumber, 10)}
    `;
    if (deliveredResult.recordset.length > 0) {
      return {
        status: 'delivered',
        to: deliveredResult.recordset[0].ToName
      };
    }
    // Check if in transit (in FreightChallan_Master only)
    const transitResult = await sql.query`
      SELECT *
      FROM FreightChallan_Master
      WHERE DSeries = ${series} AND CNumber = ${parseInt(invoiceNumber, 10)}
    `;
    if (transitResult.recordset.length > 0) {
      return {
        status: 'on the way',
        from: transitResult.recordset[0].FromName,
        to: transitResult.recordset[0].ToName
      };
    }
    // If not found in either table
    return {
      status: 'waiting'
    };
  } catch (err) {
    console.error('Error checking delivery status:', err);
    return {
      status: 'waiting',
      error: 'Error checking delivery status'
    };
  }
};