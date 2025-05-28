import { Request, Response, RequestHandler } from 'express';
import { getDeliveryStatusDetails } from '../../services/delivery/delivery.service';
import { sendSuccess } from '../../utils/apiResponse';
import { AppError, ErrorTypes } from '../../middleware/errorHandler.middleware';

export const getDeliveryStatus: RequestHandler = async (req, res, next) => {
    const series = req.query.series as string;
    const invoiceNumber = req.query.invoiceNumber as string;

    if (!series || !invoiceNumber) {
        next(new AppError(
            'Series and Invoice Number are required.',
            400,
            ErrorTypes.VALIDATION_ERROR,
            { series, invoiceNumber }
        ));
        return;
    }

    try {
        const result = await getDeliveryStatusDetails(series, invoiceNumber);
        sendSuccess(res, result, 'Delivery status fetched successfully');
    } catch (error) {
        if (error instanceof AppError) {
            next(error);
        } else {
            next(new AppError(
                'Internal server error',
                500,
                ErrorTypes.SERVER_ERROR,
                error
            ));
        }
    }
};
