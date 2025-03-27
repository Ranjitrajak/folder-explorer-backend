import { useDrag, useDrop } from 'react-dnd';
import { FaFolder, FaFolderOpen, FaFile } from 'react-icons/fa';

const FileItem = ({ 
  file, 
  isExpanded, 
  onToggle, 
  onCreate, 
  onRename, 
  onDelete, 
  onMove, 
  children 
}) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'FILE_OR_FOLDER',  
    item: { 
      id: file._id,
      type: file.type  
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
  }));

  const [{ isOver }, drop] = useDrop(() => ({
    accept: 'FILE_OR_FOLDER',
    drop: (draggedItem) => {
      if (draggedItem.id !== file._id && 
          file.type === 'folder' && 
          !isChildFolder(file, draggedItem.id)) {
        onMove(draggedItem.id, file._id);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  }));

  const isChildFolder = (parent, childId) => {
    if (!parent.children) return false;
    return parent.children.some(child => 
      child._id === childId || isChildFolder(child, childId)
    );
  };

  const dragDropRef = (el) => {
    drag(drop(el));
  };

  return (
    <div 
      ref={dragDropRef} 
      className={`
        file-item 
        ${file.type} 
        ${isDragging ? 'dragging' : ''} 
        ${isOver ? 'over' : ''}
      `}
    >
      <div className="file-header">
        {/* Folder toggle icon */}
        {file.type === 'folder' && (
          <button 
            className="toggle-btn"
            onClick={() => onToggle(file._id)}
          >
            {isExpanded ? '▼' : '►'}
          </button>
        )}
        {file.type === 'folder' ? (
          isExpanded ? <FaFolderOpen /> : <FaFolder />
        ) : (
          <FaFile />
        )}

        <span className="file-name">{file.name}</span>
        <div className="file-actions">
          <button onClick={() => onRename(file._id, file.name)}>Rename</button>
          <button onClick={() => onDelete(file._id)}>Delete</button>
          {file.type === 'folder' && (
            <>
              <button onClick={() => onCreate('file', file._id)}>New File</button>
              <button onClick={() => onCreate('folder', file._id)}>New Folder</button>
            </>
          )}
        </div>
      </div>
      {children}
    </div>
  );
};

export default FileItem;