import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

const FinanceChart = () => {
    const [data, setData] = useState([]);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions');
            const transactions = response.data.map(txn => ({
                date: txn.date.S, // Assuming `date.S` contains a date or time string
                expense: txn.type.S === 'expense' ? parseFloat(txn.amount.N) : 0,
                income: txn.type.S === 'income' ? parseFloat(txn.amount.N) : 0,
            }));
            setData(transactions);
        } catch (error) {
            console.error("Error fetching transactions:", error);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    return (
        <LineChart width={600} height={300} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="expense" stroke="red" name="Expenses" />
            <Line type="monotone" dataKey="income" stroke="green" name="Income" />
        </LineChart>
    );
};

export default FinanceChart;
