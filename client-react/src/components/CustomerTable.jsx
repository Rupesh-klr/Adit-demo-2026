import { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../services/customerService';
import { Button, Toast } from './index';
import CustomerTableTemplate from './Table/CustomerTableTemplate';

const customerColumns = [
  { key: 'name', label: 'Name' },
  { key: 'email', label: 'Email' },
  { key: 'phone', label: 'Phone' },
];

export default function CustomerTable({ onRefreshButtonClicked }) {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState({ "key": "global", "value": "" });
  const [meta, setMeta] = useState({
    totalRecords: 0, totalPages: 1, limit: 10, currentPage: 1,
    sortBy: null,
    sortOrder: null,
  });
  const [searchValue, setSearchValue] = useState({ "key": "global", "value": "" });
  const [filter, setFilter] = useState({ page: 1, limit: 10, sort: 'name', order: 'asc', search: '', filterBy: '' });
  const [refreshFlag, setRefreshFlag] = useState(false);


  const fetchCustomers = async () => {
    setLoading(true);
    setError('');
    const attemptFetch = async (retriesLeft) => {
      try {
        const data = await getCustomers({ ...filter });
        setCustomers(data.data);
        setMeta(prev => ({ ...prev, ...data.meta, sortBy: filter.sort, sortOrder: filter.order }));
        setLoading(false);
      } catch (err) {
        if (retriesLeft > 0) {
          const attemptNumber = 6 - retriesLeft;
          Toast.warn(`Backend is waking up... Retrying (Attempt ${attemptNumber}/5)`);
          setTimeout(() => {
            attemptFetch(retriesLeft - 1);
          }, 30000);
        } else {
          setLoading(false);
          setError('Backend failed to respond after 5 attempts.');
          Toast.error("backend failed: connection timed out");
        }
      }
    };
    await attemptFetch(5);
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  useEffect(() => {
    fetchCustomers();
  }, [filter]);
  const handleDelete = async (id) => {
    try {
      await deleteCustomer(id);
      setCustomers((prev) => prev.filter((c) => c.id !== id));
      setRefreshFlag(!refreshFlag);
      Toast.success("Customer deleted successfully");
    } catch {
      alert('Delete failed');
      Toast.error("Failed to delete customer");
    }
  };

  if (loading) return <div className="text-center py-4">Loading...</div>;
  if (error) return <div className="text-red-500 text-center py-2">{error}</div>;

  const handleFilter = async (searchValue) => {
    setSearch({ key: searchValue.key, value: searchValue.value });
    setFilter((prev) => ({
      ...prev,
      search: searchValue.value,
      filterBy: searchValue.key,
      page: 1,
    }));
  };

  const handleRowsPerPageChange = (newValue, currentpage, sortBy, sortOrder) => {
    const newLimit = parseInt(newValue);
    if (newLimit === null || currentpage === null || sortBy?.length > 0 || sortOrder?.length > 0) {
      setFilter(prev => ({
        ...prev,
        sort: sortBy || prev.sort,
        order: sortOrder || prev.order,
      }));
      return;
    }
    if (meta.limit === newLimit) {
      if (meta.currentPage !== currentpage) {
        setFilter(prev => ({
          ...prev,
          page: currentpage,
        }));
        Toast.success(`Page changed to ${currentpage}`);
      }
      return;
    }
    if (meta.limit !== newLimit) {
      setFilter(prev => ({
        ...prev,
        limit: newLimit,
        page: currentpage > 1 ? currentpage : 1,
      }));
    }
    Toast.success(`Showing ${newLimit} entries`);
  };

  return (
    <div className="overflow-x-auto">
      <CustomerTableTemplate
        key={customers.length + '-' + (customers[0]?.id || 0)}
        columns={customerColumns}
        rows={customers}
        onDelete={handleDelete}
        onRefreshButtonClicked={onRefreshButtonClicked}
        search={search}
        handleFilter={handleFilter}
        searchValue={searchValue}
        setSearchValue={setSearchValue}
        meta={meta}
        handleRowsPerPageChange={handleRowsPerPageChange}
      />
    </div>
  );
}
