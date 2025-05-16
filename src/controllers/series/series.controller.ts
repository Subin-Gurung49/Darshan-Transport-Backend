import { Request, Response } from 'express';
import { getAllSeries } from '@services/series/series.service';

export const getSeriesList = async (req: Request, res: Response) => {
  try {
    const series = await getAllSeries();
    res.json(series);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch series list' });
  }
};