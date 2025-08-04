import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function JobTab({contactId}) {
    const navigate = useNavigate();
   
  return (
    <>
       <li
                  className="nav-item"
                  role="presentation"
                  onClick={() => {
                    localStorage.setItem("activeTab2", "#pills-overview");
                    navigate(`/contacts/detail/${contactId}`)
                  }}
                >
                  <button
                    className="nav-link"
                    id="pills-overview-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-overview"
                    type="button"
                    role="tab"
                    aria-controls="pills-overview"
                    aria-selected="false"
                  >
                    <span>
                      <svg
                        width={12}
                        height={17}
                        viewBox="0 0 12 17"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M9.75 1.5H6.75V0.75H5.25V1.5H2.25C1.65326 1.5 1.08097 1.73705 0.65901 2.15901C0.237053 2.58097 0 3.15326 0 3.75V6C0 6.99456 0.395088 7.94839 1.09835 8.65165C1.80161 9.35491 2.75544 9.75 3.75 9.75H8.25C9.24456 9.75 10.1984 9.35491 10.9017 8.65165C11.6049 7.94839 12 6.99456 12 6V3.75C12 3.15326 11.7629 2.58097 11.341 2.15901C10.919 1.73705 10.3467 1.5 9.75 1.5ZM5.25 5.625C5.25 5.92337 5.13147 6.20952 4.9205 6.4205C4.70952 6.63147 4.42337 6.75 4.125 6.75C3.82663 6.75 3.54048 6.63147 3.3295 6.4205C3.11853 6.20952 3 5.92337 3 5.625C3 5.32663 3.11853 5.04048 3.3295 4.8295C3.54048 4.61853 3.82663 4.5 4.125 4.5C4.42337 4.5 4.70952 4.61853 4.9205 4.8295C5.13147 5.04048 5.25 5.32663 5.25 5.625ZM9 5.625C9 5.92337 8.88147 6.20952 8.6705 6.4205C8.45952 6.63147 8.17337 6.75 7.875 6.75C7.57663 6.75 7.29048 6.63147 7.0795 6.4205C6.86853 6.20952 6.75 5.92337 6.75 5.625C6.75 5.32663 6.86853 5.04048 7.0795 4.8295C7.29048 4.61853 7.57663 4.5 7.875 4.5C8.17337 4.5 8.45952 4.61853 8.6705 4.8295C8.88147 5.04048 9 5.32663 9 5.625ZM0 16.5C0 14.9087 0.632141 13.3826 1.75736 12.2574C2.88258 11.1321 4.4087 10.5 6 10.5C7.5913 10.5 9.11742 11.1321 10.2426 12.2574C11.3679 13.3826 12 14.9087 12 16.5H0Z"
                          fill="#9C9BA3"
                        />
                      </svg>
                    </span>{" "}
                    Profile
                  </button>
                </li>
                <li
                  className="nav-item"
                  role="presentation"
                  onClick={() => {
                    localStorage.setItem("activeTab2", "#pills-playbook");
                    navigate(`/contacts/detail/${contactId}`)
                  }}
                >
                  <button
                    className="nav-link"
                    id="pills-playbook-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-playbook"
                    type="button"
                    role="tab"
                    aria-controls="pills-playbook"
                    aria-selected="false"
                  >
                    <span>
                      <svg
                        width={14}
                        height={16}
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13 15.5H2.875C2.17881 15.5 1.51113 15.2234 1.01884 14.7312C0.526562 14.2389 0.25 13.5712 0.25 12.875V2.75C0.25 2.15326 0.487053 1.58097 0.90901 1.15901C1.33097 0.737053 1.90326 0.5 2.5 0.5H13C13.1989 0.5 13.3897 0.579018 13.5303 0.71967C13.671 0.860322 13.75 1.05109 13.75 1.25V14.75C13.75 14.9489 13.671 15.1397 13.5303 15.2803C13.3897 15.421 13.1989 15.5 13 15.5ZM12.25 14V11.75H2.875C2.57663 11.75 2.29048 11.8685 2.0795 12.0795C1.86853 12.2905 1.75 12.5766 1.75 12.875C1.75 13.1734 1.86853 13.4595 2.0795 13.6705C2.29048 13.8815 2.57663 14 2.875 14H12.25ZM5.5 2V8L8.125 6.5L10.75 8V2H5.5Z"
                          fill="#9C9BA3"
                        />
                      </svg>
                    </span>{" "}
                    Address
                  </button>
                </li>
                <li className="nav-item" role="presentation">
                  <button
                    className="nav-link active"
                    id="pills-content-tab"
                    data-bs-toggle="pill"
                    data-bs-target="#pills-content"
                    type="button"
                    role="tab"
                    aria-controls="pills-content"
                    aria-selected="true"
                  >
                    <span>
                      <svg
                        width={14}
                        height={16}
                        viewBox="0 0 14 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M3.25 3.5V1.25C3.25 1.05109 3.32902 0.860322 3.46967 0.71967C3.61032 0.579018 3.80109 0.5 4 0.5H13C13.1989 0.5 13.3897 0.579018 13.5303 0.71967C13.671 0.860322 13.75 1.05109 13.75 1.25V11.75C13.75 11.9489 13.671 12.1397 13.5303 12.2803C13.3897 12.421 13.1989 12.5 13 12.5H10.75V14.75C10.75 15.164 10.4125 15.5 9.99475 15.5H1.00525C0.906345 15.5006 0.808298 15.4816 0.716742 15.4442C0.625186 15.4068 0.541925 15.3517 0.471744 15.282C0.401563 15.2123 0.345845 15.1294 0.307791 15.0381C0.269737 14.9468 0.250097 14.8489 0.25 14.75L0.25225 4.25C0.25225 3.836 0.58975 3.5 1.00675 3.5H3.25ZM4.75 3.5H10.75V11H12.25V2H4.75V3.5ZM3.25 7.25V8.75H7.75V7.25H3.25ZM3.25 10.25V11.75H7.75V10.25H3.25Z"
                          fill="#9C9BA3"
                        />
                      </svg>
                    </span>{" "}
                    Jobs
                  </button>
                </li>
    </>
  )
}
