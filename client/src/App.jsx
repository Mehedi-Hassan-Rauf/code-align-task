import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import io from 'socket.io-client';

const socket = io('http://localhost:5000');

function App() {
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const tasksPerPage = 5;

  const fetchTasks = async (page = 1, search = '') => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/tasks?page=${page}&limit=${tasksPerPage}&search=${search}`
      );
      const data = await response.json();
      setTasks(data.tasks);
      setTotalPages(data.totalPages);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    }
  };

  useEffect(() => {
    fetchTasks();
    socket.on('taskUpdate', () => {
      fetchTasks(currentPage, searchTerm);
    });
    return () => socket.off('taskUpdate');
  }, []);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchTasks(1, e.target.value);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Task Manager</h1>
      <TaskForm socket={socket} fetchTasks={() => fetchTasks(currentPage, searchTerm)} />
      <input
        type="text"
        placeholder="Search tasks..."
        value={searchTerm}
        onChange={handleSearch}
        className="mb-4 p-2 border rounded w-full"
      />
      {selectedTask ? (
        <TaskDetail task={selectedTask} setSelectedTask={setSelectedTask} socket={socket} />
      ) : (
        <TaskList
          tasks={tasks}
          setSelectedTask={setSelectedTask}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          fetchTasks={fetchTasks}
          socket={socket}
          searchTerm={searchTerm}
        />
      )}
    </div>
  );
}

export default App;