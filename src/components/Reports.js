import {Card, Col, Row, Space, DatePicker, Select, Button, Empty} from "antd";
import {Cell, Legend, Pie, PieChart} from "recharts";
import {useEffect, useState} from "react";
import dayjs from "dayjs";
import reportServices from "../services/report-service";
import {useSelector} from "react-redux";
import * as XLSX from 'xlsx';



const Reports = () => {

    const emp = useSelector(state => state.auth)
    const token = emp.empData.token;

    const axiosConfig = {
        headers: {
            Authorization: "Bearer " + token,
        },
        credentials: "true"
    }

    const [totalIn, setTotalIn] = useState('');
    const [inFromShipper, setInFromShipper] = useState('');
    const [inFromPostman, setInFromPostman] = useState('');
    const [inFromTransport, setInFromTransport] = useState('');

    const inData = [
        { name: 'From Shipper', value: inFromShipper },
        { name: 'From Postman', value: inFromPostman },
        { name: 'From Transport', value: inFromTransport },
    ];

    const [totalOut, setTotalOut] = useState('');
    const [outToCnee, setOutToCnee] = useState('');
    const [outToTrans, setOutToTrans] = useState('');

    const outData = [
        { name: 'To Consignee', value: outToCnee },
        { name: 'For Transport', value: outToTrans },
        // { name: 'Inventory', value: inventory },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];
    const RADIAN = Math.PI / 180;
    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value, index }) => {
        const radius = 25 + innerRadius + (outerRadius - innerRadius);
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        if (value > 0){
            return (
                <text x={x} y={y} fill={COLORS[index % COLORS.length]} textAnchor="middle" dominantBaseline="central" style={{fontWeight: "700", fontSize: "20"}}>
                    {value}
                </text>
            );
        }
    };



    //select date
    const [reportType, setReportType] = useState(1);

    const handleChangeType = (value) => {
        setReportType(value);
        setReportTime(null)
    };
    const typeOptions = [
        {
            value: 1,
            label: 'Date'
        },
        {
            value: 2,
            label: 'Week'
        },
        {
            value: 3,
            label: 'Month'
        }
    ]

    const [reportTime, setReportTime] = useState(null);
    const onChangeTime = (date, dateString) => {
        setReportTime(date)
    };
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);


    const pickRange = (reportTime, reportType) => {
        const range = dayjs(reportTime);
        let start, end;

        switch (reportType) {
            case 1:
                start = range.startOf('day');
                end = range.endOf('day');
                break;
            case 2:
                start = range.startOf('week').add(1, 'day');
                end = range.endOf('week').add(1, 'day');
                break;
            case 3:
                start = range.startOf('month');
                end = range.endOf('month');
                break;
            default:
                break;
        }
        setStartDate(start.format('YYYY/MM/DD'));
        setEndDate(end.format('YYYY/MM/DD'));
    }

    const [inboundReports, setInboundReports] = useState();
    const [outboundReports, setOutboundReports] = useState();
    const [revenueReports, setRevenueReports] = useState([]);


    const fetchInbound = async () => {
        const report = await reportServices.inboundReport(startDate, endDate, axiosConfig);
        setInboundReports(report);
    }

    const fetchOutbound = async () => {
        const report = await reportServices.outboundReport(startDate, endDate, axiosConfig);
        setOutboundReports(report);
    }

    const fetchRevenue = async () => {
        const report = await reportServices.revenueReport(startDate, endDate, axiosConfig);
        setRevenueReports(report);
    }

    const [chargeByShipper, setChargeByShipper] = useState(0);
    const [chargeByCnee, setChargeByCnee] = useState(0);
    const [totalCharge, setTotalCharge] = useState(0);
    const [cod, setCod] = useState(0);
    const [totalCollect, setTotalCollect] = useState(0);


    const [insurance, setInsurance] = useState(0);
    const [payForShipper, setPayForShipper] = useState(0);
    const [totalTransfer, setTotalTransfer] = useState(0);

    const [totalRevenue, setTotalRevenue] = useState(0)


    const calChargeByShipper = () => {
        if (Array.isArray(revenueReports) && revenueReports.length > 0) {
            const charge = revenueReports.reduce((c, report) => {
                c = Math.round((c + report.collectFromShipper) * 100) / 100;
                return c;
            }, 0);
            setChargeByShipper(charge);
        }
    }

    const calChargeByCnee = () => {
        if (Array.isArray(revenueReports) && revenueReports.length > 0) {
            const charge = revenueReports.reduce((c, report) => {
                c = Math.round((c + report.chargeByCnee) * 100) / 100;
                return c;
            }, 0);
            setChargeByCnee(charge);
        }
    }


    const calCod = () => {
        if (Array.isArray(revenueReports) && revenueReports.length > 0) {
            const cod = revenueReports.reduce((c, report) => {
                c += report.cod;
                return c;
            }, 0);
            setCod(cod)
        }
    }

    const calcTotalCharge = () => {
        const ttl = Math.round((chargeByShipper + chargeByCnee) * 100) / 100;
        setTotalCharge(ttl)
    }

    const calcTotalCollect = () => {
        const ttl = Math.round((totalCharge + cod) * 100) / 100;
        setTotalCollect(ttl)
    }

    const calcInsurance = () => {
        if (Array.isArray(revenueReports) && revenueReports.length > 0) {
            const ins = revenueReports.reduce((i, report) => i + report.insFee, 0);
            const roundedIns = Math.round(ins * 100) / 100;
            setInsurance(roundedIns);
        }
    }

    const calcPayForShipper = () => {
        if (Array.isArray(revenueReports) && revenueReports.length > 0) {
            const pay = revenueReports.reduce((total, report) => total + report.payForShipper, 0);
            const roundedPay = Math.round(pay * 100) / 100;
            setPayForShipper(roundedPay);
        }
    }


    const calcTotalTransfer = () => {
        const ttl = Math.round((insurance + payForShipper) * 100) / 100;
        setTotalTransfer(ttl)
    }

    const calcTotalRevenue = () => {
        const ttl = Math.round((totalCollect - totalTransfer) * 100) / 100;
        setTotalRevenue(ttl)
    }

    const countInbound = () => {
        if(Array.isArray(inboundReports) && inboundReports.length > 0){
            const shipper = inboundReports.filter(i => i.rcvFrom === 'Shipper').length;
            const postman = inboundReports.filter(i => i.rcvFrom === 'Postman').length;
            const transport = inboundReports.filter(i => i.rcvFrom === 'Transport').length;
            setInFromShipper(shipper);
            setInFromPostman(postman);
            setInFromTransport(transport);
            setTotalIn(inboundReports.length)
        }
    }

    const countOutbound = () => {
        if (Array.isArray(outboundReports) && outboundReports.length > 0){
            const toCnee = outboundReports.filter(i => i.dlvTo === 'To Consignee').length;
            const forTrans = outboundReports.filter(i => i.dlvTo === 'For Transport').length;
            setOutToCnee(toCnee);
            setOutToTrans(forTrans);
            setTotalOut(outboundReports.length)
        }
    }

    useEffect(() => {
         pickRange(reportTime, reportType);
    }, [reportTime, reportType])

    useEffect(() => {
        if (startDate !== null && endDate !== null){
            fetchInbound();
            fetchOutbound();
            fetchRevenue();
        }
    }, [startDate, endDate])

    useEffect(() => {
        countInbound();
        countOutbound();
        calChargeByShipper();
        calChargeByCnee();
        calCod();
        calcTotalCharge();
        calcTotalCollect();
        calcInsurance();
        calcPayForShipper();
        calcTotalTransfer();
        calcTotalRevenue();
    },[inboundReports, outboundReports, revenueReports, totalCharge, cod, insurance, payForShipper, totalCollect, totalTransfer]);

    //export report
    const exportToExcel = (inbound, outbound) => {

        const inboundHeader = ['billNumber', 'rcvFrom', 'totalCharge', 'cod', 'payBy', 'collectFromShipper'];
        const filteredInbound = inbound.map(item => {
            return Object.fromEntries(Object.entries(item).filter(([key]) => inboundHeader.includes(key)));
        });
        const ws1 = XLSX.utils.json_to_sheet(filteredInbound);

        const outboundHeader = ['billNumber', 'dlvTo', 'totalCharge', 'cod', 'payBy', 'collectFromCnee'];
        const filteredOutbound = outbound.map(out => {
            return Object.fromEntries(Object.entries(out).filter(([key]) => outboundHeader.includes(key)));
        })
        const ws2 = XLSX.utils.json_to_sheet(filteredOutbound);

        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws1, 'Inbound-report');
        XLSX.utils.book_append_sheet(wb, ws2, 'Outbound-report');

        XLSX.writeFile(wb, `Report from ${startDate} to ${endDate}.xlsx`);
    }
    const inbound = inboundReports;
    const outbound = outboundReports;
    console.log(revenueReports)
    const handleExport = () => {
        exportToExcel(inbound, outbound);
    }

    return (
        <div className='db-content'>
            <h3>Reports:</h3>
            <hr/>
            <Space size={12}>
                <h6>Report by: </h6>
                <Select
                    defaultValue={1}
                    style={{
                        width: 120,
                    }}
                    onChange={handleChangeType}
                    options={typeOptions}
                />
                {reportType === 1 ? (
                    <DatePicker onChange={onChangeTime} value={reportTime} />
                ) : reportType === 2 ? (
                    <DatePicker onChange={onChangeTime} value={reportTime} picker="week" />
                ) : (
                    <DatePicker onChange={onChangeTime} value={reportTime} picker="month" />
                )}
            </Space>
            <hr/>
            {Array.isArray(inboundReports) || Array.isArray(outboundReports) ? (
                <div>
                    <h4>Bills report</h4>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Card bordered={true}
                                  hoverable
                                  style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                            >
                                <h4 className={"text-center"}>Total Inbound Bills: {totalIn}</h4>
                                {Array.isArray(inboundReports) && inboundReports.length > 0 ? (
                                    <PieChart
                                        width={400}
                                        height={400}
                                        // onMouseEnter={this.onPieEnter}
                                    >
                                        <Pie
                                            data={inData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={120}
                                            outerRadius={160}
                                            fill="#8884d8"
                                            paddingAngle={2}
                                            dataKey="value"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {inData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Legend/>
                                    </PieChart>
                                ) : (
                                    <h5 className={'text-center'}>No Data!</h5>
                                )}
                            </Card>
                        </Col>

                        <Col span={12}>
                            <Card bordered={true}
                                  hoverable
                                  style={{display: "flex", alignItems: "center", justifyContent: "center"}}
                            >
                                <h4 className={"text-center"}>Total Outbound Bills: {totalOut}</h4>
                                {Array.isArray(outboundReports) && outboundReports.length > 0 ? (
                                    <PieChart
                                        width={400}
                                        height={400}
                                        // onMouseEnter={this.onPieEnter}
                                    >
                                        <Pie
                                            data={outData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={120}
                                            outerRadius={160}
                                            fill="#8884d8"
                                            paddingAngle={2}
                                            dataKey="value"
                                            labelLine={false}
                                            label={renderCustomizedLabel}
                                        >
                                            {outData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]}/>
                                            ))}
                                        </Pie>
                                        <Legend/>
                                    </PieChart>
                                ) : (
                                    <h5 className={'text-center'}>No Data!</h5>
                                )}
                            </Card>
                        </Col>
                    </Row>
                    <hr/>
                    <h4>Revenue report</h4>
                    <Card
                        bordered={true}
                        hoverable
                    >
                        <Row gutter={16}>
                            <Col span={12}>
                                <Space direction={"vertical"} size={"middle"} style={{display: "flex"}}>
                                    <Row>
                                        <Col span={16}>Total charge collected:</Col>
                                        <Col span={8}>$ {totalCharge}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16} style={{paddingLeft: "10%"}}>By shipper:</Col>
                                        <Col span={8}>$ {chargeByShipper}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16} style={{paddingLeft: "10%"}}>By consignee</Col>
                                        <Col span={8}>$ {chargeByCnee}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16}>COD collected: </Col>
                                        <Col span={8}>$ {cod}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16}>Total collect amount:</Col>
                                        <Col span={8}>$ {totalCollect}</Col>
                                    </Row>
                                </Space>
                            </Col>
                            <Col span={12}>
                                <Space direction={"vertical"} size={"middle"} style={{display: "flex"}}>
                                    <Row>
                                        <Col span={16} style={{paddingLeft: "10%"}}>---</Col>
                                        <Col span={8}>---</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16} style={{paddingLeft: "10%"}}>---</Col>
                                        <Col span={8}>---</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16}>Insurance fee transfer:</Col>
                                        <Col span={8}>$ {insurance}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16}>Payment for shipper: </Col>
                                        <Col span={8}>$ {payForShipper}</Col>
                                    </Row>
                                    <Row>
                                        <Col span={16}>Total transfer amount:</Col>
                                        <Col span={8}>$ {totalTransfer}</Col>
                                    </Row>
                                </Space>
                            </Col>
                        </Row>
                        <hr/>
                        <Row>
                            <Col span={12}></Col>
                            <Col span={12}>
                                <h5>Total revenue: $ {totalRevenue}</h5>
                            </Col>
                        </Row>
                    </Card>
                    <hr/>
                    <h4>Export report: <button className={'btn main-btn'} style={{marginLeft: "10px"}} onClick={handleExport}>
                        <i className="bi bi-download" style={{marginRight: "10px"}}></i>
                        Export to Excel
                    </button></h4>
                </div>
            ) : (
                <div>
                    <h4 className={'text-center'}>Please select time range to view reports.</h4>
                    <Empty/>
                </div>
            )}
        </div>
    )
}

export default Reports;