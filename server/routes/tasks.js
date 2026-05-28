const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');

module.exports = (authenticate) => {
  router.get('/', authenticate, taskCtrl.list());
  router.get('/summary', authenticate, taskCtrl.summary());
  router.post('/', authenticate, taskCtrl.create());
  router.get('/:id', authenticate, taskCtrl.getById());
  router.put('/:id', authenticate, taskCtrl.update());
  router.patch('/:id/status', authenticate, taskCtrl.changeStatus());
  router.delete('/:id', authenticate, taskCtrl.remove());
  return router;
};
