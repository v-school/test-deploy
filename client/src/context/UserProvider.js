import React, { Component } from 'react'
import axios from 'axios'

const UserContext = React.createContext()

const userAxios = axios.create()
// Axios interceptor
userAxios.interceptors.request.use((config) => {
    const token = localStorage.getItem("token")
    config.headers.Authorization = `Bearer ${token}`
    return config
})


class UserProvider extends Component {
    constructor(){
        super()
        this.state = {
            user: JSON.parse(localStorage.getItem("user")) || {},
            token: localStorage.getItem("token") || "",
            todos: [],
            authErrMsg: ""
        }
    }

    signup = credentials => {
        axios.post("/auth/signup", credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                this.setState({ user, token, authErrMsg: "" })
            })
            .catch(err => this.handleAuthErr(err.response.data.errMsg))
    }

    login = credentials => {
        axios.post("/auth/login", credentials)
            .then(res => {
                const { user, token } = res.data
                localStorage.setItem("token", token)
                localStorage.setItem("user", JSON.stringify(user))
                this.setState({ user, token, authErrMsg: "" })
            })
            .catch(err => this.handleAuthErr(err.response.data.errMsg))
    }

    handleAuthErr = errMsg => {
        this.setState({authErrMsg: errMsg})
    }

    logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        this.setState({
            user: {},
            token: "",
            authErrMsg: ""
        })
    }

    getUserTodos = () => {
        userAxios.get("/api/todo")
            .then(res => {
                this.setState({
                    todos: res.data
                })
            })
            .catch(err => console.log(err))
    }

    addTodo = newTodo => {
        userAxios.post("/api/todo", newTodo)
            .then(res => {
                const savedTodo = res.data
                this.setState(prevState => ({ 
                    todos: [...prevState.todos, savedTodo] 
                }))
            })
            .catch(err => console.log(err))
    }

    render(){
        return (
            <UserContext.Provider
                value={{
                    ...this.state,
                    signup: this.signup,
                    login: this.login,
                    logout: this.logout,
                    getUserTodos: this.getUserTodos,
                    addTodo: this.addTodo
                }}>
                { this.props.children }
            </UserContext.Provider>
        )
    }
}

export default UserProvider


export const withUser = C => props => (
    <UserContext.Consumer>
        { value => <C {...value} {...props}/>}
    </UserContext.Consumer>
)