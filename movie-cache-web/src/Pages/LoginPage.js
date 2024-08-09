import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {getAuth, signInWithEmailAndPassword } from 'firebase/auth'


const LoginPage = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const logIn = async () => {
        try {
            await signInWithEmailAndPassword(getAuth(), email, password)
            navigate("/movies") //Once they login this is where they'll be sent
        } catch (e) {
            setError(e.message)
        }
    }

    return (
        <>
        <h1>Login</h1>

        {/* If there's an error, display it up here */}
        {error && <p className="error">{error}</p>} 

        <input
            placeholder="your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
        />

        <input 
            type="password"
            placeholder="your password"
            value={password}
            onChange={p => setPassword(p.target.value)}
        />

        <button onClick={logIn}>Log In</button>

        <Link to="/createAccount">Don't have an account? Create One Here</Link>
        </>
        
    )
}

export default LoginPage;