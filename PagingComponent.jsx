import React from "react";
import Pagination from "react-bootstrap/Pagination";

const PagingComponent = ({ totalPage, currentPage, onPageChange }) => {
  const handlePageChange = (pageNumber) => {
    onPageChange(pageNumber);
  };

  return (
    <Pagination>
      <Pagination.First
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
      />
      <Pagination.Prev
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
      />
      {[...Array(totalPage).keys()].map((number) => {
        const pageNumber = number + 1;
        return (
          <Pagination.Item
            key={pageNumber}
            active={pageNumber === currentPage}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </Pagination.Item>
        );
      })}
      <Pagination.Next
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPage}
      />
      <Pagination.Last
        onClick={() => handlePageChange(totalPage)}
        disabled={currentPage === totalPage}
      />
    </Pagination>
  );
};

export default PagingComponent;
