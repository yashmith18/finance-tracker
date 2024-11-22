import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    CartesianGrid,
    ResponsiveContainer,
} from 'recharts';

const FinanceChart = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await axios.get(
                'https://b0z4adhs30.execute-api.us-east-1.amazonaws.com/prod/transactions'
            );
            const transactions = response.data
                .filter(txn => txn.date?.S && txn.amount?.N && txn.type?.S) // Validate transaction fields
                .map(txn => ({
                    date: txn.date.S,
                    expense: txn.type.S === 'expense' ? parseFloat(txn.amount.N) : 0,
                    income: txn.type.S === 'income' ? parseFloat(txn.amount.N) : 0,
                }));
            setData(transactions);
        } catch (error) {
            console.error('Error fetching transactions:', error);
            setError('Failed to load transaction data. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []);

    if (loading) {
        return <div>Loading data...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart
                data={data}
                margin={{ top: 20, right: 30, bottom: 20, left: 10 }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                    type="monotone"
                    dataKey="expense"
                    stroke="red"
                    name="Expenses"
                    strokeWidth={2}
                />
                <Line
                    type="monotone"
                    dataKey="income"
                    stroke="green"
                    name="Income"
                    strokeWidth={2}
                />
            </LineChart>
        </ResponsiveContainer>
    );
};

export default FinanceChart;
