import { useState } from 'react';

function TaskForm({ socket, fetchTasks }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !dueDate) {
      alert('All fields are required');
      return;
    }

    try {
      await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, dueDate, status: 'Pending' }),
      });
      setTitle('');
      setDescription('');
      setDueDate('');
      fetchTasks();
      socket.emit('taskUpdate');
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mb-4 p-4 border rounded">
      <input
        type="text"
        placeholder="Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <textarea
        placeholder="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <input
        type="date"
        value={dueDate}
        onChange={(e) => setDueDate(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <button type="submit" className="bg-blue-500 text-white p-2 rounded">
        Add Task
      </button>
    </form>
  );
}

export default TaskForm;