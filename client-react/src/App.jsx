

import CustomerForm from './components/CustomerForm';
import CustomerTable from './components/CustomerTable';
import { useState } from 'react';
import './App.css';

function App() {
  const [refresh, setRefresh] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center px-2 py-6">
      <main className="w-full max-w-[920px] bg-white rounded-lg shadow-lg p-6 md:p-10 flex flex-col gap-8">
        <h1 className="text-red-500 text-3xl md:text-5xl font-extrabold text-center mb-2">Customer Management</h1>
        <CustomerForm onCustomerAdded={() => setRefresh((v) => !v)} />
        
        <CustomerTable key={refresh} onRefreshButtonClicked={() => setRefresh((v) => !v)}/>
      </main>
    </div>
  );
}

export default App;
