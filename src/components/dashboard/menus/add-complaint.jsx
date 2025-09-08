import { Divider } from "primereact/divider";
import {
  Controller,
  FormProvider,
  useFieldArray,
  useFormContext,
} from "react-hook-form";
import { useForm } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Message } from "primereact/message";
import { FloatLabel } from "primereact/floatlabel";
import { Editor } from "primereact/editor";
import { useState, useTransition } from "react";
import { ButtonGroup } from "primereact/buttongroup";
import { Button } from "primereact/button";
import { ToastContext } from "../../providers/toast-provider";
import { useContext } from "react";
import { useJwt } from "react-jwt";
import { Dialog } from "primereact/dialog";
const useAddComplaintForm = () => {
  const token = localStorage.getItem("auth-token");
  const toast = useContext(ToastContext);
  const { decodedToken } = useJwt(token);
  const [isPending, startAddComplaint] = useTransition();
  const methods = useForm();
  const onSubmit = (formData) => {
    startAddComplaint(async () => {
      try {
        const res = await window.complaint.create(formData, decodedToken?.id);
        if (res.status) {
          toast.current.show({
            severity: "success",
            summary: "Complaint Created",
            detail: res.message,
            life: 3500,
          });
          methods.reset({
            title: "",
            complainants: [],
            respondents: [],
          });
        } else {
          console.log(res.error);
          methods.setError("root", {
            type: "manual",
            message: res.message || "Invalid Complaint",
          });
        }
      } catch (err) {
        console.error("Create Complaint:", err);
        methods.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      }
    });
  };

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

      <Dialog
        header="Add Complainant"
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
            <label>Complainant's Name</label>
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
      </Dialog>

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

      <Dialog
        header="Add Respondent"
        visible={isShow}
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
            <label>Respondent's Name</label>
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
      </Dialog>

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
const AddComplaintForm = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();
  const header = editorHeader();

  return (
    <div className="p-4 grid grid-cols-12 gap-2">
      <div className="col-span-4">
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
      {/* <div className="col-span-12">
          <label className="text-sm leading-10">Resolution</label>
          <Editor headerTemplate={header} {...register("resolution")} />
          <small className="p-error">error-meesage here</small>
        </div> */}
    </div>
  );
};
const AddComplaintHeader = () => {
  const { reset, formState } = useFormContext();
  const { isPending } = useAddComplaintForm();
  return (
    <div className="w-full mt-4">
      <div className="px-4">
        <h3 className="text-2xl font-medium leading-12 flex items-center gap-2">
          <span className="inline-flex items-center justify-center w-10 shadow-md h-10 rounded-full bg-blue-100">
            <i className="pi pi-file-plus text-blue-400 text-2xl" />
          </span>
          Create a Complaint
        </h3>

        <p className="text-gray-400">
          Fill in the information of the complaint
        </p>
        <div className="mt-2">
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
              onClick={() =>
                reset({
                  title: "",
                  complainants: [],
                  respondents: [],
                })
              }
            />
          </ButtonGroup>
        </div>
        <div>
          {formState.errors.root?.message && (
            <Message
              severity="error"
              text={formState.errors.root.message}
              className="w-full !justify-start"
            />
          )}
        </div>
      </div>

      <Divider />
    </div>
  );
};
const AddComplaintDetail = () => {
  const { methods, onSubmit } = useAddComplaintForm();

  return (
    <FormProvider {...methods}>
      <form onSubmit={onSubmit}>
        <AddComplaintHeader />
        <AddComplaintForm />
      </form>
    </FormProvider>
  );
};

export default AddComplaintDetail;
