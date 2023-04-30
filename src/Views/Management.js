import { useRef, useState } from "react";
import { Button } from "primereact/button";
import { InputTextarea } from "primereact/inputtextarea";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
import "./Management.css";

const Management = (props) => {
  const toast = useRef(null);
  const [shipmentId, setShipmentId] = useState("");
  const [selectedStepType, setStepType] = useState("");
  const [selectedRouteString, setSelectedRouteString] = useState("");
  const [selectedRouteInt, setSelectedRouteInt] = useState(Array.apply(null));
  const [selectedStep, setSelectedStep] = useState("");

  const routeSteps = [
    { name: "Pickup Location" },
    { name: "Truck" },
    { name: "Plane" },
    { name: "Ship" },
    { name: "Train" },
    { name: "Warehouse" },
    { name: "Destination" },
  ];

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

  const addToRoute = () => {
    let route = selectedRouteString;
    if (route == "") {
      route = selectedStep.name;
    } else {
      route = selectedRouteString + ", " + selectedStep.name;
    }

    setSelectedRouteString(route);
    addToIntRoute(selectedStep.name);
  };

  const addToIntRoute = (_step) => {
    let intStep = getIntForStep(_step);
    let routeInt = selectedRouteInt;

    routeInt.push(intStep);

    setSelectedRouteInt(routeInt);
  };

  const getIntForStep = (_step) => {
    if (_step === "Pickup Location") {
      return 0;
    } else if (_step === "Truck") {
      return 1;
    } else if (_step === "Plane") {
      return 2;
    } else if (_step === "Ship") {
      return 3;
    } else if (_step === "Train") {
      return 4;
    } else if (_step === "Warehouse") {
      return 5;
    } else if (_step === "Destination") {
      return 6;
    }
  };

  const clearCurrRoute = () => {
    setSelectedRouteString("");
    setSelectedRouteInt(Array.apply(null));
  };

  const createShipmentCall = async () => {
    showInfo("Transaction sent");
    try {
      let tx = await props.contract.methods.createShipment(shipmentId).send({
        from: props.accounts[0],
      });
      let message = "Transaction complete " + tx.transactionHash;
      showSuccess(message);
    } catch (error) {
      showError("Transaction failed");
    }
  };

  const packShipmentCall = async () => {
    showInfo("Transaction sent");
    try {
      let tx = await props.contract.methods.shipmentPacked(shipmentId).send({
        from: props.accounts[0],
      });
      let message = "Transaction complete " + tx.transactionHash;
      showSuccess(message);
    } catch (error) {
      showError("Transaction failed");
    }
  };

  const moveShipmentCall = async () => {
    if (selectedStepType == 1 || selectedStepType == 2) {
      try {
        showInfo("Transaction sent");
        let tx = await props.contract.methods
          .shipmentMoved(shipmentId, selectedStepType)
          .send({
            from: props.accounts[0],
          });
        let message = "Transaction complete " + tx.transactionHash;
        showSuccess(message);
      } catch (error) {
        showError("Transaction failed");
      }
    } else {
      showWarn("The selected Step type is not 1 or 2");
    }
  };

  const setRouteCall = async () => {
    showInfo("Transaction sent");
    try {
      let tx = await props.contract.methods
        .setRoute(shipmentId, selectedRouteInt)
        .send({
          from: props.accounts[0],
        });
      let message = "Transaction complete " + tx.transactionHash;
      showSuccess(message);
    } catch (error) {
      showError("Transaction failed");
    }
  };

  return (
    <div>
      <h1>Shipment Management</h1>
      <div>
        <Toast ref={toast} position="bottom-left" />
        <InputText
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <Button
          className="man-button"
          label={"Create Shipment"}
          onClick={(e) => createShipmentCall(e.target.value)}
          severity="secondary"
        />
      </div>
      <br></br>
      <div>
        <Toast ref={toast} position="bottom-left" />
        <InputText
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <Button
          className="man-button"
          label={"Pack Shipment"}
          onClick={(e) => packShipmentCall(e.target.value)}
          severity="secondary"
        />
      </div>
      <br></br>
      <div>
        <InputText
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <InputText
          placeholder="Step type"
          value={selectedStepType}
          onChange={(e) => setStepType(e.target.value)}
          aria-describedby="stepType-help"
        />
        <Button
          className="man-button"
          label={"Move"}
          onClick={() => moveShipmentCall()}
          severity="secondary"
        />
        <p>
          <small id="stepType-help">
            Please only enter 1 for Delivery Step or 2 for Shipment Step.
          </small>
        </p>
      </div>
      <br></br>
      <br></br>
      <br></br>
      <div>
        <InputText
          placeholder="Shipment ID"
          value={shipmentId}
          onChange={(e) => setShipmentId(e.target.value)}
        />
        <Button
          className="man-button"
          label={"Set Route"}
          onClick={() => setRouteCall()}
          severity="secondary"
        />
        <p>
          <label htmlFor="currRoute">Currently selected route: </label>
          <InputTextarea
            autoResize
            disabled
            value={selectedRouteString}
            placeholder="Waiting for steps..."
            rows={5}
            cols={30}
          />
          <Button
            className="man-button"
            label={"Clear"}
            onClick={() => clearCurrRoute()}
            severity="secondary"
          />
        </p>
        <Dropdown
          value={selectedStep}
          onChange={(e) => setSelectedStep(e.value)}
          options={routeSteps}
          optionLabel="name"
          showClear
          placeholder="Select a City"
          className="w-full md:w-14rem"
        />
        <Button
          className="man-button"
          label={"add step"}
          onClick={(e) => addToRoute(e.target.value)}
          severity="secondary"
        />
      </div>
    </div>
  );
};

export default Management;
