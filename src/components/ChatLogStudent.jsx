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
import { useAuth } from "./AuthContext";
import "../ui/ChatLog.css";

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

  // 페이징
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
                                chat_student_email: row.original.email,
                                chat_status: row.original.chat_status,
                              },
                            })
                          }
                          disabled={row.original.chat_status === 0}
                        >
                          상담기록 보기
                        </button>
                      ) : cell.column.id === "report" ? (
                        <button
                          className="log-btn"
                          onClick={() => {
                            if (row.original.chat_status === 0) {
                              navigate("/chatbot", {
                                state: {
                                  chat_id: row.original.id,
                                  chat_student_email: row.original.email,
                                  chat_status: row.original.chat_status,
                                },
                              });
                            } else {
                              navigate("/report", {
                                state: {
                                  chat_id: row.original.id,
                                  chat_student_email: row.original.email,
                                  report_id: row.original.report_id,
                                },
                              });
                            }
                          }}
                        >
                          {row.original.chat_status === 0
                            ? "상담 이어하기"
                            : "레포트 보기"}
                        </button>
                      ) : (
                        <Link
                          to={`/students/${row.original.id}`}
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

const ChatLogStudent = () => {
  const navigate = useNavigate();
  const { userEmail } = useAuth(); // useAuth 훅 사용
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/v1/chat/read", // 학생 상담 기록 조회
          {
            params: { email: userEmail },
          }
        );
        setStudents(response.data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [userEmail]);

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
            onClick={() =>
              navigate("/chatbotdetail", {
                state: {
                  chat_id: row.original.id,
                  chat_student_email: row.original.email,
                  chat_status: row.original.chat_status,
                },
              })
            }
            disabled={row.original.chat_status === 0}
          >
            상담기록 보기
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
            onClick={() => {
              if (row.original.chat_status === 0) {
                navigate("/chatbot", {
                  state: {
                    chat_id: row.original.id,
                    chat_student_email: row.original.email,
                    chat_status: row.original.chat_status,
                  },
                });
              } else {
                navigate("/report", {
                  state: {
                    chat_id: row.original.id,
                    chat_student_email: row.original.email,
                    report_id: row.original.report_id,
                  },
                });
              }
            }}
          >
            {row.original.chat_status === 0 ? "상담 이어하기" : "레포트 보기"}
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
      ) : students.length === 0 ? (
        <div className="sl-messages">상담 내역이 없습니다.</div>
      ) : (
        <Table columns={columns} data={students} navigate={navigate} />
      )}
    </>
  );
};

export default ChatLogStudent;
