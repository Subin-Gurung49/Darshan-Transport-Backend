import { sql } from '@config/db';
import { DeliveryStatus } from '@interfaces/delivery.interface';
import { processDeliveryStatus } from './deliveryLogic.service';

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
      return processDeliveryStatus(null);
    }

    const record = result.recordset[0];
    return processDeliveryStatus(record);
  } catch (err) {
    console.error('Error checking delivery status:', err);
    return { status: 'error', message: 'Internal server error.' };
  }
};

export const getDeliveryStatusDetails = checkDeliveryStatus;