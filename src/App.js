import React from 'react';
import TransactionForm from './components/TransactionForm';
import TransactionList from './components/TransactionList';
import FinanceChart from './components/FinanceChart';

function App() {
    return (
        <div>
            <h1>Personal Finance Tracker</h1>
            <TransactionForm />
            <TransactionList />
            <FinanceChart />
        </div>
    );
}

export default App;
