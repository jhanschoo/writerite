import { Pagination } from "@mui/material";
import { ChangeEvent, ElementType, ReactNode, useState } from "react";

export interface BasicPaginationProps {
  wrapper: ElementType;
  children: ReactNode[];
  pageSize: number;
  top?: boolean;
}

// BasicPagination takes in an array of keyed components and paginates them according to pageSize.
// This is as opposed to receiving an array of data elements and calling a callback on only the data elements on the page. TODO: determine location of state management
const BasicPagination = ({ wrapper: Wrapper, children, pageSize }: BasicPaginationProps) => {
  const [page, setPage] = useState(1);
  const handleChange = (_e: ChangeEvent<unknown>, value: number) => setPage(value)
  return (
    <>
      {top && <Pagination count={Math.ceil(children.length / pageSize)} page={page} onChange={handleChange} />}
      <Wrapper>
        {children.slice(pageSize * (page - 1), pageSize * page)}
      </Wrapper>
      <Pagination count={Math.ceil(children.length / pageSize)} page={page} onChange={handleChange} />
    </>
  );
};

export default BasicPagination;