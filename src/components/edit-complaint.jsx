import React from "react";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { useEffect, useState } from "react";
import { useContext } from "react";
import { useJwt } from "react-jwt";
import { useTransition } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { ToastContext } from "./providers/toast-provider";
import { useFieldArray, useFormContext } from "react-hook-form";
import { FloatLabel } from "primereact/floatlabel";
import { InputText } from "primereact/inputtext";
import { Sidebar } from "primereact/sidebar";
import { Controller } from "react-hook-form";
import { ButtonGroup } from "primereact/buttongroup";
import { Message } from "primereact/message";
import { Divider } from "primereact/divider";
import { Editor } from "primereact/editor";
import { useSWRConfig } from "swr";
import { Dropdown } from "primereact/dropdown";
const useEditComplaintForm = (complaint) => {
  const token = localStorage.getItem("auth-token");
  const toast = useContext(ToastContext);
  const { decodedToken } = useJwt(token);
  const [isPending, startEditComplaint] = useTransition();
  const { mutate } = useSWRConfig();
  const methods = useForm();

  const onSubmit = (formData) => {
    startEditComplaint(async () => {
      try {
        const res = await window.complaint.update({
          id: decodedToken?.id,
          complaintId: complaint.id,
          formData,
        });
        if (res.status) {
          toast.current.show({
            severity: "success",
            summary: "Complaint Updated",
            detail: res.message,
            life: 3500,
          });
          mutate((key) => typeof key === "object", true);

          methods.reset();
        } else {
          methods.setError("root", {
            type: "manual",
            message: res.message || "Invalid Complaint",
          });
        }
      } catch (err) {
        console.error("Update Complaint:", err);
        methods.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      }
    });
  };

  useEffect(() => {
    if (complaint) {
      methods.reset({
        title: complaint.title || "",
        status: complaint.status,
        overview: complaint.overview || "",
        complainants: complaint.students
          .filter((s) => s.role === "COMPLAINANT")
          .map((complainant) => complainant),
        respondents: complaint.students
          .filter((s) => s.role === "RESPONDENT")
          .map((respondent) => respondent),
        resolution: complaint.resolution,
      });
    }
  }, [complaint, methods]);

  return {
    methods,
    isPending,
    onSubmit: methods.handleSubmit(onSubmit),
  };
};

const editorHeader = () => {
  return (
    <span className="ql-formats">
      <button className="ql-bold" aria-label="Bold"></button>
      <button className="ql-italic" aria-label="Italic"></button>
      <button className="ql-underline" aria-label="Underline"></button>
    </span>
  );
};

const ComplaintComplainantForm = () => {
  const [isShow, setIsShow] = useState(false);
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "complainants",
  });

  const newComplainant = watch("newComplainant");

  const handleAddComplainant = () => {
    if (!newComplainant?.name?.trim()) return;
    append(newComplainant);
    setValue("newComplainant", { name: "", contact: "" });
    setIsShow(false);
  };

  return (
    <div className="w-full">
      <Button
        label="Add Complainant"
        type="button"
        severity="info"
        onClick={() => setIsShow(true)}
        className="mb-2"
      />

      <Sidebar
        header="Edit Complainant"
        position="right"
        visible={isShow}
        style={{ width: "30rem" }}
        onHide={() => setIsShow(false)}
      >
        <div className="flex flex-col gap-8">
          <FloatLabel className="w-full">
            <InputText
              className="w-full"
              {...register("newComplainant.name")}
              invalid={!!errors?.newComplainant?.name}
            />
            <label>Complainant&apos;s Name</label>
          </FloatLabel>

          <FloatLabel className="w-full">
            <InputText
              keyfilter="num"
              className="w-full"
              {...register("newComplainant.contact")}
            />
            <label>Contact Info</label>
          </FloatLabel>

          <Button label="Add" onClick={handleAddComplainant} />
        </div>
      </Sidebar>

      <ul className="mt-3 space-y-2">
        {fields.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm rounded-xl bg-blue-200/20 px-4 py-2"
          >
            <div className="flex flex-col leading-6">
              <h4 className="capitalize font-semibold">{item.name}</h4>
              <p>{item.contact || "No contact info"}</p>
            </div>
            <Button
              icon="pi pi-trash"
              type="button"
              outlined
              severity="danger"
              size="small"
              className="ml-3"
              onClick={() => remove(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const ComplaintRespondentForm = () => {
  const [isShow, setIsShow] = useState(false);
  const {
    control,
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "respondents",
  });

  const newRespondent = watch("newRespondent");

  const handleAddResponded = () => {
    if (!newRespondent?.name?.trim()) return;
    append(newRespondent);
    setValue("newRespondent", { name: "", contact: "" });
    setIsShow(false);
  };

  return (
    <div className="w-full">
      <Button
        label="Add Respondent"
        severity="info"
        type="button"
        onClick={() => setIsShow(true)}
        className="mb-2"
      />

      <Sidebar
        header="Edit Respondent"
        visible={isShow}
        position="right"
        style={{ width: "30rem" }}
        onHide={() => setIsShow(false)}
      >
        <div className="flex flex-col gap-8">
          <FloatLabel className="w-full">
            <InputText
              className="w-full"
              {...register("newRespondent.name")}
              invalid={!!errors?.newRespondent?.name}
            />
            <label>Respondent&apos;s Name</label>
          </FloatLabel>

          <FloatLabel className="w-full">
            <InputText
              className="w-full"
              keyfilter="num"
              {...register("newRespondent.contact")}
            />
            <label>Contact Info</label>
          </FloatLabel>

          <Button label="Add" onClick={handleAddResponded} />
        </div>
      </Sidebar>

      <ul className="mt-3 space-y-2">
        {fields.map((item, index) => (
          <li
            key={item.id}
            className="flex items-center justify-between text-sm rounded-xl bg-blue-200/20 px-4 py-2"
          >
            <div className="flex flex-col leading-6">
              <h4 className="capitalize font-semibold">{item.name}</h4>
              <p>{item.contact || "No contact info"}</p>
            </div>
            <Button
              icon="pi pi-trash"
              type="button"
              outlined
              severity="danger"
              size="small"
              className="ml-3"
              onClick={() => remove(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

const EditComplaintForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const header = editorHeader();

  const statuses = [
    { name: "Pending", code: "PENDING" },
    { name: "Rejected", code: "REJECTED" },
    { name: "Resolved", code: "RESOLVED" },
    { name: "In Progress", code: "IN_PROGRESS" },
  ];

  return (
    <div className="p-4 grid grid-cols-12 gap-2">
      <div className="col-span-6">
        <FloatLabel className="w-full">
          <InputText
            className="w-full"
            {...register("title", {
              required: "Title is required.",
            })}
            invalid={!!errors.title?.message}
          />
          <label className="text-sm">
            Title of Complaint <span className="text-red-500">*</span>
          </label>
        </FloatLabel>
        <small className="p-error">{errors.title?.message}</small>
      </div>
      <div className="col-span-3">
        <FloatLabel className="w-full">
          <Controller
            name="status"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Dropdown
                value={value}
                onChange={onChange}
                options={statuses}
                optionLabel="name"
                optionValue="code"
                placeholder="Select a Status"
                className="w-full"
                checkmark={true}
                highlightOnSelect={false}
              />
            )}
          />
          <label className="text-sm">Status</label>
        </FloatLabel>
        <small className="p-error">{errors.title?.message}</small>
      </div>
      <div className="col-span-12">
        <label className="text-sm leading-10">
          Overview <span className="text-red-500">*</span>
        </label>
        <Controller
          name="overview"
          control={control}
          rules={{
            required: "Overview is required",
          }}
          render={({ field: { value, onChange } }) => (
            <Editor
              headerTemplate={header}
              value={value}
              onTextChange={(e) => onChange(e.htmlValue)}
            />
          )}
        />
        <small className="p-error">{errors.overview?.message}</small>
      </div>
      <div className="col-span-6 mt-4">
        <ComplaintComplainantForm />
      </div>
      <div className="col-span-6 mt-4">
        <ComplaintRespondentForm />
      </div>
      <div className="col-span-12">
        <label className="text-sm leading-10">Resolution</label>
        <Controller
          name="resolution"
          control={control}
          render={({ field: { value, onChange } }) => (
            <Editor
              headerTemplate={header}
              value={value}
              onTextChange={(e) => onChange(e.htmlValue)}
            />
          )}
        />
        <small className="p-error">{errors.resolution?.message}</small>
      </div>
    </div>
  );
};

const EditComplaintHeader = () => {
  const { reset, formState } = useFormContext();
  const { isPending } = useEditComplaintForm();
  return (
    <div className="w-full">
      <>
        <ButtonGroup>
          <Button
            label="Submit"
            type="submit"
            icon="pi pi-check "
            outlined
            severity="success"
            size="small"
            loading={isPending}
            disabled={isPending}
          />
          <Button
            label="Cancel"
            outlined
            severity="secondary "
            size="small"
            icon="pi pi-times"
            type="button"
            disabled={isPending}
            onClick={() => reset()}
          />
        </ButtonGroup>
      </>
      <div>
        {formState.errors.root?.message && (
          <Message
            severity="error"
            text={formState.errors.root.message}
            className="w-full !justify-start"
          />
        )}
      </div>

      <Divider />
    </div>
  );
};

const EditComplaintButton = ({ complaint }) => {
  const { methods, onSubmit } = useEditComplaintForm(complaint);
  const [visible, setVisible] = useState(false);

  return (
    <FormProvider {...methods}>
      <Button
        icon="pi pi-pen-to-square"
        severity="help"
        type="button"
        className="!rounded-none"
        outlined
        size="small"
        onClick={() => setVisible((prevState) => !prevState)}
      />
      <Dialog
        header="Edit Complaint Information"
        visible={visible}
        modal
        style={{ width: "70vw" }}
        onHide={() => setVisible(false)}
        dismissableMask={false}
        closeOnEscape={false}
        blockScroll
      >
        <div
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <form onSubmit={onSubmit}>
            <EditComplaintHeader />
            <EditComplaintForm />
          </form>
        </div>
      </Dialog>
    </FormProvider>
  );
};

export default EditComplaintButton;
