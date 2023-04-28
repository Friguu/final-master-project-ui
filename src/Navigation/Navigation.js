import { useEffect, useState } from "react";
import "./Navigation.css";
import { Button } from "primereact/button";

const Navigation = (props) => {
  const selectNav = () => {
    switch (props.nav) {
      case "Main":
        return (
          <div>
            <Button
              className="nav-button"
              label={"Home"}
              onClick={() => props.setNav("Main")}
            />
            <Button
              className="nav-button"
              label={"Shipment Info"}
              onClick={() => props.setNav("Info")}
            />
            <Button
              className="nav-button"
              label={"Management"}
              onClick={() => props.setNav("Management")}
            />
          </div>
        );
        break;
      case "Management":
        return (
          <div>
            <Button
              className="nav-button"
              label={"Home"}
              onClick={() => props.setNav("Main")}
            />
            <Button
              className="nav-button"
              label={"Shipment Info"}
              onClick={() => props.setNav("Info")}
            />
            <Button
              className="nav-button"
              label={"Management"}
              onClick={() => props.setNav("Management")}
            />
          </div>
        );
        break;
      case "Info":
        return (
          <div>
            <Button
              className="nav-button"
              label={"Home"}
              onClick={() => props.setNav("Main")}
            />
            <Button
              className="nav-button"
              label={"Shipment Info"}
              onClick={() => props.setNav("Info")}
            />
            <Button
              className="nav-button"
              label={"Management"}
              onClick={() => props.setNav("Management")}
            />
          </div>
        );
        break;
    }
    return;
  };

  return <div className="nav-container">{selectNav()}</div>;
};

export default Navigation;
