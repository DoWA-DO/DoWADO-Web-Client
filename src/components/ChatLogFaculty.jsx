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
import { useAuth } from "../components/AuthContext";
import userEvent from "@testing-library/user-event";

const Table = ({ columns, data, navigate }) => {
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
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } },
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
    <div className="sl-table-container">
      <div className="sl-table-wrapper">
        <table className="sl-table" {...getTableProps()}>
          <thead className="sl-table-head">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th {...column.getHeaderProps(column.getSortByToggleProps())}>
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
                    <td {...cell.getCellProps()}>
                      {cell.column.id === "chat-log" ? (
                        <button
                          className="log-btn"
                          onClick={() =>
                            navigate("/chatbotdetail", {
                              state: {
                                chat_id: row.original.id,
                                chat_student_email: userEmail,
                                chat_status: row.original.chat_status,
                              },
                            })
                          }
                        >
                          상담기록 확인
                        </button>
                      ) : cell.column.id === "report" ? (
                        <button
                          className="log-btn"
                          onClick={() =>
                            navigate("/report", {
                              state: {
                                teacher_email: userEmail,
                                chat_id: row.original.id,
                                report_id: row.original.report_id,
                              },
                            })
                          }
                        >
                          레포트 확인
                        </button>
                      ) : (
                        <Link
                          to={`/students/${row.original.id}`} // 학생 개별 페이지로 이동
                          style={{ textDecoration: "none", color: "inherit" }}
                        >
                          {cell.render("Cell")}
                        </Link>
                      )}
                    </td>
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
  );
};

const ChatLogFaculty = ({ filterType, searchTerm }) => {
  const navigate = useNavigate();
  const { userEmail } = useAuth();
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const chat_status = 1; // 교사 chat_status는 1

  const fetchStudents = useCallback(
    async (filterType, search) => {
      // searchTerm이 비어있으면 전체 기록 조회
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/chat/read", // 학생 상담 기록 조회
          {
            params: {
              teacher_email: userEmail,
              chat_status,
              filter_type: filterType,
              search,
            },
          }
        );
        setFilteredStudents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    },
    [userEmail, chat_status]
  );

  useEffect(() => {
    if (userEmail) {
      fetchStudents(filterType, searchTerm);
    }
  }, [userEmail, chat_status, filterType, searchTerm, fetchStudents]);

  const columns = useMemo(
    () => [
      {
        Header: "상담일시",
        accessor: "chat_date",
      },
      {
        Header: "학번",
        accessor: "student_number",
      },
      {
        Header: "이름",
        accessor: "student_name",
      },
      {
        Header: "상담기록",
        accessor: "chat-log",
        disableSortBy: true,
        Cell: ({ row }) => (
          <button
            className="log-btn"
            onClick={() =>
              navigate("/chatbotdetail", {
                state: {
                  chat_id: row.original.id,
                  teacher_email: userEmail,
                  chat_status: row.original.chat_status,
                },
              })
            }
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
          <button className="log-btn" onClick={() => navigate(`/report`)}>
            레포트 확인
          </button>
        ),
      },
    ],
    [navigate]
  );

  return (
    <>
      {loading ? (
        <div className="sl-messages">Loading...</div>
      ) : error ? (
        <div className="sl-messages">Error: {error}</div>
      ) : filteredStudents.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : (
        <Table columns={columns} data={filteredStudents} navigate={navigate} />
      )}
    </>
  );
};

export default ChatLogFaculty;
