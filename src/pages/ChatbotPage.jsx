import React, { useState, useEffect, useMemo, useCallback } from "react";
import axios from "axios";
import {
  useGlobalFilter,
  useSortBy,
  useTable,
  usePagination,
} from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import "../ui/ChatLog.css";

const ChatLog = ({ searchTerm }) => {
  const navigate = useNavigate();
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
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (!searchTerm) {
      setFilteredStudents(students);
    } else {
      const filteredData = students.filter((student) =>
        student.name.includes(searchTerm.trim())
      );
      setFilteredStudents(filteredData);
    }
  }, [searchTerm, students]);

  const columns = useMemo(
    () => [
      {
        Header: "상담일시",
        accessor: "date",
      },
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
        accessor: "chat-log",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="log-btn"
            onClick={() => navigate(`/chatdetail/${row.original.id}`)}
          >
            상담기록 확인
          </button>
        ),
      },
      {
        Header: "레포트",
        accessor: "report",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="log-btn"
            onClick={() => navigate(`/report/${row.original.id}`)}
          >
            레포트 확인
          </button>
        ),
      },
    ],
    [navigate]
  );

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
    gotoPage,
    pageCount,
    state: { pageIndex },
  } = useTable(
    {
      columns,
      data: filteredStudents,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const buttonsToShow = 5;

  const calculatePageButtons = useCallback(() => {
    const totalButtons = Math.min(buttonsToShow, pageCount);
    const start = Math.max(0, pageIndex - Math.floor(totalButtons / 2));
    return Array.from({ length: totalButtons }, (_, i) => start + i);
  }, [pageCount, pageIndex]);

  const pageButtons = useMemo(
    () => calculatePageButtons(),
    [calculatePageButtons]
  );

  return (
    <>
      {loading ? (
        <div className="sl-messages">Loading...</div>
      ) : error ? (
        <div className="sl-messages">Error: {error}</div>
      ) : students.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : filteredStudents.length === 0 ? (
        <div className="sl-messages">검색 결과가 없습니다.</div>
      ) : (
        <div className="sl-table-container">
          <div className="sl-table-wrapper">
            <table className="sl-table" {...getTableProps()}>
              <thead className="sl-table-head">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps(
                          column.getSortByToggleProps()
                        )}
                      >
                        {column.render("Header")}
                        {column.canSort &&
                        column.Header !== "상담기록" &&
                        column.Header !== "레포트" ? (
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
                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                      ))}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
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
      )}
    </>
  );
};

export default ChatLog;
