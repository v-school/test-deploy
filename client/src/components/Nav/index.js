import React from 'react'
import { Link } from 'react-router-dom'

const Nav = props => {
    const { logout, token } = props
    return (
        <nav>
            <button onClick={logout}>Logout</button> 
            <Link to="/profile">Profile</Link>
        </nav>
    )
}

export default Nav