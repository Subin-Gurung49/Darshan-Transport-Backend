import { Request, Response, RequestHandler } from 'express';
import { sql } from '@config/db';

export const getDeliveryStatus: RequestHandler = async (req, res) => {
    const series = req.query.series as string;
    const invoiceNumber = req.query.invoiceNumber as string;

    if (!series || !invoiceNumber) {
        res.status(400).json({ message: 'Series and Invoice Number are required.' });
        return;
    }

    const cNote = `${series}/${invoiceNumber}`;

    try {
        // Check if CNote exists in CNOTE table
        const cNoteResult = await sql.query`
            SELECT CNote, Consignee, Consigner, FromPlace, ToPlace
            FROM CNOTE
            WHERE CNote = ${cNote}
        `;

        if (cNoteResult.recordset.length === 0) {
            res.status(404).json({
                message: 'CNote not found. Please check the entered data.',
                status: 'Invalid CNote',
            });
            return;
        }

        const { Consignee, Consigner, FromPlace, ToPlace } = cNoteResult.recordset[0];

        // Resolve human-readable names for Consignee and Consigner
        const consigneeResult = await sql.query`
            SELECT Name
            FROM CCMaster
            WHERE CC_CODE = ${Consignee}
        `;
        const consignerResult = await sql.query`
            SELECT Name
            FROM CCMaster
            WHERE CC_CODE = ${Consigner}
        `;

        const consigneeName = consigneeResult.recordset[0]?.Name || 'Unknown';
        const consignerName = consignerResult.recordset[0]?.Name || 'Unknown';

        // Resolve human-readable names for FromPlace and ToPlace
        const fromPlaceResult = await sql.query`
            SELECT [Area Name] AS AreaName
            FROM Area_master
            WHERE AreaCode = ${FromPlace}
        `;
        const toPlaceResult = await sql.query`
            SELECT [Area Name] AS AreaName
            FROM Area_master
            WHERE AreaCode = ${ToPlace}
        `;

        const fromPlaceName = fromPlaceResult.recordset[0]?.AreaName || 'Unknown';
        const toPlaceName = toPlaceResult.recordset[0]?.AreaName || 'Unknown';

        // Check delivery status in FreightChallan_Details and GoodsReceipt_Details
        const freightResult = await sql.query`
            SELECT *
            FROM FreightChallan_Details
            WHERE DSeries = ${series} AND CNumber = ${parseInt(invoiceNumber, 10)}
        `;

        const goodsReceiptResult = await sql.query`
            SELECT *
            FROM GoodsReceipt_Details
            WHERE DSeries = ${series} AND CNumber = ${parseInt(invoiceNumber, 10)}
        `;

        let status = 'Order waiting to be loaded on the truck';

        if (freightResult.recordset.length > 0) {
            status = `Order loaded from ${fromPlaceName} and on the way.`;
        } else if (goodsReceiptResult.recordset.length > 0) {
            status = `Delivery completed and order arrived at ${toPlaceName}.`;
        }

        res.status(200).json({
            cNote,
            consigneeName,
            consignerName,
            fromPlaceName,
            toPlaceName,
            status,
        });
    } catch (error) {
        console.error('Error fetching delivery status:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
};
