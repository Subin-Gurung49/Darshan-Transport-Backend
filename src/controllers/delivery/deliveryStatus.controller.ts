import { Request, Response, RequestHandler, NextFunction } from 'express';
import { getDeliveryStatusDetails } from '../../services/delivery/delivery.service';
import { sendSuccess } from '../../utils/apiResponse';
import { AppError, ErrorTypes } from '../../middleware/errorHandler.middleware';

export const getDeliveryStatus: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {
    const { series, invoiceNumber: invoiceParam } = req.params;

    if (!series || !invoiceParam) {
        next(new AppError(
            'Series and Invoice Number from path parameters are required.',
            400,
            ErrorTypes.VALIDATION_ERROR,
            { series, invoiceNumber: invoiceParam }
        ));
        return;
    }

    try {
        const result = await getDeliveryStatusDetails(req.params.series, req.params.invoiceNumber);
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
