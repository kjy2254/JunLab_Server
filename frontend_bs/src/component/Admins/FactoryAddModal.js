import { faClose, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { default as React, useEffect, useState } from "react";
import Modal from "react-modal";

const customModalStyles = {
  overlay: {
    backgroundColor: " rgba(0, 0, 0, 0.7)",
    width: "100%",
    height: "100dvh",
    zIndex: "3",
    position: "fixed",
    top: "0",
    left: "0",
  },
};

function FactoryAddModal({ modalOpen, setModalOpen, fetchData }) {
  const [profileImg, setProfileImg] = useState();
  const [profileImgFile, setProfileImgFile] = useState();
  const [data, setData] = useState({});

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      setProfileImgFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImg(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClose = () => {
    setModalOpen(false);
    setData({});
    setProfileImg();
    setProfileImgFile();
  };

  const save = () => {
    const formData = new FormData();
    console.log(data);

    for (const key in data) {
      formData.append(key, data[key]);
    }

    if (profileImgFile) {
      formData.append("image", profileImgFile);
    }

    axios
      .post(`http://junlab.postech.ac.kr:880/api2/factory`, formData)
      .then(() => {
        alert("저장되었습니다.");
        fetchData();
        handleClose();
      })
      .catch((error) => {
        console.error("API 요청 실패:", error);
      });
  };

  useEffect(() => {
    if (modalOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [modalOpen]); // 모달 상태가 변경될 때마다 실행

  return (
    <Modal
      isOpen={modalOpen}
      style={customModalStyles}
      className="factory-modal layerModal"
      shouldCloseOnOverlayClick={false}
      appElement={document.getElementById("root")}
    >
      <div className="header">
        <div className="right">
          <FontAwesomeIcon icon={faClose} onClick={handleClose} />
        </div>
      </div>
      <div className="contents layer2">
        <div className="image-preview">
          <img
            src={
              profileImg ||
              `http://junlab.postech.ac.kr:880/api2/image/factory/default`
            }
          />
          <label>
            <span></span>
            <FontAwesomeIcon icon={faUpload} />
            Upload Image
            <input
              className="hidden"
              type="file"
              onChange={handleImageChange}
            />
          </label>
        </div>

        <label>
          Name
          <input
            type="text"
            value={data.name}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                name: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Industry
          <input
            type="text"
            value={data.industry}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                industry: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Manager
          <input
            type="text"
            value={data.manager}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                manager: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Contact
          <input
            type="text"
            value={data.contact}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                contact: e.target.value,
              }))
            }
          />
        </label>
        <label>
          Location
          <input
            type="text"
            value={data.location}
            onChange={(e) =>
              setData((prev) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />
        </label>
        <button onClick={save}>저장</button>
      </div>
    </Modal>
  );
}

export default FactoryAddModal;
