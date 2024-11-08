import { userPreferences } from '../drizzle/schema.js';
import { authenticateUser } from './_apiUtils.js';
import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import { eq } from 'drizzle-orm';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  try {
    const user = await authenticateUser(req);

    const {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      sessionDuration,
      startDate, // Get startDate from request body
    } = req.body;

    if (
      monday === undefined ||
      tuesday === undefined ||
      wednesday === undefined ||
      thursday === undefined ||
      friday === undefined ||
      saturday === undefined ||
      sunday === undefined ||
      !sessionDuration
    ) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, user.id));

    const preferencesData = {
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      sunday,
      sessionDuration: parseInt(sessionDuration, 10),
      startDate: startDate ? new Date(startDate) : null, // Handle startDate
    };

    if (existing.length > 0) {
      await db
        .update(userPreferences)
        .set(preferencesData)
        .where(eq(userPreferences.userId, user.id));
    } else {
      await db.insert(userPreferences).values({
        userId: user.id,
        ...preferencesData,
      });
    }

    res.status(200).json({ message: 'Preferences saved' });
  } catch (error) {
    console.error('Error saving preferences:', error);
    if (error.message.includes('Authorization') || error.message.includes('token')) {
      res.status(401).json({ error: 'Authentication failed' });
    } else {
      res.status(500).json({ error: 'Error saving preferences' });
    }
  }
}