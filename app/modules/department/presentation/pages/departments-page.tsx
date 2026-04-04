import { useMemo } from "react";
import { Link } from "react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";

import type { Department } from "../../domain/entities/department";

type DepartmentRow = Department;

interface DepartmentsPageProps {
  departments: Department[];
}

export function DepartmentsPage({ departments }: DepartmentsPageProps) {
  const rows = useMemo(() => departments, [departments]);

  const actionsBodyTemplate = (department: DepartmentRow) => (
    <div className="flex gap-2 justify-end">
      <Link to={`${department.id}/edit`}>
        <Button type="button" label="Edit" icon="pi pi-pencil" size="small" />
      </Link>

      <Link to={`${department.id}/delete`}>
        <Button
          type="button"
          label="Delete"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          outlined
        />
      </Link>
    </div>
  );

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_90%_10%,#bbf7d0_0%,#cffafe_45%,#f8fafc_100%)] px-4 py-10">
      <section className="mx-auto w-full max-w-4xl space-y-6">
        <Card title="Department CRUD" subTitle="Cloned architecture module">
          <p className="mb-6 text-sm text-slate-600">
            This route mirrors the organization module structure so you can copy
            it for future features.
          </p>

          <div className="mb-6 flex justify-end">
            <Link to="new">
              <Button type="button" label="Add Department" icon="pi pi-plus" />
            </Link>
          </div>

          <DataTable
            value={rows}
            stripedRows
            emptyMessage="No departments yet."
          >
            <Column field="id" header="ID" className="font-mono text-xs" />
            <Column field="name" header="Name" style={{ minWidth: "14rem" }} />
            <Column
              header="Actions"
              body={actionsBodyTemplate}
              style={{ width: "12rem" }}
            />
          </DataTable>
        </Card>
      </section>
    </main>
  );
}
