import React from "react";
import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";

const NavItem = ({ navItem }) => {
  return (
    <li key={navItem.index} className="list-none">
      <NavLink to={navItem.path}>
        {({ isActive }) => (
          <Button
            label={navItem.name}
            icon={navItem.icon}
            className={`w-full line-clamp-1 p-button-sm ${
              isActive ? " p-button-primary" : "p-button-text"
            }`}
          />
        )}
      </NavLink>
    </li>
  );
};

export default NavItem;
