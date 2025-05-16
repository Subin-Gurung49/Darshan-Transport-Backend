import { Request, Response, RequestHandler } from 'express';
import { getDeliveryStatusDetails } from '@services/delivery/delivery.service';
import { sendSuccess, sendError } from '@utils/apiResponse';

export const getDeliveryStatus: RequestHandler = async (req, res) => {
    const series = req.query.series as string;
    const invoiceNumber = req.query.invoiceNumber as string;

    if (!series || !invoiceNumber) {
        sendError(res, null, 'Series and Invoice Number are required.', 400);
        return;
    }

    try {
        const result = await getDeliveryStatusDetails(series, invoiceNumber);
        sendSuccess(res, result, 'Delivery status fetched successfully');
    } catch (error) {
        if (error instanceof Error && error.message === 'NOT_FOUND') {
            sendError(res, null, 'CNote not found. Please check the entered data.', 404);
        } else {
            sendError(res, error, 'Internal server error.');
        }
    }
};
