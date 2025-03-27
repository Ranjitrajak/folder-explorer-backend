const express = require('express');
const router = express.Router();
const {
  getAllFiles,
  createFile,
  updateFile,
  moveFile,
  deleteFile
} = require('../controllers/fileController');

router.get('/', getAllFiles);
router.post('/', createFile);
router.put('/:id', updateFile);
router.put('/move/:id', moveFile);
router.delete('/:id', deleteFile);

module.exports = router;