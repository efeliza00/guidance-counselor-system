import { useContext, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { navlinks } from "../../constants/navlink";
import NavItem from "./nav-item";
import { Button } from "primereact/button";
import { ToastContext } from "../providers/toast-provider";
const Dashboard = () => {
  const navigate = useNavigate();
  const toast = useContext(ToastContext);
  const handleSignOut = () => {
    localStorage.removeItem("auth-token");
    toast.current.show({
      severity: "success",
      summary: "Sign out",
      detail: "You have sucessfully signed out. ",
      life: 3500,
    });
    navigate("/dashboard");
  };
  return (
    <div className="w-full  h-full flex  gap-4 p-4 bg-blue-100/30 ">
      <div className="h-full p-component px-2 py-4 p-card flex flex-col justify-between w-1/5">
        <ul className="flex flex-col gap-1 justify-center">
          {navlinks?.map((navItem) => (
            <NavItem key={navItem.id} navItem={navItem} />
          ))}
        </ul>
        <div className="flex flex-col gap-4">
          <Button
            icon="pi pi-sign-out"
            label="Sign out"
            severity="help"
            size="small"
            type="button"
            outlined
            onClick={handleSignOut}
          />
        </div>
      </div>

      <div className="p-card w-full h-full overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};
export default Dashboard;
