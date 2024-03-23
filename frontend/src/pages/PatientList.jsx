import React, { useEffect, useState } from 'react'
import axios from 'axios';
import Spinner from '../components/Spinner';
import { Link } from 'react-router-dom';
import { AiOutlineEdit } from 'react-icons/ai';
import { BsInfoCircle } from 'react-icons/bs';
import { MdOutlineAddBox, MdOutlineDelete } from 'react-icons/md';

const PatientList = () => {
        const [patients, setPatients] = useState([]);
        const [loading, setLoading] = useState(false);
        useEffect(() => {
                setLoading(true);
                axios
                .get('http://localhost:3001/patients')
                .then((response) => {
                        setPatients(response.data.data);
                        setLoading(false);
                })
                .catch((error) => {
                        console.log(error);
                        setLoading(false);
                })
        })
        console.log("RAHHHHH");
        return (
        <div className='p-4'>
                <div className='flex justify-between items-center'>
                        <h1 className='text-3xl my-8'>My Patients</h1>
                        <Link to='/patients/createPatient'>
                                <MdOutlineAddBox className='text-sky-800 text-4xl' />
                        </Link>

                </div>
        {loading ? (
                <Spinner />
        ) : (
                <table className='w-full border-separate border-spacing-2'>
                        <thead>
                                <tr>
                                        <th className='border border-slate-600 rounded-md'>No</th>
                                        <th className='border border-slate-600 rounded-md'>Name</th>
                                </tr>
                        </thead>
                        <tbody>
                                {/* {patients.map((patient, index) => (
                                        <tr key={patients._id} className='h-8'>
                                                <td className='border border-slate-700 rounded-md text-center'>
                                                        {index+1}
                                                </td>
                                                <td className='border border-slate-700 rounded-md text-center'>
                                                        {patient.firstName}
                                                </td>
                                        </tr>
                                ))} */}
                        </tbody>
                </table>
        )}
        </div>
        )
}

export default PatientList