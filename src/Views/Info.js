import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import "./Info.css";

const Info = (props) => {
  const [shipmentId, setShipmentId] = useState("");
  const [id, setId] = useState("");
  const [step, setStep] = useState("");
  const [fRoute, setfRoute] = useState("");
  const toast = useRef(null);

  const showSuccess = (text) => {
    toast.current.show({
      severity: "success",
      summary: "Success",
      detail: text,
      life: 3000,
    });
  };

  const showInfo = (text) => {
    toast.current.show({
      severity: "info",
      summary: "Info",
      detail: text,
      life: 3000,
    });
  };

  const showWarn = (text) => {
    toast.current.show({
      severity: "warn",
      summary: "Warning",
      detail: text,
      life: 3000,
    });
  };

  const showError = (text) => {
    toast.current.show({
      severity: "error",
      summary: "Error",
      detail: text,
      life: 3000,
    });
  };

  const showShipmentInfo = () => {
    showInfo("Loading Info...");
    try {
      getCurrStepCall();
      getFullRoute();
      showSuccess("Shipment Info loaded!");
    } catch (error) {
      showError("Loading Shipmentdata failed");
    }
  };

  const getCurrStepCall = () => {
    try {
      props.contract.methods
        .getCurrentStep(shipmentId)
        .call({
          from: props.accounts[0],
        })
        .then(setStep);
      setId(shipmentId);
    } catch (error) {}
  };

  const getFullRoute = () => {
    try {
      props.contract.methods
        .getFullRoute(shipmentId)
        .call({
          from: props.accounts[0],
        })
        .then(setRouteString);
    } catch (error) {}
  };

  const setRouteString = (fullRoute) => {
    let routeString;
    for (let i = 0; i < fullRoute.length; i++) {
      if (routeString == null) {
        routeString = getStringForStep(fullRoute[i]);
      } else {
        routeString += ", " + getStringForStep(fullRoute[i]);
      }
    }
    setfRoute(routeString);
  };

  const getStringForStep = (_step) => {
    if (_step == 0) {
      return "Pickup Location";
    } else if (_step == 1) {
      return "Truck";
    } else if (_step == 2) {
      return "Plane";
    } else if (_step == 3) {
      return "Ship";
    } else if (_step == 4) {
      return "Train";
    } else if (_step == 5) {
      return "Warehouse";
    } else if (_step == 6) {
      return "Destination";
    }
  };

  return (
    <div>
      <Toast ref={toast} position="bottom-left" />
      <h1>Shipment Info</h1>
      <div>
        <InputText
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <Button
          className="ship-button"
          label={"Show"}
          onClick={() => showShipmentInfo()}
          severity="secondary"
        />
      </div>
      <div>
        <p>
          <label htmlFor="ID">Shipment ID: </label>
          <InputText
            placeholder="ID"
            disabled
            className="ship-button"
            value={id}
          />
        </p>
        <p>
          <label htmlFor="Step">Step: </label>
          <InputText
            placeholder="Step"
            disabled
            className="ship-button"
            value={step}
          />
        </p>
        <p>
          <label htmlFor="fRoute">Full Route: </label>
          <InputTextarea
            autoResize
            disabled
            value={fRoute}
            placeholder="Waiting for full route..."
            rows={5}
            cols={30}
          />
        </p>
      </div>
    </div>
  );
};

export default Info;
