import { useState, useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import axios from 'axios';
import FileItem from './components/FileItem';
import { API_CONFIG } from './config';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [expandedFolders, setExpandedFolders] = useState(new Set());

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.BASE_URL}/files`);
      setFiles(response.data);
    } catch (error) {
      console.error('Error fetching files:', error);
    }
  };

  const createFile = async (type, parentId = null) => {
    const name = prompt(`Enter ${type} name:`);
    if (!name) return;

    try {
      await axios.post(`${API_CONFIG.BASE_URL}/files`, {
        name,
        type,
        parentId,
        content: type === 'file' ? 'New file content' : ''
      });
      fetchFiles();
    } catch (error) {
      console.error('Error creating file:', error);
    }
  };

  const renameFile = async (id, currentName) => {
    const newName = prompt('Enter new name:', currentName);
    if (!newName || newName === currentName) return;

    try {
      await axios.put(`${API_CONFIG.BASE_URL}/files/${id}`, { name: newName });
      fetchFiles();
    } catch (error) {
      console.error('Error renaming file:', error);
    }
  };

  const deleteFile = async (id) => {
    if (!confirm('Are you sure you want to delete this?')) return;

    try {
      await axios.delete(`${API_CONFIG.BASE_URL}/files/${id}`);
      fetchFiles();
    } catch (error) {
      console.error('Error deleting file:', error);
    }
  };

  const toggleFolder = (id) => {
    setExpandedFolders(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const moveFile = async (draggedId, targetId) => {
    try {
      await axios.put(`${API_CONFIG.BASE_URL}/files/move/${draggedId}`, {
        newParentId: targetId
      });
      fetchFiles();
    } catch (error) {
      console.error('Move failed:', error);
    }
  };

  const renderFiles = (parentId = null) => {
    return files
      .filter(file => (file.parentId ? file.parentId.toString() === parentId?.toString() : parentId === null))
      .map(file => (
        <FileItem
          key={file._id}
          file={file}
          isExpanded={expandedFolders.has(file._id)}
          onToggle={toggleFolder}
          onCreate={createFile}
          onRename={renameFile}
          onDelete={deleteFile}
          onMove={moveFile}
        >
          {file.type === 'folder' && expandedFolders.has(file._id) && (
            <div style={{ marginLeft: '20px' }}>
              {renderFiles(file._id)}
            </div>
          )}
        </FileItem>
      ));
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="app">
        <h1>File Explorer</h1>
        <div className="toolbar">
          <button onClick={() => createFile('folder')}>New Folder</button>
          <button onClick={() => createFile('file')}>New File</button>
        </div>
        <div className="file-tree">
          {renderFiles()}
        </div>
      </div>
    </DndProvider>
  );
}

export default App;