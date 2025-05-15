import { sql } from '../config/db';

export const getAllSeries = async () => {
  try {
    const result = await sql.query`SELECT SERIESNAME FROM SERIES`;
    return result.recordset.map(item => item.SERIESNAME);
  } catch (err) {
    throw err;
  }
};