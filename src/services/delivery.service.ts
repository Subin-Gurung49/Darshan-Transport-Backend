import { sql } from '../config/db';
import { DeliveryStatus } from '../interfaces/delivery.interface';

export const checkDeliveryStatus = async (series: string, invoiceNumber: string): Promise<DeliveryStatus> => {
  const challanCode = `${series}/${invoiceNumber.padStart(6, '0')}`;
  
  try {
    // Check if delivered (in GoodsReceipt_Master)
    const deliveredResult = await sql.query`
      SELECT TOP 1 
        fm.ToCode, 
        am.[Area Name] AS ToName
      FROM GoodsReceipt_Master gm
      JOIN FreightChallan_Master fm ON gm.Challan = fm.ChallanCode
      JOIN Area_master am ON fm.ToCode = am.AreaCode
      WHERE gm.Challan = ${challanCode}
    `;
    
    if (deliveredResult.recordset.length > 0) {
      return {
        status: 'delivered',
        to: deliveredResult.recordset[0].ToName
      };
    }
    
    // Check if in transit (in FreightChallan_Master only)
    const transitResult = await sql.query`
      SELECT 
        fm.FromCode,
        fm.ToCode,
        amFrom.[Area Name] AS FromName,
        amTo.[Area Name] AS ToName
      FROM FreightChallan_Master fm
      JOIN Area_master amFrom ON fm.FromCode = amFrom.AreaCode
      JOIN Area_master amTo ON fm.ToCode = amTo.AreaCode
      WHERE fm.ChallanCode = ${challanCode}
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