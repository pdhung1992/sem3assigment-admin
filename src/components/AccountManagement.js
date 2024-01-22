import '../assets/css/dashboard.css'

import {Button, Col, Input, Modal, Row, Select, Space, Table} from "antd";
import Search from "antd/es/input/Search";
import {PlusOutlined} from "@ant-design/icons";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import accountServices from "../services/account-service";
import Swal from "sweetalert2";
import addressService from "../services/address-service";
import {useNavigate} from "react-router-dom";


const AccountManagement = () => {

    const navigate = useNavigate();

    const emp = useSelector(state => state.auth)
    const token = emp.empData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }
    const [message, setMessage] = useState("");

    const columns = [
        {
            title: 'Username',
            dataIndex: 'username',
            width: "10%",
        },
        {
            title: 'Full Name',
            dataIndex: 'fullname',
            width: "15%",
        },
        {
            title: 'Email',
            dataIndex: 'email',
            width: "25%",
        },
        {
            title: 'Role',
            dataIndex: 'role',
            width: "10%",

        },
        {
            title:'Branch',
            dataIndex: 'postOffice',
            width: "20%",
        },
        {
            title: 'Actions',
            render: (_text, record) => (
                <Space style={{ justifyContent: 'center' }}>
                    <Button type="primary" onClick={() => showDetailModal(record.id)}>Details</Button>
                    <Button onClick={() => showEditModal(record.id)}>Edit</Button>
                    <Button danger onClick={() => handleDelete(record.id)}>Delete</Button>
                </Space>
            ),
            width: "20%",
        }
    ];

    const [accounts, setAccounts] = useState([]);

    const data = accounts;

    const [accDetails, setAccDetails] = useState({});

    const fetchAccounts = async () => {
        const accData = await accountServices.getAllAccounts(axiosConfig);
        setAccounts(accData);
    }

    useEffect(() => {
        fetchAccounts();
    }, [])
    const onSearchAcc = () => {

    }

    const handleDelete = async (id) => {
        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Account will be removed from your account list!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delete it!',
            });

            if (result.isConfirmed) {
                await accountServices.deleteAccount(id, axiosConfig);
                setAccounts(accounts.filter((deletedAcc) => deletedAcc.id !== id));
                await Swal.fire({
                    title: 'Delete Successfully!',
                    text: 'Account removed from your account list!',
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
            }
        } catch (error) {
            console.error(`Error deleting account with ID ${id}:`, error);
            Swal.fire({
                title: 'Delete error!',
                text: 'An error occurred while deleting account!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    };

    const [openCreate, setOpenCreate] = useState(false);
    const [openDetail, setOpenDetail] = useState(false);
    const [openEdit, setOpenEdit] = useState(false);

    //create
    const showCreateModal = () => {
        setOpenCreate(true);
    };

    const initAcc = {
        "fullname": '',
        "username": '',
        "email": '',
        "password": '',
        "passwordCfm": '',
        "roleId": 0,
        "postOfficeId": 0
    };
    const [newAcc, setNewAcc] = useState(initAcc);

    const onChangeNewAcc = (e) => {
        const {name, value} = e.target;
        setNewAcc(prevAcc => ({
            ...prevAcc, [name]: value
        }));
    }

    const isPasswordMatch = newAcc.password === newAcc.passwordCfm;

    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState('');

    useEffect(() => {
        const fetchRoles = async () => {
            const data = await accountServices.getRoles(axiosConfig);
            setRoles(data);
        };
        fetchRoles();
    }, []);

    const handleRoleChange = (selectedId) => {
        setSelectedRole(selectedId);
    }

    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [selectedProvince, setSelectedProvince] = useState('');
    const [selectedDistrict, setSelectedDistrict] = useState('');
    const [branchs, setBranchs] = useState([]);
    const [selectedBranch, setSelectedBranch] = useState('');

    useEffect(() => {
        if (accDetails) {
            setSelectedProvince(accDetails.provinceId || '');
            setSelectedDistrict(accDetails.districtId || '');
            setSelectedBranch(accDetails.postOfficeId || '');
        }
    }, [accDetails]);

    useEffect(() => {
        const fetchProvince = async () => {
            const data = await addressService.getProvinces();
            setProvinces(data);
        };
        fetchProvince();
    }, [])

    const handleProvinceChange = async (selectedId) => {
        setSelectedProvince(selectedId);
        setSelectedDistrict('');
        setSelectedBranch('');
        const data = await addressService.getDistByProvince(selectedId);
        setDistricts(data);
        setBranchs([]);
    }


    useEffect(() => {
        const fetchDistricts = async () => {
            if (selectedProvince) {
                setDistricts([]);
                const data = await addressService.getDistByProvince(selectedProvince);
                setDistricts(data);
            }
        };

        fetchDistricts();
    }, [selectedProvince]);


    const handleDistChange = async (selectedId) => {
        setSelectedDistrict(selectedId);
        const data = await addressService.getPOByDist(selectedId);
        setBranchs(data);
        setSelectedBranch('');
    };

    useEffect(() => {
        const fetchBranchs = async () => {
            if (selectedDistrict) {
                const data = await addressService.getPOByDist(selectedDistrict);
                setBranchs(data);
            }
        };
        fetchBranchs();
    }, [selectedDistrict]);

    const handleBranchChange = (selectedId) => {
        setSelectedBranch(selectedId);
    }
    const handleCreateSubmit = (e) => {
        e.preventDefault();

        if (isPasswordMatch){
            const username = newAcc.username;
            const fullname = newAcc.fullname;
            const email = newAcc.email;
            const password = newAcc.password;
            const roleId = selectedRole;
            const postOfficeId = selectedBranch;
            const formData = {fullname, username, email, password, roleId, postOfficeId};

            const fetchNewAcc = async () => {
                try {
                    const res = await accountServices.createAccount(formData, axiosConfig);
                    if(res && res.username){
                        setMessage("Account created successfully!");
                        Swal.fire({
                            title: 'Account created Successfully!',
                            icon: 'success',
                            confirmButtonText: 'OK',
                            confirmButtonColor: '#5ba515'
                        });
                        setOpenCreate(false);
                        fetchAccounts();
                        navigate('/acc-management');
                    }
                } catch (error) {
                    console.error(error);
                }
            };
            fetchNewAcc();
        }
        else {
            setMessage("Password do not match!")
        }
    }

    const handleCreateCancel = () => {
        setOpenCreate(false);
        setNewAcc(initAcc);
        setSelectedRole('');
        setSelectedProvince('');
        setSelectedBranch('');
        setSelectedDistrict('');
    };

    //get details
    const showDetailModal = async (id) => {
        const detail = await accountServices.accDetails(id, axiosConfig);
        setAccDetails(detail);
        setOpenDetail(true);
    };
    const handleDetailCancel = () => {
        setOpenDetail(false);
    };

    //edit acc
    const showEditModal = async (id) => {
        const detail = await accountServices.accDetails(id, axiosConfig);
        setAccDetails(detail);
        setSelectedProvince(accDetails.provinceId);
        setSelectedDistrict(accDetails.districtId);
        setSelectedBranch(accDetails.postOfficeId);
        setOpenEdit(true);
    };
    console.log(selectedProvince);

    const onChangeEdit = (e) => {
        const {name, value} = e.target;
        setAccDetails(prevAdd => ({
            ...prevAdd, [name] : value
        }));
    }
    const handleEditSubmit = (e) => {
        e.preventDefault();

        const id = accDetails.id;
        const username = '';
        const password = '';
        const fullname = accDetails.fullname;
        const email = accDetails.email;
        const roleId = selectedRole !== '' ? selectedRole : accDetails.roleId;
        const postOfficeId = selectedBranch !== '' ? selectedBranch : accDetails.postOfficeId;

        const formData = {fullname, email, roleId, postOfficeId, username, password};
        const fetchUpdateAcc = async () => {
            try {
                const res = await accountServices.updateAcc(id, formData, axiosConfig);
                if(res && res.fullname){
                    setMessage("Account updated successfully!");
                    Swal.fire({
                        title: 'Account updated Successfully!',
                        icon: 'success',
                        confirmButtonText: 'OK',
                        confirmButtonColor: '#5ba515'
                    });
                    fetchAccounts();
                    setOpenEdit(false)
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchUpdateAcc();
    };
    const handleEditCancel = () => {
        setOpenEdit(false);
    };



    return(
        <div className={'db-content'}>
            <h3>Accounts management:</h3>
            <hr/>
            <Row gutter={[16, 16]} justify="center">
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8}>
                    <Search
                        placeholder="Enter Username, Full name..."
                        allowClear
                        enterButton="Search Account"
                        onSearch={onSearchAcc}
                    />
                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'center' }}>

                </Col>
                <Col xs={24} sm={24} md={24} lg={8} xl={8} xxl={8} style={{ textAlign: 'end' }}>
                    <button className={'btn main-btn'} onClick={showCreateModal}>
                        <PlusOutlined /> Create new Account
                    </button>
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

            <Modal
                open={openCreate}
                title="Create new Account"
                onCancel={handleCreateCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleCreateCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleCreateSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Username</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Username...'
                                       name='username'
                                       value={newAcc.username}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Full name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Full name...'
                                       name='fullname'
                                       value={newAcc.fullname}
                                       onChange={onChangeNewAcc}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Email</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter Email...'
                                           type="email"
                                           name='email'
                                           onChange={onChangeNewAcc}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Password</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter Password...'
                                           type="password"
                                           name='password'
                                           onChange={onChangeNewAcc}
                                    />

                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Confirm password</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Re-enter Password...'
                                           type='password'
                                           name='passwordCfm'
                                           onChange={onChangeNewAcc}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Role</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Select
                                        value={selectedRole}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select role',
                                                    key: 'select-role'
                                                },
                                                ...roles.map(role => (
                                                    {
                                                        value: role.id,
                                                        label: role.name,
                                                        key: `role-${role.id}`
                                                    }
                                                ))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleRoleChange(selectedValue)}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                        <Col span={8}>Branch</Col>
                        <Col span={16}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Select
                                    value={selectedProvince}
                                    style={{width: "100%"}}
                                    options={
                                        [
                                            {
                                                value: '',
                                                label: 'Select province'
                                            },
                                            ...provinces.map(province => (
                                                {
                                                    value: province.id,
                                                    label: province.name
                                                }
                                            ))
                                        ]
                                    }
                                    onChange={(selectedValue) => handleProvinceChange(selectedValue)}
                                />
                                {Array.isArray(districts) ? (
                                    <Select
                                        value={selectedDistrict}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select District'
                                                },

                                                ...districts.map(dist => ({
                                                    value: dist.id,
                                                    label: dist.name
                                                }))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleDistChange(selectedValue)}
                                    />
                                ) : (
                                    <p>No district data</p>
                                )}
                                {Array.isArray(branchs) ? (
                                    <Select
                                        value={selectedBranch}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select Branch'
                                                },
                                                ...branchs.map(br => ({
                                                    value: br.id,
                                                    label: br.postName
                                                }))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleBranchChange(selectedValue)}
                                    />
                                ) : (
                                    <p>No ward data</p>
                                )}

                            </Space>
                        </Col>
                    </Row>
                    </Space>
                </form>
            </Modal>
            <Modal
                open={openDetail}
                title="Account Details"
                onCancel={handleDetailCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleDetailCancel}>
                            Cancel
                        </button>,
                        <button className={"btn btn-warning"} onClick={() => {
                            showEditModal(accDetails.id);
                            handleDetailCancel();
                        }}>Edit</button>
                    </Space>
                ]}
            >
                <hr/>
                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                    <Row>
                        <Col span={6}>Username</Col>
                        <Col span={18}>{accDetails.username}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Full name</Col>
                        <Col span={18}>{accDetails.fullname}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Email</Col>
                        <Col span={18}>{accDetails.email}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Role</Col>
                        <Col span={18}>{accDetails.role}</Col>
                    </Row>
                    <Row>
                        <Col span={6}>Branch</Col>
                        <Col span={18}>{accDetails.postOffice}</Col>
                    </Row>
                </Space>
            </Modal>
            <Modal
                open={openEdit}
                title="Edit Account"
                onCancel={handleEditCancel}
                footer={[
                    <Space>
                        <button key="back" className={'btn btn-primary'} onClick={handleEditCancel}>
                            Cancel
                        </button>,
                        <button className={'btn main-btn'} type={"submit"} onClick={handleEditSubmit}>
                            Submit
                        </button>,
                    </Space>
                ]}
            >
                <hr/>
                <form>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Row>
                            <Col span={8}>Username</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Username...'
                                       name='username'
                                       value={accDetails.username}
                                       disabled
                                       style={{color: "#000000"}}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Full name</Col>
                            <Col span={16}>
                                <Input placeholder='Enter Full name...'
                                       name='fullname'
                                       value={accDetails.fullname}
                                       onChange={onChangeEdit}
                                />
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Email</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Input placeholder='Enter Email...'
                                           type="email"
                                           name='email'
                                           value={accDetails.email}
                                           onChange={onChangeEdit}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Role</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Select
                                        defaultValue={accDetails.roleId}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select role',
                                                    key: 'select-role'
                                                },
                                                ...roles.map(role => (
                                                    {
                                                        value: role.id,
                                                        label: role.name,
                                                        key: `role-${role.id}`
                                                    }
                                                ))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleRoleChange(selectedValue)}
                                    />
                                </Space>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={8}>Branch</Col>
                            <Col span={16}>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Select
                                        value={selectedProvince}
                                        style={{width: "100%"}}
                                        options={
                                            [
                                                {
                                                    value: '',
                                                    label: 'Select province'
                                                },
                                                ...provinces.map(province => (
                                                    {
                                                        value: province.id,
                                                        label: province.name
                                                    }
                                                ))
                                            ]
                                        }
                                        onChange={(selectedValue) => handleProvinceChange(selectedValue)}
                                    />
                                    {Array.isArray(districts) ? (
                                        <Select
                                            value={selectedDistrict}
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select District'
                                                    },

                                                    ...districts.map(dist => ({
                                                        value: dist.id,
                                                        label: dist.name
                                                    }))
                                                ]
                                            }
                                            onChange={(selectedValue) => handleDistChange(selectedValue)}
                                        />
                                    ) : (
                                        <p>No district data</p>
                                    )}
                                    {Array.isArray(branchs) ? (
                                        <Select
                                            value={selectedBranch}
                                            name="postOfficeId"
                                            style={{width: "100%"}}
                                            options={
                                                [
                                                    {
                                                        value: '',
                                                        label: 'Select Branch'
                                                    },
                                                    ...branchs.map(br => ({
                                                        value: br.id,
                                                        label: br.postName
                                                    }))
                                                ]
                                            }
                                            onChange={(selectedValue) => handleBranchChange(selectedValue)}
                                        />
                                    ) : (
                                        <p>No ward data</p>
                                    )}

                                </Space>
                            </Col>
                        </Row>
                    </Space>
                </form>
            </Modal>
        </div>
    )
}

export default AccountManagement;