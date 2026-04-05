import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { Form } from "react-router";

type DeleteDepartmentDialogProps = {
  departmentName: string;
  submitting: boolean;
  onCancel: () => void;
};

export function DeleteDepartmentDialog({
  departmentName,
  submitting,
  onCancel,
}: DeleteDepartmentDialogProps) {
  return (
    <Dialog
      header="Delete Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={onCancel}
    >
      <Form method="post" className="space-y-4">
        <p className="text-sm text-slate-700">
          Are you sure you want to delete <strong>{departmentName}</strong>?
        </p>

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" text onClick={onCancel} />
          <Button
            type="submit"
            label="Delete"
            severity="danger"
            loading={submitting}
          />
        </div>
      </Form>
    </Dialog>
  );
}
