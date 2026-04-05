import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Form } from "react-router";

type EditDepartmentDialogProps = {
  departmentId: string;
  departmentName: string;
  submitting: boolean;
  error?: string;
  onCancel: () => void;
};

export function EditDepartmentDialog({
  departmentId,
  departmentName,
  submitting,
  error,
  onCancel,
}: EditDepartmentDialogProps) {
  return (
    <Dialog
      header="Edit Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={onCancel}
    >
      <Form method="post" className="space-y-4">
        <input type="hidden" name="id" value={departmentId} />

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <InputText
            id="name"
            name="name"
            className="w-full"
            defaultValue={departmentName}
            autoFocus
          />
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" text onClick={onCancel} />
          <Button type="submit" label="Save" loading={submitting} />
        </div>
      </Form>
    </Dialog>
  );
}
