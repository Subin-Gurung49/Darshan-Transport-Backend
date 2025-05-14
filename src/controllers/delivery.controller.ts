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

    // Check if CNote exists in CNOTE table
    const cNoteResult = await sql.query`
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

    if (cNoteResult.recordset.length === 0) {
      return {
        status: "error",
        message: "CNote not found. Please check the entered series and invoice number.",
      };
    }

    // Check if in GoodsReceipt_Details
    const goodsReceiptResult = await sql.query`
      SELECT *
      FROM [GoodsReceipt_Details]
      WHERE [DSeries] = ${series} AND [CNumber] = ${numericInvoice}
    `;

    // Check if in FreightChallan_Master
    const freightResult = await sql.query`
      SELECT *
      FROM [FreightChallan_Master]
      WHERE [DSeries] = ${series} AND [CNumber] = ${numericInvoice}
    `;

    if (goodsReceiptResult.recordset.length > 0) {
      return {
        status: "arrived",
        consigner: cNoteResult.recordset[0].ConsignerName,
        consignee: cNoteResult.recordset[0].ConsigneeName,
        from: cNoteResult.recordset[0].FromPlace,
        to: cNoteResult.recordset[0].ToPlace,
      };
    }

    if (freightResult.recordset.length > 0) {
      return {
        status: "on the way",
        consigner: cNoteResult.recordset[0].ConsignerName,
        consignee: cNoteResult.recordset[0].ConsigneeName,
        from: cNoteResult.recordset[0].FromPlace,
        to: cNoteResult.recordset[0].ToPlace,
      };
    }

    return {
      status: "successful",
      consigner: cNoteResult.recordset[0].ConsignerName,
      consignee: cNoteResult.recordset[0].ConsigneeName,
      from: cNoteResult.recordset[0].FromPlace,
      to: cNoteResult.recordset[0].ToPlace,
    };
  } catch (err) {
    console.error("Error checking delivery status:", err);
    return {
      status: "waiting",
      message: "Error checking delivery status",
    };
  }
};
