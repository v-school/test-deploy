import React, { Component } from 'react'
import Auth from './components/Auth'
import Nav from './components/Nav'
import TodoList from './components/TodoList'
import { Switch, Route, Redirect } from 'react-router-dom'
import { withUser } from './context/UserProvider.js'
import ProtectedRoute from './shared/ProtectedRoute.js'


class App extends Component {

    render(){
        // Destructuring the Context we are receiving via props
        const { 
            token, logout, 
            user, addTodo, 
            getUserTodos, todos 
        } = this.props

        return (
            <div>
                { token && <Nav token={token} logout={logout}/> }
                <Switch>

                    <Route 
                        exact path="/" 
                        render={rProps => !token ?
                                <Auth {...rProps}/> :
                                <Redirect to="/todos"/>
                            }/>

                    <ProtectedRoute 
                        token={token}
                        path="/todos"
                        component={TodoList}
                        redirectTo="/"
                        user={user} 
                        addTodo={addTodo}   
                        getUserTodos={getUserTodos} 
                        todos={todos}              
                    />
                    
                </Switch>
            </div>
        )
    }
}

export default withUser(App)