import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Form } from "react-router";

type NewDepartmentDialogProps = {
  submitting: boolean;
  error?: string;
  onCancel: () => void;
};

export function NewDepartmentDialog({
  submitting,
  error,
  onCancel,
}: NewDepartmentDialogProps) {
  return (
    <Dialog
      header="Add Department"
      visible
      modal
      style={{ width: "30rem" }}
      onHide={onCancel}
    >
      <Form method="post" className="space-y-4">
        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium">
            Department Name
          </label>
          <InputText id="name" name="name" className="w-full" autoFocus />
        </div>

        {error ? <p className="text-sm text-red-700">{error}</p> : null}

        <div className="flex justify-end gap-2">
          <Button type="button" label="Cancel" text onClick={onCancel} />
          <Button type="submit" label="Create" loading={submitting} />
        </div>
      </Form>
    </Dialog>
  );
}
