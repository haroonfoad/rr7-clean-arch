import { useMemo } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
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
  const { t } = useTranslation();
  const rows = useMemo(() => departments, [departments]);

  const actionsBodyTemplate = (department: DepartmentRow) => (
    <div className="flex gap-2 justify-end">
      <Link to={`${department.id}/edit`}>
        <Button
          type="button"
          label={t("table.edit")}
          icon="pi pi-pencil"
          size="small"
        />
      </Link>

      <Link to={`${department.id}/delete`}>
        <Button
          type="button"
          label={t("table.delete")}
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
        <Card
          title={t("departments.title")}
          subTitle={t("departments.subtitle")}
        >
          <p className="mb-6 text-sm text-slate-600">
            {t("departments.description")}
          </p>

          <div className="mb-6 flex justify-end">
            <Link to="new">
              <Button
                type="button"
                label={t("departments.add")}
                icon="pi pi-plus"
              />
            </Link>
          </div>

          <DataTable
            value={rows}
            stripedRows
            emptyMessage={t("departments.empty")}
          >
            <Column
              field="id"
              header={t("table.id")}
              className="font-mono text-xs"
            />
            <Column
              field="name"
              header={t("table.name")}
              style={{ minWidth: "14rem" }}
            />
            <Column
              header={t("table.actions")}
              body={actionsBodyTemplate}
              style={{ width: "12rem" }}
            />
          </DataTable>
        </Card>
      </section>
    </main>
  );
}
