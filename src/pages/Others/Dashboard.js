import { useState, useEffect } from 'react';

const Dashboard = () => {
    const [role, setRole] = useState('');
    useEffect(() => {
        const userRole = JSON.parse(localStorage.getItem('userRole'));
        setRole(userRole);
    }, []);
    console.log(role);
    return <div>Dashboard page</div>;
};

export default Dashboard;
