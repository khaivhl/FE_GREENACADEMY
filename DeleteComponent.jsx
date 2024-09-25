import React from "react";
import { Button, Modal } from "react-bootstrap";

function DeleteComponent({ show, onHide, onConfirm, deleteItem }) {
  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Xác nhận xoá</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {deleteItem
          ? `Bạn có chắc chắn muốn xóa học viên ${deleteItem.studentId}?`
          : "Bạn có chắc chắn muốn xoá không?"}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Huỷ bỏ
        </Button>
        <Button variant="danger" onClick={onConfirm}>
          Xoá
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteComponent;
