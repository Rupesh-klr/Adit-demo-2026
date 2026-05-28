const Task = require('../models/Task');

const normalizeStatus = value => {
  if (!value) return null;
  const normalized = String(value).toLowerCase();
  if (normalized === 'pending' || normalized === 'completed') return normalized;
  return null;
};

const parsePage = value => Math.max(1, Number.parseInt(value, 10) || 1);
const parseLimit = value => Math.min(100, Math.max(1, Number.parseInt(value, 10) || 10));

const summary = () => async (req, res) => {
  const baseFilter = { createdBy: req.user._id };
  const [total, pending, completed] = await Promise.all([
    Task.countDocuments(baseFilter),
    Task.countDocuments({ ...baseFilter, status: 'pending' }),
    Task.countDocuments({ ...baseFilter, status: 'completed' }),
  ]);
  res.json({ total, pending, completed });
};

const list = () => async (req, res) => {
  const { status = 'all', search = '', page = 1, limit = 10, sortBy = 'createdAt', order = 'desc' } = req.query;
  const filter = { createdBy: req.user._id };
  const normalizedStatus = normalizeStatus(status);
  if (normalizedStatus) filter.status = normalizedStatus;
  const searchTerm = String(search).trim();
  if (searchTerm) filter.$or = [{ title: { $regex: searchTerm, $options: 'i' } }, { description: { $regex: searchTerm, $options: 'i' } }];
  const pageNumber = parsePage(page);
  const limitNumber = parseLimit(limit);
  const sortFields = new Set(['createdAt', 'updatedAt', 'title', 'dueDate', 'status', 'priority']);
  const safeSortBy = sortFields.has(String(sortBy)) ? String(sortBy) : 'createdAt';
  const sortDirection = String(order).toLowerCase() === 'asc' ? 1 : -1;
  const totalRecords = await Task.countDocuments(filter);
  const totalPages = Math.max(1, Math.ceil(totalRecords / limitNumber));
  const currentPage = Math.min(pageNumber, totalPages);
  const tasks = await Task.find(filter)
    .sort({ [safeSortBy]: sortDirection })
    .skip((currentPage - 1) * limitNumber)
    .limit(limitNumber)
    .populate('createdBy', 'name email role');
  res.json({ data: tasks.map(t => ({ id: t._id.toString(), title: t.title, description: t.description, status: t.status, priority: t.priority, dueDate: t.dueDate, completedAt: t.completedAt, createdAt: t.createdAt, updatedAt: t.updatedAt, createdBy: t.createdBy })), meta: { totalRecords, totalPages, currentPage, limit: limitNumber } });
};

const create = () => async (req, res) => {
  const { title, description = '', status = 'pending', priority = 'medium', dueDate = null } = req.body;
  if (!title || String(title).trim().length < 2) return res.status(400).json({ error: 'Validation error', message: 'Task title must be at least 2 characters long.' });
  const normalizedStatus = normalizeStatus(status) || 'pending';
  const normalizedPriority = ['low', 'medium', 'high'].includes(String(priority).toLowerCase()) ? String(priority).toLowerCase() : 'medium';
  const task = await Task.create({ title: String(title).trim(), description: String(description).trim(), status: normalizedStatus, priority: normalizedPriority, dueDate: dueDate ? new Date(dueDate) : null, completedAt: normalizedStatus === 'completed' ? new Date() : null, createdBy: req.user._id });
  const populatedTask = await task.populate('createdBy', 'name email role');
  req.app.get('io') && req.app.get('io').emit('task:created', { id: task._id.toString(), title: task.title });
  res.status(201).json({ task: { id: task._id.toString(), title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate, completedAt: task.completedAt, createdBy: populatedTask.createdBy } });
};

const getById = () => async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id }).populate('createdBy', 'name email role');
  if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found.' });
  res.json({ task: { id: task._id.toString(), title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate, completedAt: task.completedAt, createdBy: task.createdBy } });
};

const update = () => async (req, res) => {
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!task) return res.status(404).json({ error: 'Not Found', message: 'Task not found.' });
  const { title, description, status, priority, dueDate } = req.body;
  if (title !== undefined) { if (String(title).trim().length < 2) return res.status(400).json({ error: 'Validation error' }); task.title = String(title).trim(); }
  if (description !== undefined) task.description = String(description).trim();
  if (status !== undefined) { const normalizedStatus = normalizeStatus(status); if (!normalizedStatus) return res.status(400).json({ error: 'Validation error' }); task.status = normalizedStatus; task.completedAt = normalizedStatus === 'completed' ? (task.completedAt || new Date()) : null; }
  if (priority !== undefined) { const normalizedPriority = ['low', 'medium', 'high'].includes(String(priority).toLowerCase()) ? String(priority).toLowerCase() : null; if (!normalizedPriority) return res.status(400).json({ error: 'Validation error' }); task.priority = normalizedPriority; }
  if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
  await task.save();
  const populatedTask = await task.populate('createdBy', 'name email role');
  req.app.get('io') && req.app.get('io').emit('task:updated', { id: task._id.toString() });
  res.json({ task: { id: task._id.toString(), title: task.title, description: task.description, status: task.status, priority: task.priority, dueDate: task.dueDate, completedAt: task.completedAt, createdBy: populatedTask.createdBy } });
};

const changeStatus = () => async (req, res) => {
  const status = normalizeStatus(req.body.status);
  if (!status) return res.status(400).json({ error: 'Validation error', message: 'Status must be pending or completed.' });
  const task = await Task.findOne({ _id: req.params.id, createdBy: req.user._id });
  if (!task) return res.status(404).json({ error: 'Not Found' });
  task.status = status; task.completedAt = status === 'completed' ? new Date() : null; await task.save();
  req.app.get('io') && req.app.get('io').emit('task:updated', { id: task._id.toString() });
  res.json({ task: { id: task._id.toString(), status: task.status } });
};

const remove = () => async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) return res.status(404).json({ error: 'Not Found' });
  const isOwner = task.createdBy.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
  await Task.deleteOne({ _id: task._id });
  req.app.get('io') && req.app.get('io').emit('task:deleted', { id: task._id.toString() });
  res.json({ message: 'Task deleted successfully.' });
};

module.exports = { summary, list, create, getById, update, changeStatus, remove };
