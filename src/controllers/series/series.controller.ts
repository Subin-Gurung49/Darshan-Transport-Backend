import { Request, Response } from 'express';
import { getAllSeries } from '@services/series/series.service';
import { sendSuccess, sendError } from '@utils/apiResponse';

export const getSeriesList = async (req: Request, res: Response) => {
  try {
    const series = await getAllSeries();
    sendSuccess(res, series, 'Series list fetched successfully');
  } catch (error) {
    sendError(res, error, 'Failed to fetch series list');
  }
};