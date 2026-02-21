import { eq } from 'drizzle-orm';
import type { Database } from '../client';
import { users } from '../schema';

export const getUserById = async (db: Database, id: string) => {
  const [result] = await db
    .select({
      id: users.id,
      fullName: users.fullName,
      avatarUrl: users.avatarUrl,
      email: users.email,
      role: users.role,
      locale: users.locale,
      weekStartsOnMonday: users.weekStartsOnMonday,
      timezone: users.timezone,
      dateFormat: users.dateFormat,
      timeFormat: users.timeFormat,
      timezoneAutoSync: users.timezoneAutoSync,
      createdAt: users.createdAt,
    })
    .from(users)
    .where(eq(users.id, id));

  return result;
};
