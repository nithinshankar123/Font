import { Card } from "antd";
import Meta from "antd/lib/card/Meta";
import React, { useState } from "react";
import Header from "../components/Layout/Header";
import { LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { base_url } from "../components/AxiosInstance";
import UpdateUser from "./UpdateUser";

const Profile = () => {
  const navigateTo = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'))
 const [showUpdate, setShowUpdate]=useState(false)
  return (
    <div>
     
      <Header /> <h5>
        <button className="btn" onClick={() => navigateTo(-1)}>
          {" "}
          <LeftOutlined /> Go back
        </button>
      </h5>
      {!showUpdate? <div className="">
     
      <h1 style={{ textAlign: "center" }}>Profile</h1>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <Card
          hoverable
          style={{ width: 240 }}
          cover={
            <img
              alt="example"
src={`http://localhost:5000/uploads/users/${user?.photo}`}
// onError={(e)=>e.target.src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"}
              // src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png"
            />
          }
        >
          {/* <Meta title="Europe Street beat" description="www.instagram.com" /> */}
          <p>{user?.name}</p> <p>{user?.email}</p> <p>{user?.facultyId}</p>
          <p><button className="btn btn-primary" onClick={()=>setShowUpdate(!showUpdate)}>update</button></p>
          {/* <p><button className="btn btn-warning">Change Password</button></p> */}
        </Card>
      </div>
      
      </div>:<UpdateUser user={user}/>}
    </div>
  );
};

export default Profile;
