import {Card, Col, Input, Modal, Row, Space} from "antd";
import Meta from "antd/es/card/Meta";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import accountServices from "../services/account-service";
import Swal from "sweetalert2";


const AccountSetting = () => {

    const emp = useSelector(state => state.auth)
    const token = emp.empData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");

    const [openInfo, setOpenInfo] = useState(false);
    const [accountInfo, setAccountInfo] = useState({});

    useEffect(() => {
        const fetchInfo = async () => {
            const id = emp.empData.id;
            try {
                const data = await accountServices.accDetails(id, axiosConfig);
                setAccountInfo(data);
            }catch (e) {
                setMessage(e.message);
            }
        }
        fetchInfo();
    }, [])


    const showInfoModal = () => {
        setOpenInfo(true)
    }

    const closeInfo = () => {
        setOpenInfo(false)
    }

    const [openChange, setOpenChange] = useState(false);

    const showChangeModal = () => {
        setOpenChange(true)
    }
    const handleChangeCancel = () => {
        setOpenChange(false);
        setChangeData(initData);
    }

    const initData = {
        "currentPassword": "",
        "newPassword": "",
        "newPasswordCfm": ""
    };

    const [changeData, setChangeData] = useState(initData);

    const passwordMatch = changeData.newPassword === changeData.newPasswordCfm;

    const onChangeData = (e) => {
        const {name, value} = e.target;
        setChangeData(prevData => ({
            ...prevData, [name]: value
        }));
    }
    const handleChangePassword = (e) => {
        e.preventDefault();

        if(passwordMatch){
            const currentPassword = changeData.currentPassword;
            const newPassword = changeData.newPassword;
            const formData = {currentPassword , newPassword };
            const changePassword = async () => {
                try {
                    const res = await accountServices.changePassword(formData, axiosConfig);
                    console.log(res);
                    if(res && res.username){
                        setMessage("Password changed successfully!");
                        Swal.fire({
                            title: 'Password changed Successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#5ba515'
                        });
                        setChangeData(initData);
                        setOpenChange(false);
                    }
                }catch (e) {
                    setMessage(e.message);
                }
            }
            changePassword();
        }else {
            setMessage('New password is not match.');
            Swal.fire({
                title: 'New Password do not match!',
                icon: 'error',
                confirmButtonText: 'OK',
                confirmButtonColor: '#f27474'
            });
        }
    }

    return(
        <div className='db-content'>
            <h3>Account settings:</h3>
            <hr/>
            <Row>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            background:"#f1e4d3",
                            color: "#ee0033"
                        }}
                        onClick={() => {showInfoModal()}}
                    >
                        <Meta title={''} description={<img src="/img/info.png" className={'img-fluid'}/>}/>
                        <h5>Account informations</h5>
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        hoverable
                        style={{
                            margin: "5%",
                            textAlign: "center",
                            background: "#7fc6fe",
                            color: "#ffffff"
                        }}
                        onClick={() => {showChangeModal()}}
                    >
                        <Meta title={''} description={<img src="/img/changepwd.jpg" alt=""/>}/>
                        <h5>Change Password</h5>
                    </Card>
                </Col>
            </Row>
            <Modal
                open={openInfo}
                title="Account informations"
                onCancel={closeInfo}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={closeInfo}>
                            Close
                        </button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={8}>Username</Col>
                        <Col span={16}>{accountInfo.username}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>Full name</Col>
                        <Col span={16}>{accountInfo.fullname}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>Email</Col>
                        <Col span={16}>{accountInfo.email}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>Role</Col>
                        <Col span={16}>{accountInfo.role}</Col>
                    </Row>
                    <Row>
                        <Col span={8}>Branch</Col>
                        <Col span={16}>{accountInfo.postOffice}</Col>
                    </Row>
                </Space>
            </Modal>
            <Modal
                open={openChange}
                title="Change Password"
                onCancel={handleChangeCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleChangeCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleChangePassword}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Current Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Current Password...'
                                       value={changeData.currentPassword}
                                       type='password'
                                       name='currentPassword'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>New Password</Col>
                            <Col span={16}>
                                <Input placeholder='Enter New Password...'
                                       type='password'
                                       value={changeData.newPassword}
                                       name='newPassword'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Confirm new Password</Col>
                            <Col span={16}>
                                <Input placeholder='Confirm new Password...'
                                       type='password'
                                       value={changeData.newPasswordCfm}
                                       name='newPasswordCfm'
                                       onChange={onChangeData}
                                />
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountSetting;