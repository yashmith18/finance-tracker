import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ fetchTransactions }) => {
    const [transaction, setTransaction] = useState({
        transactionId: '',
        type: 'expense', // Default type is 'expense'
        amount: '',
        category: '',
        date: '',
    });

    const [loading, setLoading] = useState(false); // State to manage loading status
    const [error, setError] = useState(null); // State to manage error messages

    const handleChange = (e) => {
        const { name, value } = e.target;
        setTransaction((prevTransaction) => ({
            ...prevTransaction,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Simple client-side validation
        if (!transaction.amount || transaction.amount <= 0) {
            setError('Amount should be greater than 0');
            setLoading(false);
            return;
        }

        try {
            // POST request to add the transaction
            await axios.post(
                'https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions',
                transaction
            );

            // Refresh transaction list after successful addition
            if (fetchTransactions) {
                fetchTransactions();
            }

            // Reset the form after submission
            setTransaction({
                transactionId: '',
                type: 'expense',
                amount: '',
                category: '',
                date: '',
            });
        } catch (error) {
            console.error('Error adding transaction:', error);
            setError('Failed to add transaction. Please try again.');
        } finally {
            setLoading(false); // Stop loading state after request completion
        }
    };

    const formStyle = {
        maxWidth: '500px',
        margin: '20px auto',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    };

    const fieldStyle = {
        marginBottom: '15px',
        display: 'flex',
        flexDirection: 'column',
    };

    const labelStyle = {
        marginBottom: '5px',
        fontWeight: 'bold',
    };

    const inputStyle = {
        padding: '8px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '14px',
    };

    const buttonStyle = {
        padding: '10px 15px',
        border: 'none',
        borderRadius: '4px',
        backgroundColor: loading ? '#ccc' : '#28a745',
        color: 'white',
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '16px',
        fontWeight: 'bold',
    };

    const errorStyle = {
        color: 'red',
        marginBottom: '10px',
        fontWeight: 'bold',
    };

    return (
        <form onSubmit={handleSubmit} style={formStyle}>
            <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>
                Add New Transaction
            </h2>

            {/* Display error message if any */}
            {error && <p style={errorStyle}>{error}</p>}

            <div style={fieldStyle}>
                <label style={labelStyle}>Transaction ID:</label>
                <input
                    name="transactionId"
                    value={transaction.transactionId}
                    onChange={handleChange}
                    placeholder="Transaction ID"
                    style={inputStyle}
                    required
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Type:</label>
                <select
                    name="type"
                    value={transaction.type}
                    onChange={handleChange}
                    style={inputStyle}
                    required
                >
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Amount:</label>
                <input
                    name="amount"
                    value={transaction.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    type="number"
                    min="0"
                    style={inputStyle}
                    required
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Category:</label>
                <input
                    name="category"
                    value={transaction.category}
                    onChange={handleChange}
                    placeholder="Category"
                    style={inputStyle}
                    required
                />
            </div>

            <div style={fieldStyle}>
                <label style={labelStyle}>Date:</label>
                <input
                    name="date"
                    value={transaction.date}
                    onChange={handleChange}
                    placeholder="Date (YYYY-MM-DD)"
                    type="date"
                    style={inputStyle}
                    required
                />
            </div>

            <button type="submit" style={buttonStyle} disabled={loading}>
                {loading ? 'Adding...' : 'Add Transaction'}
            </button>
        </form>
    );
};

export default TransactionForm;
