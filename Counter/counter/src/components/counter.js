import React,{useState} from 'react';
import './counter.css';

export default function Counter() {
    const [count, setCount] = useState(0);
        const increment = () => setCount(count + 1);
        const decrement = () => setCount(count>0 ? count-1 : 0);
        const reset = () => setCount(0);

        return (
            <div className="counter">
                <h1>Counter</h1>
                <div>{count}</div>
                <div className="buttons">
                    <button onClick={increment}>Increment</button>
                    <button onClick={decrement}>Decrement</button>
                    <button onClick={reset}>Reset</button>
                </div>
            </div>
        )
}