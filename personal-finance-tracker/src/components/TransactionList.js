import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions');
            setTransactions(response.data);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <div>
            <h2>Transaction List</h2>
            <ul>
                {transactions.map((txn) => (
                    <li key={txn.transactionId.S}>
                        <strong>{txn.date.S}</strong>: {txn.type.S === 'income' ? 'Income' : 'Expense'} - ${txn.amount.N} in {txn.category.S}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TransactionList;
