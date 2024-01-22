import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import billService from "../services/bill-service";
import Swal from "sweetalert2";
import statusService from "../services/status-service";
import {Button, Card, Col, Row, Space} from "antd";
import Search from "antd/es/input/Search";
import moment from "moment";


const DeliveryToConsignee = () => {
    const emp = useSelector(state => state.auth)
    const token = emp.empData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [billDetails, setBillDetails] = useState({});
    const onSearch = async (value) => {
        const detail = await billService.getBillDetails(value, axiosConfig);
        setBillDetails(detail);
    }

    const [dlvBills, setDlvBills] = useState([]);
    const fetchDlvToCnee = async () => {
        const dlv = await billService.deliveryToCnee(axiosConfig);
        setDlvBills(dlv);
    }

    useEffect(() => {
        fetchDlvToCnee();
    }, [])

    const handleCreateStatus = async () => {
        const typeId = 7;
        const employeeId = emp.empData.id;
        const billId = billDetails.id;

        const formData = {typeId, employeeId, billId}

        try {
            const result = await Swal.fire({
                title: 'Are you sure?',
                text: 'Check the shipment carefully and make sure it no has any irregular!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#5ba515',
                cancelButtonColor: '#ee0033',
                confirmButtonText: 'Yes, delivery it!',
            });

            if (result.isConfirmed) {
                await statusService.createStatus(formData, axiosConfig);
                await Swal.fire({
                    title: 'Delivery Successfully!',
                    text: 'Shipment delivered!',
                    icon: 'success',
                    confirmButtonColor: '#5ba515',
                });
                fetchDlvToCnee();
                setBillDetails({});
            }
        } catch (error) {
            console.error(`Error delivering shipment.`, error);
            Swal.fire({
                title: 'Delivery error!',
                text: 'An error occurred while delivering shipment!',
                icon: 'error',
                confirmButtonColor: '#ee0033',
            });
        }
    }

    return(
        <div className='db-content'>
            <h3>Delivery shipments to Consignee:</h3>
            <hr/>
            <Row>
                <Col span={8} style={{padding: "0 1% 0 0"}}>
                    <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Find bill by number: '}>
                            <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                <Search
                                    placeholder="Enter bill number to delivery..."
                                    allowClear
                                    enterButton={
                                        <Button
                                            style={{backgroundColor: "#ee0033", color: "#fff", border: "#ee0033"}}
                                        >
                                            Get bill <i className="bi bi-chevron-double-right"></i>
                                        </Button>
                                    }
                                    size="large"
                                    onSearch={onSearch}
                                />
                            </Space>
                        </Card>
                        <Card headStyle={{background: "#dcdcdc"}} type={'inner'} title={'Bills waiting to delivery: '}>
                            <table className="table table-striped">
                                <tbody>
                                {dlvBills.length !== 0 ? (
                                    dlvBills.map((bill, index) => (
                                        <tr onClick={() => setBillDetails(bill)} key={index}>
                                            <td>{bill.billNumber}</td>
                                            <td>Receive at Post Office at {moment(bill.latestStatus.time).format('DD/MM/YYYY HH:mm:ss')}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <h5>No waiting bill!</h5>
                                )}
                                </tbody>
                            </table>
                        </Card>
                    </Space>
                </Col>
                <Col span={16} style={{padding: "0 0 0 1%"}}>
                    <Card headStyle={{background: "#dcdcdc"}}
                          type={'inner'}
                          title={'Shipment information: '}
                          style={{minHeight: "130px"}}
                    >
                        {Object.keys(billDetails).length !== 0 ? (
                            <div>
                                <Space direction="vertical" size="middle" style={{ display: 'flex' }}>
                                    <Row>
                                        <Col span={4}>
                                            <h6>Bill number </h6>
                                        </Col>
                                        <Col span={20}>
                                            <h6 style={{color: "#ee0033"}}>{billDetails.billNumber} </h6>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>From </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>
                                                {billDetails.shippingAddressDto.name}, {billDetails.shippingAddressDto.address}, {billDetails.shippingAddressDto.wardName}, {billDetails.shippingAddressDto.districtName}, {billDetails.shippingAddressDto.provinceName}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>To </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>
                                                {billDetails.deliveryAddressDto.name}, {billDetails.deliveryAddressDto.address}, {billDetails.deliveryAddressDto.wardName}, {billDetails.deliveryAddressDto.districtName}, {billDetails.deliveryAddressDto.provinceName}
                                            </p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>
                                                Commodity
                                            </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>{billDetails.billDetailsDto.name}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>
                                                Nature
                                            </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>{billDetails.billDetailsDto.nature}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>
                                                Weight
                                            </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>{billDetails.billDetailsDto.weight}</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>
                                                Dimension
                                            </h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>{billDetails.billDetailsDto.length} (cm) x {billDetails.billDetailsDto.width} (cm) x {billDetails.billDetailsDto.height} (cm)</p>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={4}>
                                            <h6>Note</h6>
                                        </Col>
                                        <Col span={20}>
                                            <p>{billDetails.note}</p>
                                        </Col>
                                    </Row>
                                    {billDetails.payer === 'consignee' ? (
                                        <div>
                                            <Row>
                                                <Col span={4}>
                                                    <h6>Collect Amount</h6>
                                                </Col>
                                                <Col span={20}>
                                                    <h6 style={{color: "#ee0033"}}>$ {billDetails.totalCharge + billDetails.cod}</h6>
                                                </Col>
                                            </Row>
                                        </div>
                                    ) : (
                                        <div>

                                        </div>
                                    )}
                                    <div className={"text-center"}>
                                        {billDetails.latestStatus.typeId === 5 && emp.empData.role === 'Staff' ? (
                                            <button className={"btn main-btn"} onClick={handleCreateStatus}>Delivery</button>
                                        ) : (
                                            emp.empData.role === 'Postman' && billDetails.latestStatus.typeId === 6 ? (
                                                <button className={"btn main-btn"} onClick={handleCreateStatus}>Delivery</button>
                                            ) : (
                                                <button className={"btn main-btn"} disabled style={{color: "#ee0033"}}>Shipment has been delivered</button>
                                            )
                                        )}
                                    </div>
                                </Space>
                            </div>
                        ) : (
                            <h5>No bill selected!</h5>
                        )}

                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default DeliveryToConsignee;