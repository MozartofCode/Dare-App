import React, { useState } from 'react';

document.addEventListener('DOMContentLoaded', () => {
    const dareInput = document.getElementById('dareInput');
    const submitButton = document.getElementById('submitButton');
    const daresList = document.getElementById('daresList');

    submitButton.addEventListener('click', () => {
        const dareText = dareInput.value.trim();
        if (dareText) {
            const dareItem = document.createElement('li');
            dareItem.textContent = dareText;
            daresList.appendChild(dareItem);
            dareInput.value = '';
        }
    });
});
const Dashboard = () => {
    const [dareText, setDareText] = useState('');
    const [dares, setDares] = useState([]);

    const handleSubmit = () => {
        if (dareText.trim()) {
            setDares([...dares, dareText]);
            setDareText('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={dareText}
                onChange={(e) => setDareText(e.target.value)}
                id="dareInput"
            />
            <button onClick={handleSubmit} id="submitButton">Submit</button>
            <ul id="daresList">
                {dares.map((dare, index) => (
                    <li key={index}>{dare}</li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;