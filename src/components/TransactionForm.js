import React, { useState } from 'react';
import axios from 'axios';

const TransactionForm = ({ fetchTransactions }) => {
    const [transaction, setTransaction] = useState({
        transactionId: '',
        type: 'expense',  // Default type is 'expense'
        amount: '',
        category: '',
        date: ''
    });

    const [loading, setLoading] = useState(false);  // State to manage loading status
    const [error, setError] = useState(null);  // State to manage error messages

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
            await axios.post('https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions', transaction);
            
            // Refresh transaction list after successful addition
            if (fetchTransactions) {
                fetchTransactions();
            }
            
            // Reset the form after submission
            setTransaction({ transactionId: '', type: 'expense', amount: '', category: '', date: '' });
        } catch (error) {
            console.error("Error adding transaction:", error);
            setError("Failed to add transaction. Please try again.");
        } finally {
            setLoading(false);  // Stop loading state after request completion
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Add New Transaction</h2>

            {/* Display error message if any */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <div>
                <label>Transaction ID:</label>
                <input
                    name="transactionId"
                    value={transaction.transactionId}
                    onChange={handleChange}
                    placeholder="Transaction ID"
                    required
                />
            </div>

            <div>
                <label>Type:</label>
                <select name="type" value={transaction.type} onChange={handleChange} required>
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                </select>
            </div>

            <div>
                <label>Amount:</label>
                <input
                    name="amount"
                    value={transaction.amount}
                    onChange={handleChange}
                    placeholder="Amount"
                    type="number"
                    min="0"
                    required
                />
            </div>

            <div>
                <label>Category:</label>
                <input
                    name="category"
                    value={transaction.category}
                    onChange={handleChange}
                    placeholder="Category"
                    required
                />
            </div>

            <div>
                <label>Date:</label>
                <input
                    name="date"
                    value={transaction.date}
                    onChange={handleChange}
                    placeholder="Date (YYYY-MM-DD)"
                    type="date"
                    required
                />
            </div>

            <button type="submit" disabled={loading}>
                {loading ? "Adding..." : "Add Transaction"}
            </button>
        </form>
    );
};

export default TransactionForm;
