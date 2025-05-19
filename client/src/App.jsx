import { useState, useEffect } from 'react';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import TaskDetail from './components/TaskDetail';
import io from 'socket.io-client';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

function App() {
  const [tasks, setTasks] = useState([]);
  const [selectedTask, setSelectedTask] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const tasksPerPage = 5;

  const fetchTasks = async (page = 1, search = '') => {
    try {
      const response = await fetch(
        `${API_URL}/api/tasks?page=${page}&limit=${tasksPerPage}&search=${search}`
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
    fetchTasks(currentPage, searchTerm);

    socket.on('taskUpdate', () => {
      fetchTasks(currentPage, searchTerm);
    });

    return () => {
      socket.off('taskUpdate');
    };
  }, [currentPage, searchTerm]);

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    fetchTasks(1, e.target.value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-6 max-w-4xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600 pb-2 border-b border-gray-200">
          Task Manager
        </h1>
        
        <div className="mb-6 flex items-center gap-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full p-3 pl-10 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg 
              className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" 
                clipRule="evenodd" 
              />
            </svg>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center"
          >
            <svg 
              className="h-5 w-5 mr-2" 
              xmlns="http://www.w3.org/2000/svg" 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path 
                fillRule="evenodd" 
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" 
                clipRule="evenodd" 
              />
            </svg>
            Add Task
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
        
        {/* Modal for Task Form */}
        {showModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
              <div className="bg-blue-600 px-4 py-3 flex justify-between items-center">
                <h2 className="text-lg font-semibold text-white">Create New Task</h2>
                <button 
                  onClick={() => setShowModal(false)}
                  className="text-white hover:text-gray-200 focus:outline-none"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <div className="p-4">
                <TaskForm 
                  socket={socket} 
                  fetchTasks={() => fetchTasks(currentPage, searchTerm)} 
                  closeModal={() => setShowModal(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;