import React, { Component } from 'react'
import TodoForm from './TodoForm.js'

class TodoList extends Component {
    constructor(){
        super()
        this.state = {
            title: ""
        }
    }

    componentDidMount(){
        this.props.getUserTodos()
    }

    handleChange = e => {
        const { name, value } = e.target
        this.setState({ [name]: value })
    }

    handleSubmit = e => {
        e.preventDefault()
        this.props.addTodo(this.state)
        this.setState({title: ""})
    }

    render(){
        const { todos } = this.props

        return (
            <div>
                <TodoForm 
                    title={this.state.title}
                    handleChange={this.handleChange}
                    handleSubmit={this.handleSubmit}
                    btnText="Add todo"
                />

                { todos.map(todo => <h1 key={todo._id}>{todo.title}</h1>) }
            </div>
        )
    }
}

export default TodoList