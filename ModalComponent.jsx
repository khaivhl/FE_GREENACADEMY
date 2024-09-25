import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import FormComponent from "./FormComponent";
import axios from "axios";
import { toast } from "react-toastify";

function ModalComponent({
  onHide,
  show,
  action,
  formFieldsProp,
  initialIdCurrent,
  apiUpdate,
  apiCreate,
  apiView,
  getData,
  studentId, // Receive studentId prop
}) {
  const [studentData, setStudentData] = useState(null);

  // Fetch student data by studentId when the modal opens
  useEffect(() => {
    if (studentId) {
      axios
        .get(
          `https://66b437f79f9169621ea21d35.mockapi.io/students/${studentId}`
        )
        .then((response) => {
          setStudentData(response.data); // Load student data into state
        })
        .catch((error) => {
          console.error("Error fetching student data:", error);
        });
    }
  }, [studentId]);

  const [formData, setFormData] = useState({}); // Initialize with an empty object

  // Fetch reservation or other data for view/edit when modal opens
  useEffect(() => {
    if ((action === "VIEW" || action === "EDIT") && initialIdCurrent) {
      axios
        .get(`${apiView}/${initialIdCurrent}`)
        .then((response) => {
          setFormData(response.data); // Load form data into state
        })
        .catch((error) => {
          console.error("Error fetching data:", error);
        });
    } else if (action === "CREATE") {
      setFormData({}); // Reset formData for new entries
    }
  }, [action, initialIdCurrent]);

  const handleSave = (submittedFormData) => {
    if (action === "EDIT") {
      axios
        .put(`${apiUpdate}/${initialIdCurrent}`, submittedFormData)
        .then(() => {
          onHide();
          getData();
          toast.success("Update Successful!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((error) => {
          console.error("Error updating the item:", error);
        });
    } else if (action === "CREATE") {
      axios
        .post(apiCreate, submittedFormData)
        .then(() => {
          onHide();
          getData();
          toast.success("Item Created Successfully!", {
            position: toast.POSITION.TOP_RIGHT,
          });
        })
        .catch((error) => {
          console.error("Error creating the item:", error);
        });
    }
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {action === "EDIT"
            ? "Cập nhật"
            : action === "VIEW"
            ? "Xem chi tiết"
            : "Thêm mới"}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Display student details */}
        {studentData ? (
          <div>
            <h5>Student Details</h5>
            <p>
              <strong>Name:</strong> {studentData.student_name}
            </p>
            <p>
              <strong>Email:</strong> {studentData.email}
            </p>
            <p>
              <strong>Call Number:</strong> {studentData.call_number}
            </p>
            <p>
              <strong>Status:</strong> {studentData.status}
            </p>
          </div>
        ) : (
          <p>Loading student data...</p>
        )}

        {/* Form for reservation or other data */}
        {action === "CREATE" || Object.keys(formData).length > 0 ? (
          <FormComponent
            fields={formFieldsProp}
            onSubmit={handleSave}
            formData={formData} // Pass formData to FormComponent
            isEdit={action === "EDIT"}
            isView={action === "VIEW"}
            onClose={onHide}
          />
        ) : (
          <p>Loading data...</p>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button onClick={onHide}>Close</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalComponent;
