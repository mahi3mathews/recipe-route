import { PaginationControl } from "react-bootstrap-pagination-control";
import "./pagination.scss";

const Pagination = ({ page, total, changePage, className, limit = 20 }) => {
    return (
        <PaginationControl
            className={`custom-pagination ${className}`}
            page={page}
            between={4}
            total={total}
            limit={limit}
            changePage={changePage}
            ellipsis={1}
        />
    );
};

export default Pagination;
