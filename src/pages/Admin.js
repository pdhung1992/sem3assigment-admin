import '../assets/css/dashboard.css'
import React from 'react';
import {Avatar, Col, Layout, Menu, Row} from "antd";
import Sider from "antd/es/layout/Sider";
import {Content, Header} from "antd/es/layout/layout";
import {useState} from "react";
import {
    UserOutlined,
    LogoutOutlined
} from '@ant-design/icons';
import {useDispatch, useSelector} from "react-redux";
import {Link, Route, Routes, useNavigate} from "react-router-dom";
import empService from "../services/emp-service";
import {logout} from "../actions/authActions";
import ReceiveFromShipper from "../components/ReceiveFromShipper";
import ReceiveFromPostman from "../components/ReceiveFromPostman";
import ReceiveFromPostOffice from "../components/ReceiveFromPostOffice";
import DeliveryToConsignee from "../components/DeliveryToConsignee";
import AccountSetting from "../components/AccountSetting";
import AccountManagement from "../components/AccountManagement";
import BillManagement from "../components/BillManagement";
import Reports from "../components/Reports";
import PostOfficeManagement from "../components/PostOfficeManagement";
import CreateBill from "../components/CreateBill";
import DeliveryForTransport from "../components/DeliveryForTransport";
import ReceiveFromTransport from "../components/ReceiveFromTransport";
import {ResponsiveContainer} from "recharts";



const Admin = () => {

    const emp = useSelector(state => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [message, setMessage] = useState("");
    const permissions = emp.empData.permissions

    const menuItems = permissions.map((permission, index) => (
        {
            key: index,
            label: permission.name,
            link: `/${permission.prefix}`
        }
    ));


    const handleSignOut = async () => {
        try {
            await empService.logout();
            dispatch(logout());
            navigate('/login')
        }catch (error){
            const resMessage =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    }

    const accSetting = () => {
        navigate('/account-setting')
    }

    return(
        <Layout>
            <Sider
                width={"16%"}
                breakpoint="lg"
                collapsedWidth="0"
                onBreakpoint={(broken) => {
                    // console.log(broken);
                }}
                onCollapse={(collapsed, type) => {
                    // console.log(collapsed, type);
                }}
                style={{height: "100vh", backgroundColor: "#ffffff"}}
            >
                <div className="demo-logo-vertical" style={{textAlign: "center"}}>
                    <img
                        src='/img/full-logo.png'
                    />
                </div>
                <Menu defaultSelectedKeys={'0'} mode="inline">
                    {menuItems.map((item, index) => (
                        <Menu.Item key={index}>
                            <Link to={item.link}>{item.label}</Link>
                        </Menu.Item>
                    ))}
                </Menu>
            </Sider>
            <Layout>
                <Header>
                    <ResponsiveContainer>
                        <Row>
                            <Col md={6}>

                            </Col>
                            <Col md={18} style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' , paddingRight: "15px"}}>
                                <Avatar
                                    style={{ marginLeft: 8, cursor: "pointer" }}
                                    size="default"
                                    icon={<UserOutlined style={{  }}/>}
                                    onClick={accSetting}
                                >
                                </Avatar>
                                <span style={{color: '#ffffff',  padding: "0 0 0 10px", cursor: "pointer"}} onClick={accSetting}>Hello, {emp.empData.fullname}</span>
                                <Avatar
                                    style={{ marginLeft: 8, cursor: "pointer" }}
                                    size="default"
                                    icon={<LogoutOutlined />}
                                    onClick={handleSignOut}
                                >
                                </Avatar>
                                <button onClick={handleSignOut} style={{color: '#ffffff', backgroundColor: "#ee0033", border: "none", padding: "0 0 0 10px", top: "0",}}>Log Out</button>
                            </Col>
                        </Row>
                    </ResponsiveContainer>
                </Header>
                <Content>
                    <Routes>
                        <Route path={'rcv-from-shipper'} element={<ReceiveFromShipper/>}/>
                        <Route path={'rcv-from-postman'} element={<ReceiveFromPostman/>}/>
                        <Route path={'rcv-from-post-office'} element={<ReceiveFromPostOffice/>}/>
                        <Route path={'dlv-for-transport'} element={<DeliveryForTransport/>}/>
                        <Route path={'rcv-from-transport'} element={<ReceiveFromTransport/>}/>
                        <Route path={'dlv-to-cnee'} element={<DeliveryToConsignee/>}/>
                        <Route path={'account-setting'} element={<AccountSetting/>}/>
                        <Route path={'acc-management'} element={<AccountManagement/>}/>
                        <Route path={'bill-management'} element={<BillManagement/>}/>
                        <Route path={'report'} element={<Reports/>}/>
                        <Route path={'post-office-management'} element={<PostOfficeManagement/>}/>
                        <Route path={'create-bill'} element={<CreateBill/>}/>
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    )
}

export default Admin;