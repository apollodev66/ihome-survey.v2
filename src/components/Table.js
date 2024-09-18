import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFolder, faImage, faMap } from "@fortawesome/free-solid-svg-icons";
import { Button, Form } from "react-bootstrap";
import MyForm from "./MyForm";

function Table() {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const generateGoogleMapsUrl = (location) => {
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(location)}`;
  };

useEffect(() => {
  fetch("https://d15c-171-5-45-166.ngrok-free.app/api/testproject1")
    .then((response) => {
      if (!response.ok) {
        return response.text().then(text => {
          // แสดงข้อความที่ส่งกลับจากเซิร์ฟเวอร์เพื่อการดีบัก
          console.error(`Network response was not ok: ${response.statusText} - ${text}`);
          setError(new Error(`Network response was not ok: ${response.statusText} - ${text}`));
          setIsLoading(false);
        });
      }
      return response.json(); // อ่านเป็น JSON
    })
    .then((result) => {
      setData(result);
      setIsLoading(false);
    })
    .catch((error) => {
      console.error("There was an error fetching the data:", error);
      setError(error);
      setIsLoading(false);
    });
}, []);


  if (isLoading) {
    return <div>กำลังดาวน์โหลดข้อมูล......</div>;
  }

  if (error) {
    return <div>เกิดข้อผิดพลาด!: {error.message}</div>;
  }

  const parseJson = (jsonString) => {
    if (typeof jsonString !== "string") return "N/A";

    try {
      jsonString = jsonString.replace(/^"|"$/g, "").replace(/\\"/g, '"');
      const parsed = JSON.parse(jsonString);
      if (Array.isArray(parsed)) {
        return parsed.length > 0 ? parsed.join(", ") : "None";
      }
      return "Invalid JSON";
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return "Error";
    }
  };

  const getImageUrl = (filename) => {
    return filename
      ? `https://d15c-171-5-45-166.ngrok-free.app/api/uploads/${filename}`
      : "placeholder-image-url";
  };

  // Pagination logic
  const totalPages = Math.ceil(data.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = data.slice(startIndex, startIndex + itemsPerPage);
  
  return (
    <div className="container mt-5">
      <div className="mb-3 d-flex align-items-center">
        <div className="me-auto">
          <MyForm />
        </div>
        <Form.Group controlId="itemsPerPage" className="text-end">
          <Form.Label>จำนวนเอกสาร:</Form.Label>
          <Form.Control
            as="select"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(parseInt(e.target.value, 10))}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>30</option>
            <option value={50}>50</option>
          </Form.Control>
        </Form.Group>
      </div>
      <div className="table-responsive">
        <table className="table table-bordered table-striped table-sm">
          <thead>
            <tr>
              <th>ชื่อลูกค้า</th>
              <th>เบอร์โทรลูกค้า</th>
              <th>โลเคชั่น</th>
              <th>รายละเอียด</th>
              <th>รูปภาพ</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => {
              const completedSteps = parseJson(item.completedSteps);
              const uncompletedSteps = parseJson(item.uncompletedSteps);

              return (
                <tr key={index}>
                  <td>{item.cusname}</td>
                  <td>{item.cusphone}</td>
                  <td>
                    <Button
                      variant="outline-primary"
                      onClick={() =>
                        window.open(
                          generateGoogleMapsUrl(item.location),
                          "_blank"
                        )
                      }
                    >
                      <FontAwesomeIcon icon={faMap} />
                    </Button>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-warning"
                      data-bs-toggle="modal"
                      data-bs-target={`#detailsModal${index}`}
                    >
                      <FontAwesomeIcon icon={faFolder} />
                    </button>
                    <div
                      className="modal fade"
                      id={`detailsModal${index}`}
                      tabIndex="-1"
                      aria-labelledby={`detailsModalLabel${index}`}
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id={`detailsModalLabel${index}`}>
                              ข้อมูลของ {item.cusname}
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <p><strong>คูปอง:</strong> {item.coupon}</p>
                            <p><strong>หมายเหตุ:</strong> {item.notes}</p>
                            <p><strong>จังหวัด:</strong> {item.province}</p>
                            <p><strong>ที่อยู่:</strong> {item.address}</p>
                            <p><strong>สถาปนิก:</strong> {item.architect}</p>
                            <p><strong>โทรศัพท์สถาปนิก:</strong> {item.architectPhone}</p>
                            <p><strong>ผู้รับเหมา:</strong> {item.contractor}</p>
                            <p><strong>โทรศัพท์ผู้รับเหมา:</strong> {item.contractorPhone}</p>
                            <p><strong>หัวหน้าช่าง:</strong> {item.foreman}</p>
                            <p><strong>โทรศัพท์หัวหน้าช่าง:</strong> {item.foremanPhone}</p>
                            <p><strong>ประเภทอาคาร:</strong> {item.buildingType}</p>
                            <p><strong>ชื่อบริษัท:</strong> {item.companyName}</p>
                            <p><strong>โทรศัพท์บริษัท:</strong> {item.companyPhone}</p>
                            <p><strong>ชื่อผู้จัดซื้อ:</strong> {item.purchaserName}</p>
                            <p><strong>โทรศัพท์ผู้จัดซื้อ:</strong> {item.purchaserPhone}</p>
                            <p><strong>งบประมาณ:</strong> {item.budget} บาท</p>
                            <p><strong>ขั้นตอนที่เสร็จสิ้น:</strong> {completedSteps}</p>
                            <p><strong>ขั้นตอนที่ยังไม่เสร็จ:</strong> {uncompletedSteps}</p>
                            <p><strong>นัดหมาย:</strong> {item.appointment}</p>
                            <p><strong>วันที่สำรวจ:</strong> {item.surveyDate}</p>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              ปิด
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <button
                      type="button"
                      className="btn btn-light"
                      data-bs-toggle="modal"
                      data-bs-target={`#imageModal${index}`}
                    >
                      <FontAwesomeIcon icon={faImage} />
                    </button>
                    <div
                      className="modal fade"
                      id={`imageModal${index}`}
                      tabIndex="-1"
                      aria-labelledby={`imageModalLabel${index}`}
                      aria-hidden="true"
                    >
                      <div className="modal-dialog modal-dialog-centered modal-lg">
                        <div className="modal-content">
                          <div className="modal-header">
                            <h5 className="modal-title" id={`imageModalLabel${index}`}>
                              Images
                            </h5>
                            <button
                              type="button"
                              className="btn-close"
                              data-bs-dismiss="modal"
                              aria-label="Close"
                            ></button>
                          </div>
                          <div className="modal-body">
                            <div className="row">
                              {item.frontImg && (
                                <div className="col-12 mb-3">
                                  <h6>Front View</h6>
                                  <img
                                    src={getImageUrl(item.frontImg)}
                                    alt="Front"
                                    className="img-fluid"
                                  />
                                </div>
                              )}
                              {item.leftImg && (
                                <div className="col-12 mb-3">
                                  <h6>Left View</h6>
                                  <img
                                    src={getImageUrl(item.leftImg)}
                                    alt="Left"
                                    className="img-fluid"
                                  />
                                </div>
                              )}
                              {item.rightImg && (
                                <div className="col-12 mb-3">
                                  <h6>Right View</h6>
                                  <img
                                    src={getImageUrl(item.rightImg)}
                                    alt="Right"
                                    className="img-fluid"
                                  />
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="modal-footer">
                            <button
                              type="button"
                              className="btn btn-secondary"
                              data-bs-dismiss="modal"
                            >
                              Close
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between">
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button
          className="btn btn-primary"
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default Table;
