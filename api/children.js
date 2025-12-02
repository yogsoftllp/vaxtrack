import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async (req, res) => {
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    if (req.method === 'GET') {
      const result = await pool.query(
        'SELECT * FROM children WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
      );
      return res.json(result.rows);
    }
    
    if (req.method === 'POST') {
      const { firstName, lastName, dateOfBirth, gender, country, city } = req.body;
      const result = await pool.query(
        `INSERT INTO children (user_id, first_name, last_name, date_of_birth, gender, country, city) 
         VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, firstName, lastName, dateOfBirth, gender, country, city]
      );
      return res.json(result.rows[0]);
    }
    
    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to handle children request' });
  }
};
