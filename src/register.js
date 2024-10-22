import React, { useState } from 'react';

const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleRegistration = () => {
        if (!email || !password) {
            setError('Email and password are required');
            return;
        }

        fetch('http://localhost:3000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    console.log('Registered successfully');
                } else {
                    console.log(data.message);
                    console.log('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Register</h1>
            {error && <p style={styles.error}>{error}</p>}
            <input
                style={styles.input}
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                style={styles.input}
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleRegistration} disabled={!email || !password}>Register</button>
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        padding: '16px',
    },
    title: {
        fontSize: '24px',
        marginBottom: '16px',
        textAlign: 'center',
    },
    input: {
        height: '40px',
        borderColor: 'gray',
        borderWidth: '1px',
        marginBottom: '12px',
        paddingHorizontal: '8px',
        width: '100%',
        maxWidth: '300px',
    },
    error: {
        color: 'red',
        marginBottom: '12px',
    },
};

export default RegistrationPage;