import { ConfirmPopup, confirmPopup } from "primereact/confirmpopup";
import React, { startTransition, useTransition } from "react";
import { Button } from "primereact/button";
import { useJwt } from "react-jwt";
import { useContext } from "react";
import { ToastContext } from "./providers/toast-provider";
import { useSWRConfig } from "swr";
const DeleteComplaintButton = ({ complaintId }) => {
  const [isPending, startDeleteComplaint] = useTransition();
  const token = localStorage.getItem("auth-token");
  const toast = useContext(ToastContext);
  const { decodedToken } = useJwt(token);
  const { mutate } = useSWRConfig();
  const handleConfirm = (event) => {
    confirmPopup({
      target: event.currentTarget,
      message: "Do you want to delete this record?",
      icon: "pi pi-info-circle",
      acceptClassName: "p-button-danger",
      accept: () => {
        startDeleteComplaint(async () => {
          const res = await window.complaint.delete({
            id: decodedToken?.id,
            complaintId,
          });
          if (res.status) {
            toast.current.show({
              severity: "success",
              summary: "Complaint Deleted",
              detail: res.message,
              life: 3500,
            });
            mutate((key) => typeof key === "object", true);
          }
        });
      },
      reject: () => {
        console.log("rejected");
      },
    });
  };

  return (
    <>
      <ConfirmPopup />
      <Button
        icon="pi pi-trash"
        type="button"
        severity="danger"
        loading={isPending}
        className="!rounded-none"
        outlined
        size="small"
        onClick={handleConfirm}
      />
    </>
  );
};

export default DeleteComplaintButton;
