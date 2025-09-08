import React from "react";
import { Button } from "primereact/button";
import { ButtonGroup } from "primereact/buttongroup";
import { Image } from "primereact/image";
const Navbar = () => {
  return (
    <div className="flex items-center justify-between bg-blue-100/20 shadow-sm px-4">
      <div className="p-2 flex gap-2 items-center">
        <div className="bg-blue-100 rounded-full p-3 hover:shadow-md transition-shadow duration-300">
          <Image src="/logo.png" alt="logo-image" width="25" />
        </div>
        <h3 className="font-bold tracking-wide text-blue-900 uppercase text-xl">
          Guidance Counseling System
        </h3>
      </div>
      <ButtonGroup>
        <Button
          icon="pi pi-minus"
          text
          onClick={() => window.windowControls.minimize()}
        />
        <Button
          icon="pi pi-times"
          severity="danger"
          size="small"
          text
          onClick={() => window.windowControls.close()}
        />
      </ButtonGroup>
    </div>
  );
};

export default Navbar;
