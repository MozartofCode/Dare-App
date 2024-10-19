import React, { useState } from 'react';

const RegistrationPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleRegistration = () => {
        // Handle login logic here

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
                    console.log('Registered successful');
                } else {
                    console.log('Registration failed');
                }
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Login</h1>
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
            <button onClick={handleRegistration}>Register</button>
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
};

export default LoginPage;