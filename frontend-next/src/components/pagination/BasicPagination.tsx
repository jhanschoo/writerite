import { Pagination } from '@mantine/core';
import { ElementType, ReactNode, useState } from 'react';

export interface BasicPaginationProps {
  wrapper: ElementType;
  children: ReactNode[];
  pageSize: number;
  top?: boolean;
}

// BasicPagination takes in an array of keyed components and paginates them according to pageSize.
// This is as opposed to receiving an array of data elements and calling a callback on only the data elements on the page. TODO: determine location of state management
const BasicPagination = ({ wrapper: Wrapper, children, pageSize, top }: BasicPaginationProps) => {
  const [page, setPage] = useState(1);
  const paginationComponent = (
    <Pagination
      total={Math.ceil(children.length / pageSize)}
      page={page}
      onChange={(nextPage) => setPage(nextPage)}
    />
  );
  return (
    <>
      {top && paginationComponent}
      <Wrapper>{children.slice(pageSize * (page - 1), pageSize * page)}</Wrapper>
      {paginationComponent}
    </>
  );
};

export default BasicPagination;
