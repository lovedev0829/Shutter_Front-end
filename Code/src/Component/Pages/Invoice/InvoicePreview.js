import { Link, useParams } from "react-router-dom";

export default function InvoicePreview() {
  let param = useParams();
  
  return (
    <>
      <style>
        {`
     table {
     border-collapse: unset;
     }
    .tableborder tbody tr td, .tableborder tbody tr th{
    border-color:black;
    border-width:1px;
    }
     `}
      </style>
      <div className="heading_width_search d-flex justify-content-center mb-3 mt-3 align-items-center">
        <Link to={`/contacts/job/${param.InvoiceId}`} className="cancelheader text-decoration-underlinet me-3" style={{color:"black"}}>
          Cancel
        </Link>
        <Link to="#" className="btn blue-btn small_btn">
          Print Invoice
        </Link>
      </div>
      <table
        style={{
          width: "1000px",
          margin: "0 auto",
          fontFamily: "sans-serif",
          border: "10px solid #ddd",
          padding: "15px",
        }}
        border={0}
        cellPadding={0}
        cellSpacing={0}
      >
        <tbody>
          <tr>
            <td style={{ padding: "0px 20px" }}>
              <table
                border={0}
                style={{ width: "100%", fontSize: "14px", color: "#1B1C1D" }}
                cellPadding={0}
                cellSpacing={0}
              >
                <tbody>
                  <tr>
                    <td style={{ padding: "8px 0px 0px 0px" }}>
                      <Link to="#" style={{ display: "block" }}>
                        <img
                          src="/logo.svg"
                          style={{ height: "67px" }}
                          alt=""
                          loading="lazy"
                        />
                      </Link>
                    </td>
                    <td
                      style={{
                        padding: "8px 0px 0px 0px",
                        verticalAlign: "top",
                      }}
                    >
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Gulf Coast Shutter{" "}
                      </p>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        221 Venture Blvd{" "}
                      </p>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Houma , La 70360
                      </p>
                    </td>
                    <td
                      style={{
                        padding: "8px 0px 0px 0px",
                        verticalAlign: "top",
                        textAlign: "right",
                      }}
                    >
                      <p
                        style={{
                          fontSize: "14px",
                          margin: 0,
                          marginTop: "0px",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>
                          Estimate date :{" "}
                        </span>
                        <span
                          style={{
                            fontWeight: 700,
                            display: "inline-block",
                            width: "90px",
                          }}
                        >
                          10/21/2024
                        </span>
                      </p>
                      <p
                        style={{
                          fontSize: "14px",
                          margin: 0,
                          marginTop: "0px",
                          marginBottom: "10px",
                        }}
                      >
                        <span style={{ fontWeight: 700 }}>Prepared By : </span>
                        <span
                          style={{
                            fontWeight: 700,
                            display: "inline-block",
                            width: "90px",
                          }}
                        >
                          Ksahm
                        </span>
                      </p>
                      <p
                        style={{
                          fontSize: "16px",
                          margin: 0,
                          marginTop: "17px",
                          marginBottom: 0,
                        }}
                      >
                        <span
                          style={{ fontWeight: 700, color: "rgb(174, 20, 20)" }}
                        >
                          Estimate ID : GCS-ESTID-13667
                        </span>
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td>
              <p
                style={{
                  padding: "4px",
                  backgroundColor: "#e9b9b9",
                  color: "#1B1C1D",
                  fontWeight: 700,
                  marginTop: "10px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginBottom: 0,
                  textAlign: "center",
                }}
              >
                Payment Terms : 50% deposit due on signing . Remaining balance
                due upon completion
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "7px 0px" }}>
              <table>
                <tbody>
                  <tr>
                    <td style={{ width: "150px" }}>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Customer ID:{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        GCS-CUSTID-2445
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Customer Name :{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Chad Parker
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Address :{" "}
                      </p>
                    </td>
                    <td />
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Location ID :{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Home
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        City :{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        On coast
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        State :{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Ms
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Zip Code:{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      ></p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Home Phone:{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      ></p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Mobile Phone:{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        6019161641
                      </p>
                    </td>
                  </tr>
                  <tr>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        Email Address:{" "}
                      </p>
                    </td>
                    <td>
                      <p
                        style={{
                          color: "#1B1C1D",
                          fontWeight: 700,
                          marginTop: "0px",
                          fontSize: "14px",
                          lineHeight: "20px",
                          marginBottom: 0,
                        }}
                      >
                        chadwparker@gmail.com
                      </p>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "7px 0px" }}>
              <table
                style={{
                  width: "100%",
                  fontSize: "14px",
                  color: "#1B1C1D",
                  borderCollapse: "collapse",
                }}
                cellPadding={0}
                cellSpacing={0}
                className="tableborder"
              >
                <tbody>
                  <tr
                    style={{
                      backgroundColor: "#93b0d9",
                      textAlign: "center",
                      padding: "10px",
                    }}
                  >
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Ln
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Shutter Type
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Items
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Color
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Qty
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Width
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Height
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Unit Price
                    </th>
                    <th style={{ padding: "5px 5px", textAlign: "center" }}>
                      Sub Total
                    </th>
                  </tr>
                  <tr style={{ backgroundColor: "#efefef" }}>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      1
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      Tri-Fold Shutter
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "5px 5px",
                        width: "250px",
                      }}
                    >
                      <div>
                        Shutter Installation With Build Out Rated Woods and
                        windows
                      </div>
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      Black
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      3.00
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      37.00
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      60.38
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      $ 998.03
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      $ 2,990
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#efefef" }}>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      2
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      Bahama Shutter
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "5px 5px",
                        width: "250px",
                      }}
                    >
                      <div>Shutter Installation With Build</div>
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      Black
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      3.00
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      37.00
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      60.38
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      $ 998.03
                    </td>
                    <td style={{ textAlign: "center", padding: "5px 5px" }}>
                      $ 2,990
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "7px 0px" }}>
              <table
                border={1}
                style={{
                  fontSize: "14px",
                  color: "#1B1C1D",
                  float: "right",
                  borderWidth: "1",
                  borderCollapse: "collapse",
                }}
                cellPadding={0}
                cellSpacing={0}
                className="tableborder"
              >
                <tbody>
                  <tr>
                    <td
                      style={{
                        textAlign: "end",
                        padding: "5px 5px",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      Estimate Subtotal :
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "5px 20px",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      $ 2994.08
                    </td>
                  </tr>
                  <tr style={{ backgroundColor: "#fffa9f" }}>
                    <td
                      style={{
                        textAlign: "end",
                        padding: "5px 5px",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      Estimate Grand Total :
                    </td>
                    <td
                      style={{
                        textAlign: "center",
                        padding: "5px 20px",
                        fontWeight: 700,
                        fontSize: "14px",
                      }}
                    >
                      $ 2994.08
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0px 15px 15px 0px" }}>
              <p
                style={{
                  color: "#1B1C1D",
                  fontWeight: 700,
                  marginTop: "0px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginBottom: 0,
                }}
              >
                Note : Electrician is not included for motorized shutters
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0px 15px 15px 0px" }}>
              <p
                style={{
                  color: "#1B1C1D",
                  fontWeight: 700,
                  marginTop: "0px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginBottom: 0,
                }}
              >
                This estimate is valid for 14 days .{" "}
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0px 15px 15px 0px" }}>
              <p
                style={{
                  color: "#1B1C1D",
                  fontWeight: 700,
                  marginTop: "0px",
                  fontSize: "14px",
                  lineHeight: "20px",
                  marginBottom: 0,
                }}
              >
                Invoices paid with credit card are subject to a 3.5% surcharge .
              </p>
            </td>
          </tr>
          <tr>
            <td style={{ padding: "0px 0px" }}>
              <p
                style={{
                  color: "#1B1C1D",
                  fontWeight: 700,
                  marginTop: "40px",
                  fontSize: "17px",
                  lineHeight: "20px",
                  marginBottom: 0,
                }}
              >
                Signature : &nbsp;
                _______________________________________________________________________________________
              </p>
            </td>
          </tr>
          <tr>
            <td>
              <p
                style={{
                  color: "#1B1C1D",
                  marginTop: "15px",
                  fontSize: "13px",
                  lineHeight: "20px",
                  marginBottom: 0,
                }}
              >
                Lorem ipsum, dolor sit amet consectetur adipisicing elit.
                Adipisci ab maxime dolorum velit quia libero rem impedit
                repellat optio corrupti. Lorem, ipsum dolor sit amet consectetur
                adipisicing elit. Eveniet ut iusto a numquam, natus explicabo
                neque voluptatibus adipisci aperiam fuga. Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Nemo, numquam? Lorem ipsum
                dolor sit amet consectetur adipisicing elit. Officiis animi
                corrupti assumenda nobis odit cumque repellat enim pariatur unde
                ipsa!{" "}
              </p>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  );
}
