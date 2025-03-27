const mongoose = require('mongoose');

const fileSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true 
  },
  type: { 
    type: String, 
    enum: ['file', 'folder'], 
    required: true 
  },
  parentId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'File', 
    default: null 
  },
  content: { 
    type: String, 
    default: '' 
  },
  children: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'File' 
  }]
}, { timestamps: true });

module.exports = mongoose.model('File', fileSchema);