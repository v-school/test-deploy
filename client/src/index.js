import React from 'react'
import ReactDOM from 'react-dom'
import App from './App.js'
import UserProvider from './context/UserProvider.js'
import { BrowserRouter } from 'react-router-dom'

ReactDOM.render(
    <BrowserRouter>
        <UserProvider>
            <App/>
        </UserProvider>
    </BrowserRouter>, 
document.getElementById('root'))