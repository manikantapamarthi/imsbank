import React, { useEffect, useState } from 'react'

const Bank = () => {
  const [customerData, setCustomerData] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://quietstreamfinancial.github.io/eng-recruiting/transactions.json');
        const data = await response.json();
        setCustomerData(data)
      } catch(error) {
        console.log(error);
      }
    }
    fetchData();
  },[]);
  
  const calculateTotalBalance = (transactions) => {
    return transactions.reduce((total, transaction) => total + parseFloat(transaction.transaction_amount.replace('$', '')), 0).toFixed(2);
  };
  const groupedCustomers = {};

  customerData.forEach(transaction => {
    const key = `${transaction.customer_id}`;

    if(!groupedCustomers[key]) {

      groupedCustomers[key] = []
    }
    groupedCustomers[key].push(transaction)
  })
  return(
    <div>
       <table>
        <thead>
          <tr>
            <th>Customer Name</th>
            <th>CheckingAccount</th>
            <th>SavingsAccount</th>
            <th>Total Balance</th>
          </tr>
        </thead>
        <tbody>
         {Object.keys(groupedCustomers).map(key => {
          const transactions = groupedCustomers[key]
          const customerName = transactions[0].customer_name;
          const checkingBalance = calculateTotalBalance(transactions.filter(t => t.account_type === 'checking'));
          const savingsBalance = calculateTotalBalance(transactions.filter(t => t.account_type === 'savings'));
          const totalBalance = (parseFloat(checkingBalance) + parseFloat(savingsBalance)).toFixed(2);
          return (
            <tr key={key}>
              <td>{customerName}</td>
              <td>{checkingBalance}</td>
              <td>{savingsBalance}</td>
              <td>{totalBalance}</td>
            </tr>
          );
         })}
        </tbody>
      </table>
    </div>
  )
}

export default Bank;
