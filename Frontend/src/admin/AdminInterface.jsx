import React, { useState, useEffect } from 'react';
import "../admin/admin.css"
import client from "../assets/client.png"
import appointment from "../assets/appointment.png"
import service from "../assets/service.png"
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { BarChart, Bar, ResponsiveContainer } from 'recharts';
import { color } from 'chart.js/helpers';
import man1 from "../assets/man1.png"
import man2 from "../assets/man2.png"
import man3 from "../assets/man3.png"
import woman1 from "../assets/woman1.png"
import woman2 from "../assets/woman2.png"
import woman3 from "../assets/woman3.png"
import woman4 from "../assets/woman4.png"
import woman5 from "../assets/woman5.png"
import woman6 from "../assets/woman6.png"
import staff from "../assets/employee.png"


const AdminInterface = () => {
    const [toggleState, setToggleState] = useState(1);
    const [customers, setCustomers] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [employee, setEmployee] = useState([]);
    const [services, setServices] = useState([]);
    const [error, setError] = useState(null);
    const [serviceData, setServiceData] = useState([]);
    const [lineChartData, setLineChartData] = useState([]);
    const [priceData, setPriceData] = useState([]);

    const employeeImages = [
        woman1,
        woman2,
        man3,
        man1,
        woman3,
        woman4,
        man2,
        woman5,
        woman6,
    ];

    const toggleTab = (index) => {
        setToggleState(index);
    }

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await fetch('http://localhost:8081/customers');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setCustomers(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchCustomers();
    }, []);

    useEffect(() => {
        const fetchEmployee = async () => {
            try {
                const response = await fetch('http://localhost:8081/employee');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setEmployee(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchEmployee();
    }, []);

    

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await fetch('http://localhost:8081/appointment');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setAppointments(data);
                countServices(data);
                prepareLineChartData(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchAppointments();
    }, []);

    useEffect(() => {
        const fetchServices = async () => {
            try {
                const response = await fetch('http://localhost:8081/service');
                if (!response.ok) throw new Error('Network response was not ok');
                const data = await response.json();
                setServices(data);
            } catch (error) {
                setError(error.message);
            }
        };

        fetchServices();
    }, []);

    const countServices = (data) => {
        const serviceCount = data.reduce((acc, appointment) => {
            acc[appointment.ServiceName] = (acc[appointment.ServiceName] || 0) + 1;
            return acc;
        }, {});

        const formattedData = Object.entries(serviceCount).map(([name, count]) => ({
            name,
            value: count,
        }));

        setServiceData(formattedData);
    };

    const prepareLineChartData = (data) => {
        const dateServiceCount = data.reduce((acc, appointment) => {
            const date = new Date(appointment.Date).toLocaleDateString();
            const serviceName = appointment.ServiceName;
            acc[date] = acc[date] || {};
            acc[date][serviceName] = (acc[date][serviceName] || 0) + 1;
            return acc;
        }, {});

        const formattedLineChartData = Object.entries(dateServiceCount).map(([date, services]) => ({
            date,
            ...services,
        }));

        setLineChartData(formattedLineChartData);
    };

    useEffect(() => {
        const fetchPriceData = async () => {
          try {
            const response = await fetch('http://localhost:8081/total-price-per-date');
            if (!response.ok) throw new Error('Failed to fetch');
            const data = await response.json();
            // Assuming `Date` comes in ISO format, converting to a more readable format:
            const formattedData = data.map((entry) => ({
              ...entry,
              Date: new Date(entry.Date).toLocaleDateString(), // Format the date
            }));
            setPriceData(formattedData);
          } catch (error) {
            console.error('Error fetching price data:', error);
          }
        };
    
        fetchPriceData();
      }, []);



    const totalCustomers = customers.length;
    const totalAppointments = appointments.length;
    const totalServices = services.length;
    const totalEmployee = employee.length;

    return (
        <div className='w-screen h-screen flex overflow-hidden'>
            <div className='w-[13%] h-full bg-white border p-2 flex flex-col'>
                <div className='w-full h-[10%] bg-gray-300'></div>

                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 1 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(1)}>Dashboard</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 2 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(2)}>Appointments</button>
                </div>
                <div className='w-full h-[5%] flex items-center justify-center font-semibold'>
                    <button className={toggleState === 3 ? "tabs active-tabs" : "tabs"} onClick={() => toggleTab(3)}>Clients</button>
                </div>
            </div>

            <div className='w-[87%] h-full bg-gray-100 overflow-y-scroll'>

                <div className={toggleState === 1 ? "content active-content" : "content"}>
                   
                   <div className='w-[100%] h-[100%] bg-gray-100 p-5 overflow-y-sroll'>
                       
                        <div className='w-[100%] h-[7%] bg-white rounded-lg pl-5 flex items-center mb-3 border'>
                            <h1 className='text-xl font-bold'>Overview</h1>
                        </div>

                    <div className='w-[100%] h-[24%] flex mb-3'>
                        
                        <div className='w-[65%] h-[100] flex flex-col justify-between'>
                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={client}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Clients</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalCustomers}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[80%] rounded-lg' src={appointment}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Appointments</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalAppointments}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                              </div>

                              <div className='w-[100%] h-[47%] flex'>
                                    <div className='w-[100%] h-[100%] flex items-center mb-3'>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border mr-3'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <img className='w-[70%] rounded-lg' src={service}></img>
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Services</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalServices}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className='w-[48.5%] h-[100%] bg-white rounded-lg flex border'>
                                                <div className='w-[25%] h-[100%] flex items-center justify-center'>
                                                    <div className='w-[70%] bg-violet-400 rounded-lg flex items-end'>
                                                        <img className='w-[100%] rounded-lg top-1 relative' src={staff}></img>
                                                    </div>   
                                                </div>
                                                <div className='w-[75%] h-[100%] flex flex-col items-center justify-center'>
                                                    <div className='w-[100%] h-[40%] bg-white flex items-end'>
                                                        <h1 className='text-lg font-semibold'>Employee</h1>
                                                    </div>
                                                    <div className='w-[100%] h-[40%] bg-blue flex items-start'>
                                                        <h1 className='text-2xl font-bold'>{totalEmployee}</h1>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                </div>    
                        </div>

                        <div className='pie rounded-lg z-40 border'>
                                <PieChart width={400} height={400}  style={{width: "100%", height: "100%", display: "flex", flexDirection: "row"}}>  
                                         <Pie
                                            data={serviceData}
                                            innerRadius={100}
                                            outerRadius={170}
                                            fill="#8884d8"
                                            paddingAngle={5}
                                            dataKey="value"
                                            cy={195}
                                        >
                                            {serviceData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={`#${Math.floor(Math.random()*16777215).toString(16)}`} />
                                            ))}
                                        </Pie>
                                        <Tooltip/> 
                                       <Legend wrapperStyle={{position: "static", right: 0, bottom: 0}}/>         
                                </PieChart>    
                                
                        </div>

                        </div>
                        
                        <div className='w-[100%] h-[40%] bg-white flex rounded-lg relative p-2 mb-3 border'>
                            <LineChart width={1300} height={360} style={{width: "97%", height: "100%"}}  data={lineChartData}>
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis dataKey="date"/><YAxis domain={[1, 'dataMax + 1']}/>
                                <Tooltip/>
                                <Legend align="center"  layout="horizontal" wrapperStyle={{ width: "100%", paddingLeft: "3%"}}/>
                                {services.map((service) => (
                                    <Line
                                        key={service.ServiceName}
                                        type="monotone"
                                        dataKey={service.ServiceName}
                                        stroke={`#${Math.floor(Math.random() * 16777215).toString(16)}`}
                                        activeDot={{ r: 8 }}
                                        strokeWidth={3}
                                    />
                                ))}        
                            </LineChart>
                        </div>
                        
                        <div className='w-[100%] h-[50%] pb-5 flex'>
                            <div className='w-[40%] h-[100%] bg-white rounded-lg p-5 overflow-y-scroll border'>
                                {employee.map((employee, index) => (
                                    <div className='w-[100%] h-[20%] bg-gray-100 mb-2 flex border rounded-lg'>
                                        <div className='w-[20%] h-[100%] bg-gray-100 p-2'>
                                            <div className='w-[100%] h-[100%] bg-white flex items-end justify-center relative rounded-lg'>
                                                <img className='w-[70%] relative' src={employeeImages[index % employeeImages.length]} alt={`Employee ${index + 1}`} />
                                            </div>  
                                        </div>
                                        <div className='w-[85%] h-[100%] flex flex-col items-centers justify-center'> 
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-xl font-bold text-gray-600' key={employee.EmployeeID}>{employee.EmpFName} {employee.EmpLName}</h1>
                                            </div>
                                            <div className='w-[100%] h-[30%] flex items-center'>
                                                <h1 className='text-lg text-gray-600' key={employee.EmployeeID}>{employee.Specialization}</h1>
                                            </div> 
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className='w-[60%] h-[100%] bg-white flex items-center justify-center pr-5 ml-3 rounded-lg border'>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={priceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="Date" />
                                <YAxis />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="TotalIncome" fill="#8884d8" />
                                </BarChart>
                            </ResponsiveContainer>
                            </div>
                        </div>

                        </div> 
                    </div>

                <div className={toggleState === 2 ? "content active-content" : "content"}>
                    <div className='w-[100%] h-[100%] bg-red-500 flex items-center justify-center'>
                        <h1>Appointment Content</h1>
                    </div> 
                </div>
                <div className={toggleState === 3 ? "content active-content" : "content"}>
                    <div className='w-[100%] h-[100%] bg-green-500 flex items-center justify-center'>
                        <h1>Client Content</h1>
                    </div> 
                </div>
            </div>
        </div>
    );
}

export default AdminInterface;
