import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FiCheckCircle, FiClock, FiFilter, FiLogOut, FiPlus, FiSearch, FiTrash2, FiEdit2 } from 'react-icons/fi';
import { requestJson } from '../services/api';

const initialForm = {
  title: '',
  description: '',
  priority: 'medium',
  dueDate: '',
};

const statusFilters = ['all', 'pending', 'completed'];

function formatDate(value) {
  if (!value) return 'No deadline';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return 'No deadline';
  return date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

function Pill({ children, tone = 'neutral' }) {
  return <span className={`pill pill-${tone}`}>{children}</span>;
}

function SummaryCard({ label, value, tone }) {
  return (
    <motion.div className={`summary-card tone-${tone}`} whileHover={{ y: -2 }} transition={{ duration: 0.18 }}>
      <span>{label}</span>
      <strong>{value}</strong>
    </motion.div>
  );
}

export default function TaskDashboard({ user, onLogout }) {
  const [tasks, setTasks] = useState([]);
  const [summary, setSummary] = useState({ total: 0, pending: 0, completed: 0 });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({ totalPages: 1, currentPage: 1, totalRecords: 0, limit: 8 });
  const [form, setForm] = useState(initialForm);
  const [editingTaskId, setEditingTaskId] = useState(null);

  const filteredLabel = useMemo(() => {
    if (filter === 'all') return 'All tasks';
    return `${filter[0].toUpperCase()}${filter.slice(1)} tasks`;
  }, [filter]);

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const params = new URLSearchParams({
        status: filter,
        search,
        page: String(page),
        limit: String(meta.limit),
      });

      const [taskResult, summaryResult] = await Promise.all([
        requestJson(`/api/tasks?${params.toString()}`),
        requestJson('/api/tasks/summary'),
      ]);

      setTasks(taskResult.data || []);
      setMeta((current) => ({ ...current, ...(taskResult.meta || {}) }));
      setSummary(summaryResult || { total: 0, pending: 0, completed: 0 });
    } catch (loadError) {
      setError(loadError.message || 'Failed to load tasks.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter, page]);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    setPage(1);
    loadData();
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingTaskId(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || form.title.trim().length < 2) {
      setError('Task title must be at least 2 characters.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      title: form.title.trim(),
      description: form.description.trim(),
      priority: form.priority,
      dueDate: form.dueDate || null,
    };

    try {
      if (editingTaskId) {
        await requestJson(`/api/tasks/${editingTaskId}`, {
          method: 'PUT',
          body: payload,
        });
      } else {
        await requestJson('/api/tasks', {
          method: 'POST',
          body: payload,
        });
      }

      resetForm();
      setPage(1);
      await loadData();
    } catch (submitError) {
      setError(submitError.message || 'Unable to save task.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (task) => {
    setEditingTaskId(task.id);
    setForm({
      title: task.title || '',
      description: task.description || '',
      priority: task.priority || 'medium',
      dueDate: task.dueDate ? String(task.dueDate).slice(0, 10) : '',
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleToggleStatus = async (task) => {
    try {
      await requestJson(`/api/tasks/${task.id}/status`, {
        method: 'PATCH',
        body: { status: task.status === 'completed' ? 'pending' : 'completed' },
      });
      await loadData();
    } catch (statusError) {
      setError(statusError.message || 'Unable to update task status.');
    }
  };

  const handleDelete = async (taskId) => {
    const confirmed = window.confirm('Delete this task?');
    if (!confirmed) return;

    try {
      await requestJson(`/api/tasks/${taskId}`, { method: 'DELETE' });
      await loadData();
    } catch (deleteError) {
      setError(deleteError.message || 'Unable to delete task.');
    }
  };

  return (
    <div className="dashboard-shell">
      <div className="dashboard-background" />

      <header className="topbar">
        <div>
          <p className="eyebrow">Active session</p>
          <h1>Task control room</h1>
          <p className="lead">Manage work, keep sessions alive, and close out tasks with one clean workflow.</p>
        </div>

        <div className="topbar-actions">
          <div className="user-chip">
            <span>{user?.name || user?.email || 'Member'}</span>
            <small>{user?.role || 'user'}</small>
          </div>
          <button className="ghost-button" type="button" onClick={onLogout}>
            <FiLogOut />
            Logout
          </button>
        </div>
      </header>

      <section className="summary-grid">
        <SummaryCard label="Total" value={summary.total} tone="blue" />
        <SummaryCard label="Pending" value={summary.pending} tone="amber" />
        <SummaryCard label="Completed" value={summary.completed} tone="emerald" />
      </section>

      <section className="workspace-grid">
        <motion.form className="panel task-form" onSubmit={handleSubmit} whileHover={{ y: -1 }} transition={{ duration: 0.18 }}>
          <div className="panel-header">
            <div>
              <p className="eyebrow">{editingTaskId ? 'Edit task' : 'New task'}</p>
              <h2>{editingTaskId ? 'Update the task details' : 'Create a focused next action'}</h2>
            </div>
            {editingTaskId ? (
              <button className="ghost-button compact" type="button" onClick={resetForm}>
                Cancel
              </button>
            ) : null}
          </div>

          <label className="field-group">
            <span className="field-label">Title</span>
            <input
              className="field-input"
              value={form.title}
              onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
              placeholder="Prepare demo notes"
            />
          </label>

          <label className="field-group">
            <span className="field-label">Description</span>
            <textarea
              className="field-input field-textarea"
              value={form.description}
              onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
              placeholder="Add context, dependencies, or the outcome you want."
              rows="4"
            />
          </label>

          <div className="form-grid-two">
            <label className="field-group">
              <span className="field-label">Priority</span>
              <select
                className="field-input"
                value={form.priority}
                onChange={(event) => setForm((current) => ({ ...current, priority: event.target.value }))}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </label>

            <label className="field-group">
              <span className="field-label">Due date</span>
              <input
                className="field-input"
                type="date"
                value={form.dueDate}
                onChange={(event) => setForm((current) => ({ ...current, dueDate: event.target.value }))}
              />
            </label>
          </div>

          {error ? <div className="form-error">{error}</div> : null}

          <button className="primary-button" type="submit" disabled={saving}>
            <span>{saving ? 'Saving...' : editingTaskId ? 'Update task' : 'Add task'}</span>
            <FiPlus />
          </button>
        </motion.form>

        <div className="panel task-panel">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Task board</p>
              <h2>{filteredLabel}</h2>
            </div>
            <span className="board-count">{meta.totalRecords || tasks.length} items</span>
          </div>

          <form className="search-row" onSubmit={handleSearchSubmit}>
            <div className="search-field">
              <FiSearch />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search tasks"
              />
            </div>
            <button className="ghost-button" type="submit">
              Search
            </button>
          </form>

          <div className="filter-row">
            <FiFilter />
            {statusFilters.map((item) => (
              <button
                key={item}
                type="button"
                className={item === filter ? 'filter-chip active' : 'filter-chip'}
                onClick={() => {
                  setFilter(item);
                  setPage(1);
                }}
              >
                {item}
              </button>
            ))}
          </div>

          {loading ? <div className="loading-inline">Loading tasks...</div> : null}

          <AnimatePresence mode="wait">
            {!loading && tasks.length ? (
              <motion.div
                key={`${filter}-${search}-${page}`}
                className="task-list"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                {tasks.map((task, index) => (
                  <motion.article
                    key={task.id}
                    className="task-card"
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                  >
                    <div className="task-card-head">
                      <div>
                        <h3>{task.title}</h3>
                        <p>{task.description || 'No description added yet.'}</p>
                      </div>

                      <Pill tone={task.status === 'completed' ? 'emerald' : 'amber'}>
                        {task.status}
                      </Pill>
                    </div>

                    <div className="task-meta">
                      <Pill tone={task.priority === 'high' ? 'red' : task.priority === 'medium' ? 'blue' : 'neutral'}>
                        Priority: {task.priority}
                      </Pill>
                      <span>
                        <FiClock />
                        {formatDate(task.dueDate)}
                      </span>
                    </div>

                    <div className="task-actions">
                      <button className="ghost-button compact" type="button" onClick={() => handleEdit(task)}>
                        <FiEdit2 />
                        Edit
                      </button>
                      <button className="ghost-button compact" type="button" onClick={() => handleToggleStatus(task)}>
                        <FiCheckCircle />
                        {task.status === 'completed' ? 'Mark pending' : 'Complete'}
                      </button>
                      <button className="danger-button compact" type="button" onClick={() => handleDelete(task.id)}>
                        <FiTrash2 />
                        Delete
                      </button>
                    </div>
                  </motion.article>
                ))}
              </motion.div>
            ) : null}
          </AnimatePresence>

          {!loading && !tasks.length ? <div className="empty-state">No tasks match the current view.</div> : null}

          <div className="pagination-row">
            <button
              type="button"
              className="ghost-button compact"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page <= 1}
            >
              Previous
            </button>

            <span className="pagination-label">
              Page {meta.currentPage || page} of {meta.totalPages || 1}
            </span>

            <button
              type="button"
              className="ghost-button compact"
              onClick={() => setPage((current) => Math.min(meta.totalPages || 1, current + 1))}
              disabled={(meta.totalPages || 1) <= page}
            >
              Next
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
