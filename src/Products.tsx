import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "./Product";

const Products = (props: any) => {
  const [currentPagination, setCurrentPagination] = useState(null);
  const [pageCount, setPageCount] = useState(0);
  const [itemOffset, setItemOffset] = useState(0);
  const itemsPerPage = 20;

  useEffect(() => {
    const endOffset = itemOffset + itemsPerPage;
    setCurrentPagination(props.currentFiltered.slice(itemOffset, endOffset));
    setPageCount(Math.ceil(props.currentFiltered.length / itemsPerPage));
  }, [itemOffset, props.currentFiltered]);

  const handlePageClick = (event: any) => {
    const newOffset =
      (event.selected * itemsPerPage) % props.currentFiltered.length;
    setItemOffset(newOffset);
  };

  return (
    <>
      <Product currentPagination={currentPagination} />
      <ReactPaginate
        nextLabel="next >"
        onPageChange={handlePageClick}
        pageCount={pageCount}
        previousLabel="< previous"
        containerClassName={"pagination"}
      />
    </>
  );
};

export default Products;
