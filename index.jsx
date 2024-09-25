import React, { useState, useEffect } from "react";
import TableComponents from "./TableComponent";
import PagingComponent from "./PagingComponent";
import ModalComponent from "./ModalComponent";
import DeleteComponent from "./DeleteComponent";
import { Button, Spinner } from "react-bootstrap";
import axios from "axios";

const ReservationComponent = () => {
  const [dataTable, setDataTable] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPage, setTotalPage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [modalProps, setModalProps] = useState({
    action: "",
    formFieldsProp: [],
    initialIsEdit: false,
    initialIdCurrent: null,
  });
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [deleteItem, setDeleteItem] = useState(null); // Selected item for deletion

  const itemsPerPage = 10;
  const apiCreate = "http://localhost:9001/api/leave-of-absence";
  const apiDelete = "http://localhost:9001/api/leave-of-absence";
  const apiView = "http://localhost:9001/api/leave-of-absence";
  const apiUpdate = "http://localhost:9001/api/leave-of-absence";

  // Ensure formFieldsProp is correctly defined based on the backend schema
  const formFieldsProp = [
    {
      name: "studentId",
      type: "text",
      label: "Mã học viên",
      placeholder: "Nhập mã học viên",
    },
    { name: "startDate", type: "date", label: "Thời gian bắt đầu" },
    { name: "endDate", type: "date", label: "Thời gian kết thúc" },
    {
      name: "status",
      type: "text",
      label: "Trạng thái",
      placeholder: "Nhập trạng thái",
    },
    {
      name: "subjectId",
      type: "text",
      label: "Mã môn học",
      placeholder: "Nhập mã môn học",
    },
  ];

  const cols = [
    "STT",
    "Mã học viên",
    "Thời gian bắt đầu",
    "Thời gian kết thúc",
    "Trạng thái",
    "Mã môn học",
    "",
  ];

  // Get data from API
  const getData = async (page = 1) => {
    try {
      setLoading(true);
      const res = await axios.get(
        `${apiView}?page=${page - 1}&size=${itemsPerPage}`
      );
      const { content, totalPages } = res.data.data;
      setDataTable(content);
      setFilteredData(content);
      setTotalPage(totalPages);
      paginateData(content, page);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  // Pagination logic
  const paginateData = (data, page) => {
    const startIndex = (page - 1) * itemsPerPage;
    const paginated = data.slice(startIndex, startIndex + itemsPerPage);
    setPaginatedData(paginated);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    getData(pageNumber);
  };

  const handleSearch = (event) => {
    const term = event.target.value.toLowerCase();
    setKeyword(term);

    if (term) {
      const filtered = dataTable.filter((item) => {
        const itemIdHocVien = item.studentId ? item.studentId.toString() : "";
        return itemIdHocVien.toLowerCase().includes(term);
      });
      setFilteredData(filtered);
      paginateData(filtered, 1);
      setCurrentPage(1);
      setTotalPage(Math.ceil(filtered.length / itemsPerPage));
    } else {
      setFilteredData(dataTable);
      paginateData(dataTable, 1);
      setCurrentPage(1);
      setTotalPage(Math.ceil(dataTable.length / itemsPerPage));
    }
  };

  const handleSave = (formData) => {
    const { action } = modalProps;

    if (action === "CREATE") {
      axios
        .post(apiCreate, formData)
        .then(() => {
          setModalShow(false);
          getData();
        })
        .catch((err) => console.error("Error creating data:", err));
    } else if (action === "EDIT") {
      axios
        .put(`${apiUpdate}/${modalProps.initialIdCurrent}`, formData)
        .then(() => {
          setModalShow(false);
          getData();
        })
        .catch((err) => console.error("Error updating data:", err));
    }
  };

  const handleDelete = (id) => {
    const selectedItem = dataTable.find((item) => item.id === id);
    setDeleteItem(selectedItem);
    setDeleteModalShow(true);
  };

  const confirmDelete = () => {
    if (deleteItem) {
      axios
        .delete(`${apiDelete}/${deleteItem.id}`)
        .then(() => {
          console.log("Deleted item:", deleteItem);
          setDeleteModalShow(false);
          getData();
        })
        .catch((err) => {
          console.error("Error deleting data:", err);
          // Optional: Add user feedback for delete failure
        });
    }
  };

  const handleAddNew = () => {
    setModalProps({
      action: "CREATE",
      formFieldsProp,
      initialIsEdit: false,
      initialIdCurrent: null,
    });
    setModalShow(true);
  };

  const handleEdit = (id) => {
    setModalProps({
      action: "EDIT",
      formFieldsProp,
      initialIsEdit: true,
      initialIdCurrent: id,
    });
    setModalShow(true);
  };

  const handleView = (id) => {
    setModalProps({
      action: "VIEW",
      formFieldsProp,
      initialIsEdit: false,
      initialIdCurrent: id,
    });
    setModalShow(true);
  };

  return (
    <>
      <section className="content-header">
        <div className="container-fluid">
          <div className="row mb-2">
            <div className="col-sm-6">
              <h1>Quản lý Bảo Lưu</h1>
            </div>
            <div className="col-sm-6">
              <ol className="breadcrumb float-sm-right">
                <li className="breadcrumb-item">
                  <a href="#">Home</a>
                </li>
                <li className="breadcrumb-item active">Quản lý bảo lưu</li>
              </ol>
            </div>
          </div>
        </div>
      </section>
      <section className="content">
        <div className="container-fluid">
          <div className="row justify-content-center">
            <div className="col">
              <div className="card card-primary">
                <div className="card-body">
                  <div className="row align-items-center">
                    <div className="col-md-10 d-flex align-items-center gap-3">
                      <div className="d-flex col-md-6 justify-between-end gap-2">
                        <input
                          type="text"
                          value={keyword}
                          className="form-control"
                          placeholder="Tìm kiếm học viên..."
                          aria-label="Search input"
                          onChange={handleSearch}
                        />
                      </div>
                    </div>
                    <div className="col-md-2 d-flex align-items-center justify-content-end">
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={handleAddNew}
                      >
                        Thêm mới +
                      </Button>
                    </div>
                  </div>

                  {loading ? (
                    <div className="text-center my-5">
                      <Spinner animation="border" />
                    </div>
                  ) : (
                    <>
                      <div className="row">
                        <div className="col-12" style={{ width: "100%" }}>
                          <TableComponents
                            cols={cols}
                            dataTable={paginatedData}
                            classTable="table table-bordered table-hover"
                            handleEdit={handleEdit}
                            apiDelete={apiDelete} // Pass apiDelete
                            getData={getData} // Pass getData to refresh data
                            handleView={handleView}
                          />
                        </div>
                      </div>
                      <div className="row justify-content-center mt-3">
                        <div className="col-auto">
                          <PagingComponent
                            totalPage={totalPage}
                            currentPage={currentPage}
                            onPageChange={handlePageChange}
                          />
                        </div>
                      </div>
                    </>
                  )}
                </div>
                <div className="card-footer"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ModalComponent
        show={modalShow}
        onHide={() => setModalShow(false)}
        action={modalProps.action}
        formFieldsProp={modalProps.formFieldsProp}
        initialIsEdit={modalProps.initialIsEdit}
        initialIdCurrent={modalProps.initialIdCurrent}
        apiCreate={apiCreate}
        apiUpdate={apiUpdate}
        apiView={apiView}
        getData={getData}
      />

      <DeleteComponent
        show={deleteModalShow}
        onHide={() => setDeleteModalShow(false)}
        deleteItem={deleteItem}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default ReservationComponent;
