import React, { useState } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSquarePlus } from "@fortawesome/free-solid-svg-icons";

const MyForm = () => {
  const [formData, setFormData] = useState({
    cusname: "",
    cusphone: "",
    coupon: "",
    notes: "",
    province: "",
    address: "",
    architect: "",
    architectPhone: "",
    contractor: "",
    contractorPhone: "",
    foreman: "",
    foremanPhone: "",
    buildingType: "",
    companyName: "",
    companyPhone: "",
    purchaserName: "",
    purchaserPhone: "",
    budget: "",
    completedSteps: [],
    uncompletedSteps: [],
    appointment: "",
    location: "",
    surveyDate: "",
    frontImg: null,
    leftImg: null,
    rightImg: null,
    backImg: null,
    interiorImg: [], // Initialize as an array
  });

  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: checked
          ? [...prevData[name], value]
          : prevData[name].filter((v) => v !== value),
      }));
    } else if (type === "select-multiple") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: Array.from(e.target.selectedOptions, (option) => option.value),
      }));
    } else if (type === "radio") {
      setFormData({
        ...formData,
        [name]: value,
      });
    } else if (type === "file") {
      if (name === "interiorImg") {
        // Handle multiple files for interiorImg
        setFormData({
          ...formData,
          [name]: Array.from(files), // Store files as an array
        });
      } else {
        setFormData({
          ...formData,
          [name]: files[0],
        });
      }
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setLoading(true); // Show spinner when fetching location

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prevData) => ({
          ...prevData,
          location: `${latitude}, ${longitude}`,
        }));
        setLoading(false); // Hide spinner after location is fetched
      },
      (error) => {
        let errorMessage = "";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage =
              "User denied the request for Geolocation. Please enable location access in your browser settings.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage =
              "Location information is unavailable. Make sure your device has location services enabled.";
            break;
          case error.TIMEOUT:
            errorMessage =
              "The request to get user location timed out. Please try again.";
            break;
          case error.UNKNOWN_ERROR:
            errorMessage =
              "An unknown error occurred. Please refresh the page and try again.";
            break;
          default:
            errorMessage =
              "Unable to retrieve your location. Please check your settings and try again.";
        }
        alert(errorMessage);
        setLoading(false); // Hide spinner if an error occurs
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "cusname",
      "cusphone",
      "province",
      "address",
      "architect",
      "contractor",
      "foreman",
      "buildingType",
      "companyName",
      "purchaserName",
      "budget",
      "appointment",
      "surveyDate",
    ];
    for (const field of requiredFields) {
      if (!formData[field]) {
        Swal.fire({
          title: "Error!",
          text: `${field} is required.`,
          icon: "error",
          confirmButtonText: "Okay",
        });
        return;
      }
    }

    try {
      setLoading(true); // Show spinner while submitting

      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "interiorImg" && Array.isArray(formData[key])) {
          // Append each file in the array
          formData[key].forEach((file) => formDataToSend.append(key, file));
        } else if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (Array.isArray(formData[key])) {
          formDataToSend.append(key, JSON.stringify(formData[key]));
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      await axios.post("https://d15c-171-5-45-166.ngrok-free.app/api/submit", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      Swal.fire({
        title: "Success!",
        text: "Your form has been submitted.",
        icon: "success",
        confirmButtonText: "Cool",
      }).then((result) => {
        if (result.isConfirmed) {
          // Reload the page
          window.location.reload();
        }
      });

      setShowModal(false);

      // Reset form data
      setFormData({
        cusname: "",
        cusphone: "",
        coupon: "",
        notes: "",
        province: "",
        address: "",
        architect: "",
        architectPhone: "",
        contractor: "",
        contractorPhone: "",
        foreman: "",
        foremanPhone: "",
        buildingType: "",
        companyName: "",
        companyPhone: "",
        purchaserName: "",
        purchaserPhone: "",
        budget: "",
        completedSteps: [],
        uncompletedSteps: [],
        appointment: "",
        location: "",
        surveyDate: "",
        frontImg: null,
        leftImg: null,
        rightImg: null,
        backImg: null,
        interiorImg: [], // Clear array after submission
      });

    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "There was an issue submitting your form.",
        icon: "error",
        confirmButtonText: "Okay",
      });
    }
  };

  return (
    <div className="container mt-5">
      <div className="text-end">
        <Button variant="danger" onClick={() => setShowModal(true)}>
          <FontAwesomeIcon icon={faSquarePlus} size="1x" />
        </Button>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>เพิ่มข้อมูล</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleSubmit}>
            <div className="row">
              {/* Name */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formName">
                  <Form.Label>ชื่อลูกค้า</Form.Label>
                  <Form.Control
                    type="text"
                    name="cusname"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formPhone">
                  <Form.Label>เบอร์โทรลูกค้า</Form.Label>
                  <Form.Control
                    type="text"
                    name="cusphone"
                    value={formData.phone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Coupon */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formCoupon">
                  <Form.Label>คูปอง</Form.Label>
                  <Form.Control
                    type="text"
                    name="coupon"
                    value={formData.coupon}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Notes */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formNotes">
                  <Form.Label>หมายเหตุ</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Province */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formProvince">
                  <Form.Label>จังหวัด</Form.Label>
                  <Form.Control
                    type="text"
                    name="province"
                    value={formData.province}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Address */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formAddress">
                  <Form.Label>บ้านเลขที่</Form.Label>
                  <Form.Control
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Architect */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formArchitect">
                  <Form.Label>ชื่อสถาปนิก</Form.Label>
                  <Form.Control
                    type="text"
                    name="architect"
                    value={formData.architect}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Architect Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formArchitectPhone">
                  <Form.Label>เบอ์โทรสถาปนิก</Form.Label>
                  <Form.Control
                    type="tel"
                    name="architectPhone"
                    value={formData.architectPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Contractor */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formContractor">
                  <Form.Label>ชื่อผู้รับเหมา</Form.Label>
                  <Form.Control
                    type="text"
                    name="contractor"
                    value={formData.contractor}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Contractor Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formContractorPhone">
                  <Form.Label>เบอร์โทรผู้รับเหมา</Form.Label>
                  <Form.Control
                    type="tel"
                    name="contractorPhone"
                    value={formData.contractorPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Foreman */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formForeman">
                  <Form.Label>ชื่อหัวหน้างาน</Form.Label>
                  <Form.Control
                    type="text"
                    name="foreman"
                    value={formData.foreman}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Foreman Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formForemanPhone">
                  <Form.Label>เบอร์โทรหัวหน้างาน</Form.Label>
                  <Form.Control
                    type="tel"
                    name="foremanPhone"
                    value={formData.foremanPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Building Type */}
              <div className="col-12 mb-3">
                <Form.Label>ประเภทอาคาร</Form.Label>
                <div>
                  {[
                    "อาคารที่อยู่อาศัย",
                    "ห้องแถว",
                    "ตึกแถว",
                    "บ้านแถว",
                    "บ้านแฝด",
                    "อาคารพาณิชย์",
                    "อาคารสาธารณะ",
                    "อาคารพิเศษ",
                    "อาคารอยู่อาศัยรวม",
                    "อาคารขนาดใหญ่",
                    "สํานักงาน",
                    "คลังสินค้า",
                    "โรงงาน",
                    "โรงมหรสพ",
                    "โรงแรม",
                    "ภัตตาคาร",
                  ].map((type) => (
                    <Form.Check
                      type="radio"
                      name="buildingType"
                      value={type}
                      checked={formData.buildingType === type}
                      onChange={handleChange}
                      label={type}
                      key={type}
                    />
                  ))}
                </div>
              </div>
              {/* Company Name */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formCompanyName">
                  <Form.Label>ชื่อบริษัท</Form.Label>
                  <Form.Control
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Company Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formCompanyPhone">
                  <Form.Label>เบอร์โทรศัพท์บริษัท</Form.Label>
                  <Form.Control
                    type="tel"
                    name="companyPhone"
                    value={formData.companyPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Purchaser Name */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formPurchaserName">
                  <Form.Label>ชื่อจัดซื้อบริษัท</Form.Label>
                  <Form.Control
                    type="text"
                    name="purchaserName"
                    value={formData.purchaserName}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Purchaser Phone */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formPurchaserPhone">
                  <Form.Label>เบอร์โทรจัดซื้อบริษัท</Form.Label>
                  <Form.Control
                    type="tel"
                    name="purchaserPhone"
                    value={formData.purchaserPhone}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Budget */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formBudget">
                  <Form.Label>งบประมาณ</Form.Label>
                  <Form.Control
                    type="text"
                    name="budget"
                    value={formData.budget}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-12 mb-3">
                <Form.Label>ขั้นตอนที่เสร็จแล้ว</Form.Label>
                <div className="step-container">
                  {[
                    "ห้องน้ำ",
                    "ห้องครัว",
                    "ห้องนอน",
                    "ห้องรับแขก",
                    "หลังคา",
                    "ฐานราก/เสา/คาน/พื้น",
                    "ฝ้า/เพดาน",
                    "งานก่อฉาบผนัง",
                    "วัสดุตกแต่ง",
                    "งานติดตั้งไฟฟ้า/ปะปา",
                    "ยังไม่เริ่ม",
                  ].map((step) => (
                    <div className="step-item" key={step}>
                      <Form.Check
                        type="checkbox"
                        name="completedSteps"
                        value={step}
                        checked={formData.completedSteps.includes(step)}
                        onChange={handleChange}
                        id={`step-${step}`} // Unique ID for each checkbox
                      />
                      <Form.Label
                        htmlFor={`step-${step}`}
                        className="step-label"
                      >
                        {step}
                      </Form.Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-12 mb-3">
                <Form.Label>ขั้นตอนที่กำลังดำเนินการ</Form.Label>
                <div className="step-container">
                  {[
                    "ห้องน้ำ",
                    "ห้องครัว",
                    "ห้องนอน",
                    "ห้องรับแขก",
                    "หลังคา",
                    "ฐานราก/เสา/คาน/พื้น",
                    "ฝ้า/เพดาน",
                    "งานก่อฉาบผนัง",
                    "วัสดุตกแต่ง",
                    "งานติดตั้งไฟฟ้า/ปะปา",
                    "ยังไม่เริ่ม",
                  ].map((step) => (
                    <div className="step-item" key={step}>
                      <Form.Check
                        type="checkbox"
                        name="uncompletedSteps"
                        value={step}
                        checked={formData.uncompletedSteps.includes(step)}
                        onChange={handleChange}
                        id={`uncompleted-step-${step}`} // Unique ID for each checkbox
                      />
                      <Form.Label
                        htmlFor={`uncompleted-step-${step}`}
                        className="step-label"
                      >
                        {step}
                      </Form.Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Appointment - ภาพด้านหน้า */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formFrontImg">
                  <Form.Label>รูปภาพด้านหน้า</Form.Label>
                  <Form.Control
                    type="file"
                    name="frontImg"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              {/* ภาพด้านซ้าย */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formLeftImg">
                  <Form.Label>รูปภาพด้านซ้าย</Form.Label>
                  <Form.Control
                    type="file"
                    name="leftImg"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              {/* ภาพด้านขวา */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formRightImg">
                  <Form.Label>รูปภาพด้านขวา</Form.Label>
                  <Form.Control
                    type="file"
                    name="rightImg"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              {/* ภาพด้านหลัง */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formBackImg">
                  <Form.Label>รูปภาพด้านหลัง</Form.Label>
                  <Form.Control
                    type="file"
                    name="backImg"
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>

              {/* ภาพภายใน */}
              <div className="col-12 mb-3">
                <Form.Group>
                  <Form.Label>Interior Images</Form.Label>
                  <Form.Control
                    type="file"
                    name="interiorImg"
                    multiple
                    onChange={handleChange}
                    accept="image/*"
                  />
                </Form.Group>
              </div>

              {/* Appointment */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formAppointment">
                  <Form.Label>นัดหมาย</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    name="appointment"
                    value={formData.appointment}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              {/* Location */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formLocation">
                  <Form.Label>โลเคชั่น</Form.Label>
                  <Form.Control
                    type="text"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    readOnly
                  />
                </Form.Group>
                <br />
                <Button
                  variant="danger"
                  onClick={getLocation}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Spinner animation="border" size="sm" /> Getting Current...
                    </>
                  ) : (
                    "Get Current Location"
                  )}
                </Button>
                <br />
                {/* Link to view location on Google Maps */}
                {formData.location && (
                  <a
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      formData.location
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="primary" className="mt-3">
                      View on Google Maps
                    </Button>
                  </a>
                )}
              </div>

              {/* Survey Date */}
              <div className="col-12 mb-3">
                <Form.Group controlId="formSurveyDate">
                  <Form.Label>วันที่สำรวจ</Form.Label>
                  <Form.Control
                    type="date"
                    name="surveyDate"
                    value={formData.surveyDate}
                    onChange={handleChange}
                  />
                </Form.Group>
              </div>
              <div className="col-12 mb-3 text-center">
                <Button variant="primary" type="submit">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default MyForm;
