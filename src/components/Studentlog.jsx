import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link } from "react-router-dom";

const Search = ({ onSubmit }) => {
  const [filterType, setFilterType] = useState("name");
  const [filterValue, setFilterValue] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(filterType, filterValue);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit(e);
    }
  };

  const handleChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <form onSubmit={handleSubmit} className="sl-search-form">
      <select
        value={filterType}
        onChange={(e) => setFilterType(e.target.value)}
        className="sl-select"
      >
        <option className="sl-option" value="name">
          이름
        </option>
        <option className="sl-option" value="number">
          번호
        </option>
      </select>
      <input
        name="filter"
        className="sl-input"
        value={filterValue}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />
      <button type="submit" className="sl-search-btn">
        검색
      </button>
    </form>
  );
};

const Table = ({ columns, data }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    nextPage,
    previousPage,
    canNextPage,
    canPreviousPage,
    pageOptions,
    gotoPage,
    pageCount,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const buttonsToShow = 5;

  // 현재 활성화된 페이지 버튼들 계산
  const calculatePageButtons = () => {
    const totalButtons = Math.min(buttonsToShow, pageCount); // 최대 버튼 수는 pageCount 이하
    const start = Math.max(0, pageIndex - Math.floor(totalButtons / 2));
    return Array.from({ length: totalButtons }, (_, i) => start + i);
  };

  // 현재 보여질 페이지 버튼 배열
  const pageButtons = calculatePageButtons();

  return (
    <div className="sl-table-container">
      <table className="sl-table" {...getTableProps()}>
        <thead className="sl-table-head">
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps(column.getSortByToggleProps())}>
                  {column.render("Header")}
                  {column.canSort && column.Header !== "상담기록" ? (
                    column.isSorted ? (
                      column.isSortedDesc ? (
                        <FaSortDown style={{ marginLeft: "5px" }} />
                      ) : (
                        <FaSortUp style={{ marginLeft: "5px" }} />
                      )
                    ) : (
                      <FaSort style={{ marginLeft: "5px" }} />
                    )
                  ) : null}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className="sl-table-body" {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()}>
                {row.cells.map((cell) => (
                  <td {...cell.getCellProps()}>
                    <Link
                      to={`/students/${row.original.id}`} // 학생 개별 페이지로 이동
                      style={{ textDecoration: "none", color: "inherit" }}
                    >
                      {cell.render("Cell")}
                    </Link>
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="sl-pagination">
        <button
          className="sl-arrow-btn"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="sl-arrow-btn"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        {pageButtons.map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => gotoPage(pageNumber)}
            className={`sl-page-btn ${
              pageIndex === pageNumber ? "active" : ""
            }`}
          >
            {pageNumber + 1}
          </button>
        ))}
        <button
          className="sl-arrow-btn"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="sl-arrow-btn"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </div>
  );
};

const StudentList = () => {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/students");
        setStudents(response.data);
        setFilteredStudents(response.data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  const handleSearchSubmit = (filterType, value) => {
    // 입력 값이 비어있는 경우
    if (!value) {
      setFilteredStudents(students);
      return;
    }

    const filteredData = students.filter((student) =>
      filterType === "name"
        ? student.name.includes(value.trim())
        : student.number.toString().includes(value.trim())
    );

    setFilteredStudents(filteredData);
  };

  const columns = React.useMemo(
    () => [
      {
        Header: "학번",
        accessor: "number",
      },
      {
        Header: "이름",
        accessor: "name",
      },
      {
        Header: "상담기록",
        accessor: "log",
        disableSortBy: true,
      },
      {
        Header: "상담일시",
        accessor: "date",
      },
    ],
    []
  );

  return (
    <>
      <Search onSubmit={handleSearchSubmit} />
      {loading ? (
        <div className="sl-messages">Loading...</div>
      ) : error ? (
        <div className="sl-messages">Error: {error}</div>
      ) : students.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : filteredStudents.length === 0 ? (
        <div className="sl-messages">검색 결과가 없습니다.</div>
      ) : (
        <Table columns={columns} data={filteredStudents} />
      )}
    </>
  );
};

export default StudentList;
