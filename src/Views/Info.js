import { useState, useRef } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import "./Info.css";

const Info = (props) => {
  const [shipmentId, setShipmentId] = useState("");
  const [id, setId] = useState("");
  const [shippingStep, setShippingStep] = useState("");
  const [deliveryStep, setDeliveryStep] = useState("");
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
        .getCurrShippingStep(shipmentId)
        .call({
          from: props.accounts[0],
        })
        .then(setShippingStepString);

      props.contract.methods
        .getCurrDeliveryStep(shipmentId)
        .call({
          from: props.accounts[0],
        })
        .then(setDeliveryStepString);

      setId(shipmentId);
    } catch (error) {}
  };

  const setShippingStepString = (_step) => {
    setShippingStep(getStringForShippingStep(_step));
  };

  const setDeliveryStepString = (_step) => {
    setDeliveryStep(getStringForDeliveryStep(_step));
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
        routeString = getStringForShippingStep(fullRoute[i]);
      } else {
        routeString += ", " + getStringForShippingStep(fullRoute[i]);
      }
    }
    setfRoute(routeString);
  };

  const getStringForShippingStep = (_step) => {
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

  const getStringForDeliveryStep = (_step) => {
    if (_step == 0) {
      return "Initialized";
    } else if (_step == 1) {
      return "Shipment Loaded";
    } else if (_step == 2) {
      return "Shipment on first intermediate delivery";
    } else if (_step == 3) {
      return "Shipment on main delivery";
    } else if (_step == 4) {
      return "Shipment on second intermediate delivery";
    } else if (_step == 5) {
      return "Delivery done";
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
          <label htmlFor="Step">Current shipping step: </label>
          <InputText
            placeholder="Step"
            disabled
            className="ship-button"
            value={shippingStep}
          />
        </p>
        <p>
          <label htmlFor="Step">Current delivery step: </label>
          <InputText
            placeholder="Step"
            disabled
            className="ship-button"
            value={deliveryStep}
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
