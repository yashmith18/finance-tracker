import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TransactionList = () => {
    const [transactions, setTransactions] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get(
                'https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions'
            );
            setTransactions(response.data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    const containerStyle = {
        maxWidth: '800px',
        margin: '20px auto',
        padding: '20px',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
    };

    const listStyle = {
        listStyleType: 'none',
        padding: 0,
    };

    const cardStyle = {
        padding: '15px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '6px',
        boxShadow: '0 1px 4px rgba(0, 0, 0, 0.1)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
    };

    const incomeStyle = {
        color: '#28a745', // Green for income
        fontWeight: 'bold',
    };

    const expenseStyle = {
        color: '#dc3545', // Red for expense
        fontWeight: 'bold',
    };

    const dateStyle = {
        fontSize: '14px',
        color: '#6c757d', // Gray for the date
    };

    return (
        <div style={containerStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Transaction List</h2>
            <ul style={listStyle}>
                {transactions.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#6c757d' }}>No transactions found.</p>
                ) : (
                    transactions.map((txn) => (
                        <li key={txn.transactionId.S} style={cardStyle}>
                            <div>
                                <strong style={txn.type.S === 'income' ? incomeStyle : expenseStyle}>
                                    {txn.type.S === 'income' ? 'Income' : 'Expense'}
                                </strong>
                                <p style={dateStyle}>{txn.date.S}</p>
                            </div>
                            <div>
                                <p>
                                    <strong>${txn.amount.N}</strong> in {txn.category.S}
                                </p>
                            </div>
                        </li>
                    ))
                )}
            </ul>
        </div>
    );
};

export default TransactionList;
