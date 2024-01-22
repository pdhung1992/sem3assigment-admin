import {useSelector} from "react-redux";
import moment from "moment";
import {Button, Col, DatePicker, Row, Space, Table} from "antd";
import {useEffect, useState} from "react";
import billService from "../services/bill-service";
import Search from "antd/es/input/Search";
import {Link} from "react-router-dom";
import {PlusOutlined} from "@ant-design/icons";
import {findAllByDisplayValue} from "@testing-library/react";


const BillManagement = () => {
    const emp = useSelector(state => state.auth)
    const token = emp.empData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const columns = [
        {
            title: 'Bill Number',
            dataIndex: 'billNumber',
            width: "10%",
        },
        {
            title: 'Nature of goods',
            dataIndex: 'name',
            width: "15%",
        },
        {
            title: 'Consignee',
            dataIndex: 'deliveryAddressDto',
            width: "30%",
            render: (deliveryAddressDto) => (
                <div>
                    <p>{deliveryAddressDto.name}, {deliveryAddressDto.telephone}, {deliveryAddressDto.address}, {deliveryAddressDto.wardName}, {deliveryAddressDto.districtName}, {deliveryAddressDto.provinceName}</p>
                </div>
            )
        },
        {
            title: 'Date created',
            dataIndex: 'dateCreated',
            width: "15%",
            render: (text, record) => (
                <span>{moment(record.dateCreated).format('DD/MM/YYYY HH:MM:ss')}</span>
            ),
        },
        {
            title:'Latest status',
            dataIndex: 'latestStatus',
            width: "20%",
            render: (latestStatus) => (
                <div>
                    <p>{latestStatus?.name}</p>
                </div>
            )
        },
        {
            title: 'Actions',
            render: (_text, record) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => handleDetails(record.id)}>Details</Button>
                    {/*<Button onClick={() => handleEdit(record.id)}>Edit</Button>*/}
                    {/*<Button danger onClick={() => handleDelete(record.id)}>Delete</Button>*/}
                </Space>
            ),
            width: "10%",
        }
    ];

    const handleDetails = (id) => {
        // Handle Details action
        console.log(`Details action for ID ${id}`);
    };

    const handleEdit = (id) => {
        // Handle Edit action
        console.log(`Edit action for ID ${id}`);
    };

    const handleDelete = (id) => {
        // Handle Delete action
        console.log(`Delete action for ID ${id}`);
    };

    const onSearchBill = () => {

    }

    const { RangePicker } = DatePicker;

    const [bills, setBills] = useState([]);
    console.log(bills);
    const data = bills;
    useEffect(() => {
        const fetchBills = async () => {
            const data = await billService.getBills(axiosConfig);
            setBills(data);
        };
        fetchBills();
    }, []);

    return(
        <div className={'db-content'}>
            <h3>Bill management:</h3>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Search
                        placeholder="Enter bill number, telephone number..."
                        allowClear
                        enterButton="Search Bill"
                        onSearch={onSearchBill}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>
                    <RangePicker />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'end' }}>

                </Col>
            </Row>
            <hr/>
            <Table
                columns={columns}
                dataSource={data}
                rowKey={(record, index) => index}
                pagination={{
                    pageSize: 15,
                }}
                scroll={{
                    y: 600,
                }}
            />
        </div>
    )
}

export default BillManagement;