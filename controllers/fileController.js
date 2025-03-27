const File = require('../models/fileModel');

exports.getAllFiles = async (req, res) => {
  try {
    const files = await File.find().populate('children');
    res.json(files);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.createFile = async (req, res) => {
  const { name, type, parentId, content } = req.body;
  
  try {
    if (parentId) {
      const parent = await File.findById(parentId);
      if (!parent) {
        return res.status(404).json({ message: 'Parent folder not found' });
      }
      if (parent.type !== 'folder') {
        return res.status(400).json({ message: 'Parent must be a folder' });
      }
    }

    const newItem = new File({
      name,
      type,
      parentId: parentId || null,
      content: type === 'file' ? content || '' : ''
    });

    const savedItem = await newItem.save();

    if (parentId) {
      await File.findByIdAndUpdate(parentId, {
        $push: { children: savedItem._id }
      });
    }

    res.status(201).json(savedItem);
  } catch (error) {
    console.error('Error creating item:', error);
    res.status(500).json({ 
      message: error.message,
      errorType: error.name 
    });
  }
};

exports.updateFile = async (req, res) => {
  const { id } = req.params;
  const { name, content } = req.body;
  
  try {
    const updatedFile = await File.findByIdAndUpdate(
      id,
      { name, content },
      { new: true }
    );
    res.json(updatedFile);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.moveFile = async (req, res) => {
  const { id } = req.params;
  const { newParentId } = req.body;

  try {
    const item = await File.findById(id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (newParentId) {
      const newParent = await File.findById(newParentId);
      if (!newParent) return res.status(404).json({ message: 'New parent not found' });
      if (newParent.type !== 'folder') return res.status(400).json({ message: 'Parent must be a folder' });
    }
    if (item.parentId) {
      await File.findByIdAndUpdate(item.parentId, {
        $pull: { children: item._id }
      });
    }

    if (newParentId) {
      await File.findByIdAndUpdate(newParentId, {
        $addToSet: { children: item._id }
      });
    }
    const updatedItem = await File.findByIdAndUpdate(
      id,
      { parentId: newParentId || null },
      { new: true }
    );

    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteFile = async (req, res) => {
  const { id } = req.params;
  
  try {
    const file = await File.findById(id);
    if (!file) return res.status(404).json({ message: 'File not found' }); 
    if (file.children.length > 0) {
      await Promise.all(file.children.map(childId => 
        File.findByIdAndDelete(childId)
      ));
    }
    if (file.parentId) {
      await File.findByIdAndUpdate(file.parentId, { $pull: { children: file._id } });
    } 
    await File.findByIdAndDelete(id);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};