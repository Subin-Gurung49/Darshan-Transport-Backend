import { sql } from '@config/db';
import { AppError, ErrorTypes } from '@middleware/errorHandler.middleware';

export const getAllSeries = async () => {
  try {
    const result = await sql.query`SELECT SERIESNAME FROM SERIES`;
    const series = result.recordset.map((item: { SERIESNAME: string }) => item.SERIESNAME);
    
    if (!series || series.length === 0) {
      throw new AppError(
        'No series found',
        404,
        ErrorTypes.NOT_FOUND
      );
    }

    return series;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError(
      'Failed to fetch series list',
      500,
      ErrorTypes.DATABASE_ERROR
    );
  }
};