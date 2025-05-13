import { Request, Response } from "express";
import { checkDeliveryStatus as checkStatus } from "../services/delivery.service";
import { getAllSeries } from "../services/series.service";
import { DeliveryStatus } from "../interfaces/delivery.interface";
import { sql } from "@config/db";

export const checkDeliveryStatus = async (
  series: string,
  invoiceNumber: string
): Promise<DeliveryStatus> => {
  const cnote = `${series}/${invoiceNumber.padStart(6, "0")}`;
  const numericInvoice = parseInt(invoiceNumber); // For GoodsReceipt_Details lookup

  try {
    // First check if delivered (in GoodsReceipt_Details)
    const deliveredResult = await sql.query`
  SELECT 
    c.[Consignee],
    c.[Consigner],
    fromArea.[Area Name] AS FromPlace,
    toArea.[Area Name] AS ToPlace,
    consignee.[Name] AS ConsigneeName,
    consigner.[Name] AS ConsignerName
  FROM [GoodsReceipt_Details] g
  JOIN [CNOTE] c ON g.[DSeries] = LEFT(c.[CNote], 3) 
                 AND g.[CNumber] = CAST(RIGHT(c.[CNote], 6) AS INT)
  LEFT JOIN [CCMaster] consignee ON c.[Consignee] = consignee.[CC_CODE]
  LEFT JOIN [CCMaster] consigner ON c.[Consigner] = consigner.[CC_CODE]
  LEFT JOIN [Area_master] fromArea ON c.[FromPlace] = fromArea.[AreaCode]
  LEFT JOIN [Area_master] toArea ON c.[ToPlace] = toArea.[AreaCode]
  WHERE g.[DSeries] = ${series} 
  AND g.[CNumber] = ${numericInvoice}
`;

    if (deliveredResult.recordset.length > 0) {
      return {
        status: "delivered",
        consigner: deliveredResult.recordset[0].ConsignerName,
        consignee: deliveredResult.recordset[0].ConsigneeName,
        from: deliveredResult.recordset[0].FromPlace,
        to: deliveredResult.recordset[0].ToPlace,
      };
    }

    // Check if in transit (in CNOTE table)
    const inTransitResult = await sql.query`
      SELECT 
    c.[Consignee],
    c.[Consigner],
    fromArea.[Area Name] AS FromPlace,
    toArea.[Area Name] AS ToPlace,
    consignee.[Name] AS ConsigneeName,
    consigner.[Name] AS ConsignerName
  FROM [CNOTE] c
  LEFT JOIN [CCMaster] consignee ON c.[Consignee] = consignee.[CC_CODE]
  LEFT JOIN [CCMaster] consigner ON c.[Consigner] = consigner.[CC_CODE]
  LEFT JOIN [Area_master] fromArea ON c.[FromPlace] = fromArea.[AreaCode]
  LEFT JOIN [Area_master] toArea ON c.[ToPlace] = toArea.[AreaCode]
  WHERE c.[CNote] = ${cnote}
`;

    if (inTransitResult.recordset.length > 0) {
      return {
        status: "on the way",
        consigner: inTransitResult.recordset[0].ConsignerName,
        consignee: inTransitResult.recordset[0].ConsigneeName,
        from: inTransitResult.recordset[0].FromPlace,
        to: inTransitResult.recordset[0].ToPlace,
      };
    }

    // If not found in either table
    return {
      status: "waiting",
    };
  } catch (err) {
    console.error("Error checking delivery status:", err);
    return {
      status: "waiting",
      error: "Error checking delivery status",
    };
  }
};
