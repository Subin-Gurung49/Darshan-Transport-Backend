import { Request, Response } from 'express';
import { getAllSeries } from '@services/series.service';
import { sendSuccess, sendError } from '@utils/apiResponse';

export const getSeriesList = async (req: Request, res: Response) => {
  try {
    const series = await getAllSeries();
    sendSuccess(res, series, 'Series list retrieved successfully');
  } catch (error) {
    console.error('Error fetching series:', error);
    sendError(res, error, 'Failed to fetch series list');
  }
};

// Add more controller functions as needed
export default {
  getSeriesList
};