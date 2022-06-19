import './TodoItem.css'
export default function TodoItem({ item, deleteItem, confirmItem, children, modifier, clearHistory, items }) {

    return (
        <li className={`todo--item ${modifier}`}>
            <h4>{item}</h4>
            { children }
        </li>
    )
}
