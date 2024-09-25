import React, { useState } from "react";
import { Button } from "react-bootstrap";
import ModalComponent from "./ModalComponent";
import DeleteComponent from "./DeleteComponent";
import { BsEye, BsPencil, BsTrash } from "react-icons/bs";

function TableComponents({
  cols,
  titleTable,
  dataTable,
  classTable,
  apiDelete,
  apiUpdate,
  apiView,
  formFieldsProp,
  getData,
}) {
  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState({
    action: "",
    formFieldsProp: formFieldsProp,
    initialIsEdit: false,
    initialIdCurrent: null,
    apiUpdate: apiUpdate,
    apiView: apiView,
  });
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null);

  // Save changes logic
  const handleSave = (formData) => {
    console.log("Saving data...");
    getData();
  };

  // Handle delete confirmation logic and trigger delete
  const handleDeleteConfirmation = () => {
    if (deleteItem) {
      fetch(`${apiDelete}/${deleteItem.id}`, {
        method: "DELETE",
      })
        .then((response) => {
          if (response.ok) {
            console.log("Delete Successful:", deleteItem);
            getData(); // Refresh data after deletion
            setShowConfirmModal(false); // Close modal
          } else {
            console.error("Error deleting item:", response.statusText);
          }
        })
        .catch((error) => {
          console.error("Error deleting item:", error);
        });
    }
  };

  // Function to handle delete button click and show the confirmation modal
  const confirmDelete = (item) => {
    setDeleteItem(item); // Set the item to be deleted
    setShowConfirmModal(true); // Show confirmation modal
  };

  // Get inline style for status based on value
  const getStatusStyle = (status) => {
    return {
      color: status === 1 ? "green" : "red",
      fontWeight: "bold",
    };
  };

  return (
    <>
      <h2>{titleTable}</h2>
      <table className={classTable}>
        <thead>
          <tr>
            {Array.isArray(cols) &&
              cols.map((col, index) => <th key={index}>{col}</th>)}
          </tr>
        </thead>
        <tbody>
          {Array.isArray(dataTable) && dataTable.length > 0 ? (
            dataTable.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td>{row.id}</td>
                <td>{row.studentId || "--"}</td>
                <td>
                  {row.startDate
                    ? new Date(row.startDate).toLocaleDateString()
                    : "--"}
                </td>
                <td>
                  {row.endDate
                    ? new Date(row.endDate).toLocaleDateString()
                    : "--"}
                </td>
                <td style={getStatusStyle(row.status)}>
                  {row.status === 1 ? "Đang bảo lưu" : "Hết bảo lưu"}
                </td>
                <td>{row.subjectId || "--"}</td>
                <td className="text-center">
                  <Button
                    variant="link"
                    className="me-2"
                    onClick={() => {
                      setModalProps({
                        onHide: () => setModalShow(false),
                        onSave: handleSave,
                        action: "VIEW",
                        formFieldsProp: formFieldsProp,
                        initialIsEdit: true,
                        initialIdCurrent: row.id,
                        apiUpdate: apiUpdate,
                        apiView: apiView,
                      });
                      setModalShow(true);
                    }}
                  >
                    <BsEye className="text-secondary" />
                  </Button>
                  <Button
                    variant="link"
                    className="me-2"
                    onClick={() => {
                      setModalProps({
                        onHide: () => setModalShow(false),
                        onSave: handleSave,
                        action: "EDIT",
                        formFieldsProp: formFieldsProp,
                        initialIsEdit: true,
                        initialIdCurrent: row.id,
                        apiUpdate: apiUpdate,
                        apiView: apiView,
                      });
                      setModalShow(true);
                    }}
                  >
                    <BsPencil className="text-primary" />
                  </Button>
                  <Button variant="link" onClick={() => confirmDelete(row)}>
                    <BsTrash className="text-danger" />
                  </Button>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={cols.length} className="text-center">
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>

      <ModalComponent show={modalShow} getData={getData} {...modalProps} />

      <DeleteComponent
        show={showConfirmModal}
        onHide={() => setShowConfirmModal(false)}
        onConfirm={handleDeleteConfirmation} // Trigger the delete confirmation
        deleteItem={deleteItem}
        apiDelete={apiDelete}
      />
    </>
  );
}

export default TableComponents;
