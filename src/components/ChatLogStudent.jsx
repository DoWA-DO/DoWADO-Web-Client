// 이 파일은 React를 사용하여 학생 상담 기록을 표시하는 페이지입니다.
// 학생 또는 교사의 역할에 따라 서로 다른 테이블을 렌더링하며, react-table을 이용하여 페이지네이션과 정렬 기능을 제공합니다.

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

// Table 컴포넌트는 상담 기록 데이터를 표 형태로 렌더링하며, 페이지네이션과 정렬 기능을 제공합니다.
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
    { columns, data, initialState: { pageIndex: 0, pageSize: 10 } }, // 초기 페이지 크기를 설정합니다.
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const buttonsToShow = 5;

  // 페이지 버튼을 계산하는 함수
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
                      column.Header !== "레포트" ? ( // 특정 컬럼은 정렬을 비활성화합니다.
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
                          disabled={!row.original.chat_status}
                        >
                          상담기록 보기
                        </button>
                      ) : cell.column.id === "report" ? (
                        <button
                          className="log-btn"
                          onClick={() => {
                            if (!row.original.chat_status) {
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
                          {!row.original.chat_status ? "상담 이어하기" : "레포트 보기"}
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
            className={`sl-page-btn ${pageIndex === pageNumber ? "active" : ""
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

// ChatLogStudent 컴포넌트는 학생의 상담 기록을 관리하고 표시합니다.
const ChatLogStudent = () => {
  const navigate = useNavigate();
  const { userEmail, authToken } = useAuth(); // 현재 로그인된 사용자의 이메일과 토큰을 가져옵니다.
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 학생 데이터를 가져오는 useEffect
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/report/student/chatlogs",  // 학생 상담 기록 조회
          {
            headers: {
              Authorization: `Bearer ${authToken}`, // authToken 추가
            },
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
  }, [userEmail, authToken]);

  // 테이블에 표시할 컬럼 정의
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
            disabled={!row.original.chat_status}
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
              if (!row.original.chat_status) {
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
            {!row.original.chat_status ? "상담 이어하기" : "레포트 보기"}
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
