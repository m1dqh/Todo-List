import './Input.css'
import TodoItem from '../TodoItem/TodoItem'
import { useState, useEffect } from 'react'
import { nanoid } from 'nanoid'

export default function Input() {
    const [items, setItems] = useState({
        id: nanoid(),
        uncompletedItems: JSON.parse(localStorage.getItem('uncompletedItems')) || [],
        confirmedItems: JSON.parse(localStorage.getItem('confirmedItems')) || [],
        all: false,
        completed: false,
        uncompleted: false
    })

    const EmptyMessage = props => {
        return ( <h2 className="empty-items __small">{props.description}</h2> )
    }

    const CompletedTasks = props => {
        return (
            <div className="items--container" role="button" tabIndex="0">
                <h4 className="title-tag" onClick={ props.toggle }>{ props.title }</h4>

                <ul>
                    { props.isOpen ?
                      props.arr > 0 ?
                      [ props.child ] :
                      <EmptyMessage description={ props.description }/> : false
                    }
                    {props.title === 'completed' && props.isOpen && props.arr > 0 && <button className="clear-btn" onClick={clearHistory}>Clear History</button>}
                </ul>
            </div>
        )
    }

    function toggleOpen(event) {
        const currentTarget = event.target.textContent
        setItems(prevState => {
            return {
                ...prevState,
                [currentTarget]: !prevState[currentTarget]
            }
        })
    }

    function appendItem(event) {
        if (event.type === 'click' || event.code === 'Enter') {
            if (document.querySelector('.input').value !== '') {
                setItems(prevItems => {
                    return {...prevItems, uncompletedItems: [...prevItems.uncompletedItems, document.querySelector('.input').value]}
                })
            } else {
                alert('Please, Check that you Type\'d Something')
            }
        }
    }

    function deleteItem(event) {
        const { parentElement } = event.target.parentElement
        const newArray = items.uncompletedItems.filter(item => item !== parentElement.children[0].textContent)
        setItems(prevItems => {
            return {
                ...prevItems,
                items: newArray
            }
        })

    }

    function clearHistory() {
        setItems(prevItems => {
            return {
                ...prevItems,
                confirmedItems: []
            }
        })
    }

    function confirmItem(event) {
        const { parentElement } = event.target.parentElement
        const newArray = items.uncompletedItems.filter(item => {
                if (item === parentElement.children[0].textContent) {
                    items.uncompletedItems.splice(items.uncompletedItems.indexOf(item), 1)
                    return item
                }
            })
        setItems(prevItems => {
            return {
                ...prevItems,
                confirmedItems: [...prevItems.confirmedItems, ...newArray]
            }
        })
    }

    useEffect(() => {
        localStorage.setItem('uncompletedItems', JSON.stringify(items.uncompletedItems))
        localStorage.setItem('confirmedItems', JSON.stringify(items.confirmedItems))
        document.querySelector('.input').value = '';
    }, [items])

    const todoItems = items.uncompletedItems.map(item => {
        return <TodoItem key={items.id} item={item} deleteItem={deleteItem} confirmItem={confirmItem} >
        <div className="btn-groups">
            <button className="check-btn" onClick={confirmItem} title="Confirm">✔</button>
            <button className="delete-btn" onClick={deleteItem} title="Delete">✘</button>
        </div>
        </TodoItem>
    })
    const completedTodoItems = items.confirmedItems.map(item => {
        return <TodoItem
                key={items.id}
                item={item}
                items={{...items}}
                modifier="completed-items"
                />
    })

    return (
        <div className="todo--input">
            <div className="input--group">
                <h4 className="input--placeholder">Enter a Todo</h4>
                <input type="text" className="input" onKeyPress={ appendItem } />
                <button className="add-btn" onClick={ appendItem } title="Add">+</button>
            </div>
            {items.uncompletedItems.length > 0 || items.confirmedItems.length > 0 ?
                <>
                    < CompletedTasks
                    isOpen={items.uncompleted}

                    arr={items.uncompletedItems.length}
                    child={todoItems}
                    description="You don't have any uncompleted Tasks!"
                    title="uncompleted"
                    toggle={toggleOpen}
                    clearHistory={clearHistory}
                    />

                    < CompletedTasks
                    isOpen={items.completed}
                    arr={items.confirmedItems.length}
                    child={completedTodoItems}
                    description="You don't have any completed Tasks!"
                    title={'completed'}
                    toggle={toggleOpen}
                    />

                    < CompletedTasks
                    isOpen={ items.all }
                    arr={[ completedTodoItems, todoItems ].length > 0}
                    child={ [ todoItems, completedTodoItems ] }
                    description="You don't have any Tasks!"
                    title={ 'all' }
                    toggle={ toggleOpen }
                    />
                </> :
                <h2 className="empty-items __animated">Add a New Item</h2>
            }
        </div>
    )
}
