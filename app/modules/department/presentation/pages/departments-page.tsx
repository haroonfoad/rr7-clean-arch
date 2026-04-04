import { useMemo, useState } from "react";
import { Form, useNavigation } from "react-router";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { InputText } from "primereact/inputtext";

import type { Department } from "../../domain/entities/department";

type DepartmentRow = Department & { currentName: string };

interface DepartmentsPageProps {
  departments: Department[];
  error?: string;
}

export function DepartmentsPage({ departments, error }: DepartmentsPageProps) {
  const navigation = useNavigation();
  const [newDepartmentName, setNewDepartmentName] = useState("");
  const [editingRows, setEditingRows] = useState<Record<string, string>>({});

  const isSubmitting = navigation.state === "submitting";

  const rows = useMemo(
    () =>
      departments.map((department) => ({
        ...department,
        currentName: editingRows[department.id] ?? department.name,
      })),
    [departments, editingRows],
  );

  const nameBodyTemplate = (department: DepartmentRow) => (
    <InputText
      value={department.currentName}
      onChange={(event) => {
        setEditingRows((previous) => ({
          ...previous,
          [department.id]: event.target.value,
        }));
      }}
      className="w-full"
    />
  );

  const actionsBodyTemplate = (department: DepartmentRow) => (
    <div className="flex gap-2 justify-end">
      <Form method="post" action={`/departments/${department.id}/edit`}>
        <input type="hidden" name="id" value={department.id} />
        <input type="hidden" name="name" value={department.currentName} />
        <Button
          type="submit"
          label="Save"
          icon="pi pi-check"
          size="small"
          disabled={isSubmitting}
        />
      </Form>

      <Form method="post" action={`/departments/${department.id}/delete`}>
        <input type="hidden" name="id" value={department.id} />
        <Button
          type="submit"
          label="Delete"
          icon="pi pi-trash"
          size="small"
          severity="danger"
          outlined
          disabled={isSubmitting}
        />
      </Form>
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

          <Form
            method="post"
            action="/departments/new"
            className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <span className="p-input-icon-left flex-1">
              <i className="pi pi-sitemap" />
              <InputText
                name="name"
                value={newDepartmentName}
                onChange={(event) => setNewDepartmentName(event.target.value)}
                placeholder="Department name"
                className="w-full"
              />
            </span>
            <Button
              type="submit"
              label="Add"
              icon="pi pi-plus"
              disabled={isSubmitting}
            />
          </Form>

          {error ? (
            <div className="mb-4 rounded border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-800">
              {error}
            </div>
          ) : null}

          <DataTable
            value={rows}
            stripedRows
            emptyMessage="No departments yet."
          >
            <Column field="id" header="ID" className="font-mono text-xs" />
            <Column
              field="name"
              header="Name"
              body={nameBodyTemplate}
              style={{ minWidth: "14rem" }}
            />
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
