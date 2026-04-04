import { and, asc, eq, ne, sql } from "drizzle-orm";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

import type { Department } from "../../domain/entities/department";
import type { DepartmentRepository } from "../../domain/repositories/department-repository";
import * as schema from "../db/schema";

export class DrizzleDepartmentRepository implements DepartmentRepository {
  constructor(private readonly db: NodePgDatabase<typeof schema>) {}

  async list(): Promise<Department[]> {
    return this.db
      .select()
      .from(schema.departments)
      .orderBy(asc(schema.departments.name));
  }

  async existsByName(name: string, excludeId?: string): Promise<boolean> {
    const normalizedName = name.trim().toLowerCase();
    const filters = [
      sql`lower(${schema.departments.name}) = ${normalizedName}`,
    ];

    if (excludeId) {
      filters.push(ne(schema.departments.id, excludeId));
    }

    const rows = await this.db
      .select({ id: schema.departments.id })
      .from(schema.departments)
      .where(and(...filters))
      .limit(1);

    return rows.length > 0;
  }

  async create(department: Department): Promise<void> {
    await this.db.insert(schema.departments).values(department);
  }

  async update(department: Department): Promise<void> {
    await this.db
      .update(schema.departments)
      .set({ name: department.name })
      .where(eq(schema.departments.id, department.id));
  }

  async delete(id: string): Promise<void> {
    await this.db
      .delete(schema.departments)
      .where(eq(schema.departments.id, id));
  }
}
