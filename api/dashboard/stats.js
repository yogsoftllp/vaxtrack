import { Pool } from '@neondatabase/serverless';

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export default async (req, res) => {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });
  
  try {
    const userId = req.headers['x-user-id'];
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    
    const result = await pool.query(
      `SELECT 
        COUNT(DISTINCT c.id) as total_children,
        COUNT(CASE WHEN vr.status = 'completed' THEN 1 END) as completed_vaccines,
        COUNT(CASE WHEN vr.status = 'scheduled' AND vr.scheduled_date <= CURRENT_DATE THEN 1 END) as overdue_vaccines
       FROM children c
       LEFT JOIN vaccination_records vr ON c.id = vr.child_id
       WHERE c.user_id = $1`,
      [userId]
    );
    
    const stats = result.rows[0] || { total_children: 0, completed_vaccines: 0, overdue_vaccines: 0 };
    res.json(stats);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};
