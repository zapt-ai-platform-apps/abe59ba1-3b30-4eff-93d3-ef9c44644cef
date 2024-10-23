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

    const { monday, tuesday, wednesday, thursday, friday, saturday, sunday, sessionDuration } = req.body;

    if (!monday || !tuesday || !wednesday || !thursday || !friday || !saturday || !sunday || !sessionDuration) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const sql = neon(process.env.NEON_DB_URL);
    const db = drizzle(sql);

    const existing = await db.select().from(userPreferences).where(eq(userPreferences.userId, user.id));

    if (existing.length > 0) {
      await db.update(userPreferences)
        .set({
          monday, tuesday, wednesday, thursday, friday, saturday, sunday, sessionDuration: parseInt(sessionDuration, 10),
        })
        .where(eq(userPreferences.userId, user.id));
    } else {
      await db.insert(userPreferences).values({
        userId: user.id,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        sessionDuration: parseInt(sessionDuration, 10),
      }).returning();
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