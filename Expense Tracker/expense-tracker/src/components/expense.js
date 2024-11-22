import React,{useState} from "react";
import "./expense.css";

export default function ExpenseTracker() {
    const [transaction,setTransaction] = useState([]);
    const [amount,setAmount] = useState("");
    const [description,setDescription] = useState("");
    const [total,setTotal] = useState(0);

    const addTransaction = () => {
        if(description.trim() && amount.trim()){
            const newTransaction = {
                description,
                amount:parseInt(amount),
                id:Date.now(),
            };
            setTransaction([...transaction,newTransaction]);
            setTotal(total + parseInt(amount));
            setAmount("");
            setDescription("");
        }
    };

    const removeTransaction = (id,amount) => {
        setTransaction(transaction.filter((transaction) => transaction.id !== id));
        setTotal(total - amount);
    }

    return (
        <div className="expense-tracker">
            <h1>Expense Tracker</h1>
            <div className="tracker-form">
                <input 
                    type="text"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                />
                <input
                    type="number"
                    placeholder="Amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                />
                <button onClick={addTransaction}>Add Transaction</button>
            </div>
            <div className="tracker-summary">
                <h2>Total: Rs {total.toFixed(2)}</h2>
            </div>
            <ul className="transaction-list">
                {transaction.map((transaction) => (
                    <li key={transaction.id} className="transaction-item">
                        <span>{transaction.description}</span>
                        <span>Rs {transaction.amount}</span>
                        <button
                            className="delete-btn"
                            onClick={() => removeTransaction(transaction.id,transaction.amount)}
                        >
                            Delete
                        </button>
                    </li>
                ))};
            </ul>
        </div>
    )
}