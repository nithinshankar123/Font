import React, { useState, useEffect } from "react";
import { Form, Input, message, Modal, Select, Table, DatePicker } from "antd";
import {
  UnorderedListOutlined,
  AreaChartOutlined,
  EditOutlined,
  DeleteOutlined,
  LineChartOutlined,
  BarChartOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "./../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
import Barchart from "../components/Charts/Barchart";
import StackGraph from "../components/Charts/StackGraph";
import AxiosInstance from "../components/AxiosInstance";
import LineChart from "../components/Charts/LineChart";
import { useCounter } from "../components/context/ContextAPI";
import dayjs from "dayjs";
const { RangePicker } = DatePicker;

const HomePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [showTypeForm, setShowTypeForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [allTransection, setAllTransection] = useState([]);
  // const [frequency, setFrequency] = useState("2024");
  const {
    frequency,
    setFrequency,
    selectedYear,
    setSelecteYear,
    selectedDate,
    setSelectedate,
    allPoints,
    setAllPoints,
    getPointsByYearAndTypes,
  } = useCounter();

  const [type, setType] = useState("all");
  const [viewData, setViewData] = useState("table");
  const [editable, setEditable] = useState(null);
  // const [showProfile, setShowProfile] = useState(false);
  const [prevData, setPrevData] = useState({
    points: 0,
    date: moment().format("YYYY-MM-DD"),
    type: "all",
    description: "",
  });

  //table data
  const columns = [
    {
      title: "Date",
      dataIndex: "date",
      sorter: (a, b) => new Date(b.date) - new Date(a.date),
      render: (text) => <span>{moment(text).format("DD MMM YYYY")}</span>,
    },
    {
      title: "Points",
      dataIndex: "points",
    },
    {
      title: "Field",
      dataIndex: ["types", "types"],
    },
    {
      title: "Description",
      dataIndex: "description",
    },
    // {
    //   title: "Types",
    //   dataIndex: "types.types",
    // },
    {
      title: "Actions",
      render: (text, record) => (
        <div>
          <EditOutlined
            onClick={() => {
              editButtonClick(record);
            }}
          />
          <DeleteOutlined
            className="mx-2"
            onClick={() => {
              handleDelete(record);
            }}
          />
        </div>
      ),
    },
  ];

  const editButtonClick = (record) => {
    setEditable(record);
    setMaxPoints(record?.types?.maxPoints);
    setShowModal(true);
    setInputPoints(record?.points);
  };

  const handleDelete = async (record) => {
    console.log(record);
    try {
      setLoading(true);
      await AxiosInstance.delete(`deletePoints/${record._id}`);
      setLoading(false);
      message.success("Deleted!");
      getPointsByYearAndTypes();
    } catch (error) {
      setLoading(false);
      console.log(error);
      message.error("unable to delete");
    }
  };

  const user = JSON.parse(localStorage.getItem("user"));
  // form handling adding points
  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      if (editable) {
        await AxiosInstance.put(`updatePoints/${user._id}/${editable._id}`, {
          ...values,
          points: inputPoints,
        });
        setLoading(false);
        setEditable(null);
        getPointsByYearAndTypes();
        message.success("Points Updated Successfully");
      } else {
        await AxiosInstance.post(`addpoints/${user._id}`, {
          ...values,
          points: inputPoints,
        });
        setLoading(false);
        setEditable(null);
        getPointsByYearAndTypes();
        message.success("Points Added Successfully");
      }
      setShowModal(false);
      setEditable(null);
      window.location.reload()
    } catch (error) {
      setLoading(false);
      message.error("Faild to add Points");
    }
  };

  const years = Array.from(
    { length: 5 },
    (_, index) => {
      const startYear = new Date().getFullYear() - index;
      const endYear = startYear + 1;
      return {
        label: `${startYear}-${endYear}`,
        value: `${startYear}-08-01 to ${endYear}-07-31`,
      };
    }
  );
  // const [showOtherOption, setShowOtherOption] = useState(false);
  // const [types, setTypes] = useState("");
  const [maxPoints, setMaxPoints] = useState(0); // State to hold the maximum points
  const [inputPoints, setInputPoints] = useState(editable?.points); // State to track the points entered
  const [inputError, setInputError] = useState(false); // State to track if input is invalid

  const handleTypeChange = (value) => {
    const selectedType = userTypes.find((item) => item._id === value);

    // Set the maximum points based on the selected type
    if (selectedType) {
      const typeMaxPoints = selectedType.maxPoints; // Assuming each type has a maxPoints field
      setMaxPoints(typeMaxPoints);
      setEditable({...editable,types: {...editable.types,_id:selectedType}});
      setInputPoints(0); // Reset points input when type changes
    }
  };

  const handlePointsChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setInputPoints(value);
     // Check if input exceeds the max points
    if (value > maxPoints) {
      setInputError(true);
    } else {
      setInputError(false);
    }
  };

  const typesOrCategory = [
    { value: "all", label: "All", maxPoints: 5 },
    { value: "Teaching", label: "Teaching", maxPoints: 5 },
    { value: "Workshops", label: "Workshops", maxPoints: 5 },
    { value: "Research", label: "Research", maxPoints: 5 },
    // {value: "income", label: "Income"},
    // {value: "expense", label: "Expense"},
  ];

  const handleTypeSubmit = async (values) => {
    try {
      await AxiosInstance.post(`addType/${user._id}`, {
        ...values,

        // transacationId: editable._id,
      });
      setLoading(false);
      setShowTypeForm(false);
      setShowModal(false);
      getallTypes();
      message.success("Type added Successfully");
    } catch (error) {
      message.error(error.response.data.message);
      console.log(error);
    }
  };
  // const user = JSON.parse(localStorage.getItem('user'))

  const handleDeleteType = async (id) => {
    try {
      const res = await AxiosInstance.delete(`deletetype/${id}`);
      getallTypes();
    } catch (error) {
      console.error(error);
    }
  };

  const { userTypes, getallTypes, selectedTypes, setSelectedTypes } = useCounter();

  useEffect(() => {
    getallTypes();
    // console.log(selectedDate);
  }, [showModal]);

  const disableDate = (current) => {
    return current && current >= dayjs().endOf("day");
  };

  // const [initialValueOfPoints,setInitialValueOfPoints]=useState({})
  const addPointClick = () => {
    // setInitialValueOfPoints(null)
    editButtonClick(null);
    setEditable(null);
    setMaxPoints(0);
    setInputPoints(0); // Reset input points
    setShowModal(true);
  };

  return (
    <Layout>
      {loading && <Spinner />}
      <div className="filters">
        <div>
          <h6>Select Academic Year</h6>
          <Select
  onChange={(value) => {
    if (value==='all') {
      setSelecteYear(null)
      setSelectedate(null)
    }else{
    setFrequency(value);
    const [start, end] = value?.split(" to "); // Split the value to extract start and end dates
    setSelectedate([moment(start, "YYYY-MM-DD"), moment(end, "YYYY-MM-DD")]); // Set selected date range using moment
 } }}
  style={{ width: 160 }} // Adjust width for proper display
>  <Select.Option value="all">ALL</Select.Option>
  {years.map((year) => (
    <Select.Option key={year.value} value={year.value}>
      {year.label}
    </Select.Option>
  ))}
</Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div>
          <h6>Select Field</h6>
          <Select
            // value={userTypes}
            onChange={(values) => {
              setSelectedTypes(values);
              setType(values);
            }}
            style={{ width: 120 }}
            mode="multiple"
          >
            <Select.Option value="all">ALL</Select.Option>
            {/* <Select.Option value="income">INCOME</Select.Option>
            <Select.Option value="expense">EXPENSE</Select.Option> <Select.Option value="Teaching"> Teaching</Select.Option>
            <Select.Option value="Workshops"> Workshops</Select.Option>
            <Select.Option value="Research"> Research</Select.Option>
            <Select.Option value="Other"> Other</Select.Option>*/}
            {userTypes &&
              userTypes.map((item) => (
                <Select.Option value={item.types}> {item.types}</Select.Option>
              ))}
          </Select>
          {frequency === "custom" && (
            <RangePicker
              value={selectedDate}
              onChange={(values) => setSelectedate(values)}
            />
          )}
        </div>
        <div className="switch-icons">
          <UnorderedListOutlined
            className={`mx-2 ${
              viewData === "table" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("table")}
          />
          <BarChartOutlined
            className={`mx-2 ${
              viewData === "bar" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("bar")}
          />
          <LineChartOutlined
            className={`mx-2 ${
              viewData === "line" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("line")}
          />
          {/* <AreaChartOutlined
            className={`mx-2 ${
              viewData === "multiLine" ? "active-icon" : "inactive-icon"
            }`}
            onClick={() => setViewData("multiLine")}
          /> */}
        </div>
        {/* <div>
          <button
            className="btn btn-secondary"
            onClick={() => setViewData("stack")}
          >
            Analytics
          </button>
        </div> */}
        <div>
          <button
            className="btn btn-primary"
            onClick={() => {
              addPointClick();
            }}
          >
            Add New
          </button>
        </div>
      </div>
      <div className="content">
        {
          viewData === "table" && (
            <Table
              columns={columns}
              dataSource={allPoints}
              pagination={{ pageSize: 7 }}
            />
          )
          // <Analytics allTransection={allTransection} />
        }
        {viewData === "bar" && <Barchart />}
        {viewData === "line" && <LineChart />}
        {viewData === "multiLine" && <StackGraph />}
      </div>
      <Modal
        title={editable ? "Edit Gained Points" : "Add Current Gained Points"}
        open={showModal}
        onCancel={() => {setShowModal(false)
          window.location.reload()
        }}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            types: editable ? editable.types._id : "", // Set initial value for types
            points: editable ? editable.points : 0, // Set initial value for points
            date: editable ? moment(editable.date) : null, // Set initial value for date
            description: editable ? editable.description : "", // Set initial value for description
          }}
        >
          {/* initialValues={editable} */}
          <Form.Item label="Field" name="types">
            <Select onChange={handleTypeChange}>
              {userTypes &&
                userTypes.map((item) => {
                  return (
                    <Select.Option value={item._id} key={item._id}>
                      <div className="d-flex justify-content-between align-items-center">
                        <span>{item.types}</span>
                        
                      </div>
                    </Select.Option>
                  );
                })}
            </Select>
          </Form.Item>
          {editable === null && (
          <button
            className="btn btn-primary"
            type="button"
            onClick={() => setShowTypeForm(true)}
          >
            Add Field
          </button>)}

          <Form.Item label={`Current Gained Points (Max: ${maxPoints})`} name="points">
            <Input
              type="number"
              value={inputPoints}
              onChange={handlePointsChange}
              style={{ borderColor: inputError ? "red" : "" }} // Change border color if input exceeds max
            />
            {inputError && (
              <span style={{ color: "red" }}>
                Points cannot exceed {maxPoints}.
              </span>
            )}
          </Form.Item>

          <Form.Item label="Date" name="date">
            <DatePicker
              disabledDate={disableDate} // Function to disable future dates
              format="YYYY-MM-DD" // Format of the displayed date
              placeholder="Select a date before today" // Placeholder text
            />
          </Form.Item>

          <Form.Item label="Description" name="description">
            <Input type="text" />
          </Form.Item>

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
      <Modal
        title={"Add Type"}
        open={showTypeForm}
        onCancel={() => setShowTypeForm(false)}
        footer={false}
      >
        <Form
          layout="vertical"
          onFinish={handleTypeSubmit}
          initialValues={editable}
        >
          <Form.Item
  label="Max Points"
  name="maxPoints"
  rules={[
    {
      required: true,
      message: 'Please enter a valid number!',
    },
    {
      pattern: /^[0-9]*$/,
      message: 'Only numbers are allowed!',
    },
  ]}
>
  <Input
    type="number"
    onInput={(e) => {
      // This ensures only numbers can be typed
      e.target.value = e.target.value.replace(/[^0-9]/g, '');
    }}
  />
</Form.Item>
          <Form.Item label="Type" name="types">
            <Input type="text" />
          </Form.Item>
          {/* { types==="Other"&& <Form.Item label="New Type" name="Type">
            <Input type="text" />
          </Form.Item>} */}

          <div className="d-flex justify-content-end">
            <button type="submit" className="btn btn-primary">
              {" "}
              SAVE
            </button>
          </div>
        </Form>
      </Modal>
    </Layout>
  );
};

export default HomePage;
