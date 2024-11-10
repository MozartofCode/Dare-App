import React, { useEffect, useState } from 'react';
import axios from 'axios';

// Dashboard that shows the leadership (top 10 users)

const Dashboard = () => {
    const [leaders, setLeaders] = useState([]);

    useEffect(() => {
        const fetchTopScores = async () => {
            try {
                const response = await axios.get('http://localhost:3000/topScores');
                setLeaders(response.data);
            } catch (error) {
                console.error('Error fetching top scores:', error);
            }
        };

        fetchTopScores();
    }, []);

    return (
        <div>
            <h1>Top 10 Leaders</h1>
            <ul>
                {leaders.map((leader, index) => (
                    <li key={index}>
                        {leader.name}: {leader.score} points
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;