import React, { useState, useEffect } from "react";
import { Button, Form, Input, Upload, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Spinner from "../components/Spinner";
import "../styles/RegisterPage.css";
import { UploadOutlined } from "@ant-design/icons";
import AxiosInstance from "../components/AxiosInstance";
const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [photo,setPhoto]=useState();
  //from submit
  const submitHandler = async (values) => {
    const formdData= new FormData();
    formdData.append('name', values.name);
    formdData.append('email', values.email);
    formdData.append('password', values.password);
    formdData.append('photo', photo);
    formdData.append('designation', values.designation);
formdData.append("facultyId", values.facultyId)


    
    try {
      setLoading(true);
      await AxiosInstance.post("register", formdData);
      message.success("Registeration Successfull");
      setLoading(false);
      navigate("/login");
    } catch (error) {
      setLoading(false);
      message.error("something went wrong");
    }
  };

  //prevent for login user
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, [navigate]);
  const handleUpload = async (file) => {
    // Handle file upload logic here, e.g., send the file to a server
    console.log('Uploaded file:', file);
    setPhoto(file);
  
    // You might need to return a promise if you want to control upload progress
    return Promise.resolve();
  };
  return (
    <>
      <div className="register-page ">
        {loading && <Spinner />}
        <Form
          className="register-form"
          layout="vertical"
          onFinish={submitHandler}
        >
          <h2>Register Form</h2>
          <Form.Item label="Name" name="name">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="FacultyId" name="facultyId">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Designation" name="designation">
            <Input type="text" required />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input type="email" required />
          </Form.Item>
          <Form.Item label="Password" name="password">
            <Input type="password" required />
          </Form.Item>
          <Form.Item label="Photo" name="photo" rules={[{ required: true, message: 'Please upload your photo!' }]}>
    {/* <Upload 
      beforeUpload={() => false} 
      // showUploadList={false} 
      customRequest={handleUpload}
    >
      <Button >Upload Photo</Button>
    </Upload> */}
    <input type="file" onChange={(e)=>setPhoto(e.target.files[0])}/>
  </Form.Item>
          <div className="d-flex justify-content-between">
            <Link to="/login">Already Register? login here!</Link>
            <button className="btn ">Register</button>
          </div>
        </Form>
      </div>
    </>
  );
};

export default Register;
