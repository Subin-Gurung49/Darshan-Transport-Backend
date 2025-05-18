import { Request, Response, NextFunction } from 'express';
import { getAllSeries } from '@services/series/series.service';
import { AppError, ErrorTypes } from '@middleware/errorHandler.middleware';

export const getSeriesList = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const seriesList = await getAllSeries();
    return { data: seriesList };
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
    } else {
      next(new AppError(
        'Failed to fetch series list',
        500,
        ErrorTypes.SERVER_ERROR,
        error
      ));
    }
    return undefined;
  }
};