import { sql } from '../../config/db';
import { DeliveryStatus } from '../../interfaces/delivery.interface';
import { processDeliveryStatus } from './deliveryLogic.service';
import { AppError, ErrorTypes } from '../../middleware/errorHandler.middleware';

export const checkDeliveryStatus = async (series: string, invoiceNumber: string): Promise<DeliveryStatus> => {
  const cNote = `${series}/${invoiceNumber}`;

  try {
    // Single query to fetch all required data
    const result = await sql.query`
      SELECT
        c.CNote,
        ccConsignee.Name AS ConsigneeName,
        ccConsigner.Name AS ConsignerName,
        areaFrom.[Area Name] AS FromPlaceName,
        areaTo.[Area Name] AS ToPlaceName,
        fc.DSeries AS FreightDSeries,
        gr.DSeries AS GoodsReceiptDSeries
      FROM CNOTE c
      LEFT JOIN CCMaster ccConsignee ON c.Consignee = ccConsignee.CC_CODE
      LEFT JOIN CCMaster ccConsigner ON c.Consigner = ccConsigner.CC_CODE
      LEFT JOIN Area_master areaFrom ON c.FromPlace = areaFrom.AreaCode
      LEFT JOIN Area_master areaTo ON c.ToPlace = areaTo.AreaCode
      LEFT JOIN FreightChallan_Details fc ON fc.DSeries = ${series} AND fc.CNumber = ${parseInt(invoiceNumber, 10)}
      LEFT JOIN GoodsReceipt_Details gr ON gr.DSeries = ${series} AND gr.CNumber = ${parseInt(invoiceNumber, 10)}
      WHERE c.CNote = ${cNote}
    `;

    if (result.recordset.length === 0) {
      throw new AppError(
        'Delivery not found',
        404,
        ErrorTypes.NOT_FOUND,
        { series, invoiceNumber }
      );
    }

    const record = result.recordset[0];
    const processedStatus = processDeliveryStatus(record);

    if (!processedStatus) {
      throw new AppError(
        'Failed to process delivery status',
        500,
        ErrorTypes.BUSINESS_ERROR,
        { cnote: cNote }
      );
    }

    return processedStatus;
  } catch (error: any) { // Type assertion for error handling
    if (error instanceof AppError) {
      throw error;
    }

    // Handle SQL-specific errors
    if (error?.name === 'RequestError') {
      throw new AppError(
        'Database operation failed',
        503,
        ErrorTypes.QUERY_ERROR,
        { cnote: cNote }
      );
    }

    throw new AppError(
      'Internal server error',
      500,
      ErrorTypes.SERVER_ERROR,
      { errorMessage: error?.message || 'Unknown error' }
    );
  }
};

export const getDeliveryStatusDetails = checkDeliveryStatus;