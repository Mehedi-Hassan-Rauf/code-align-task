const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function TaskDetail({ task, setSelectedTask, socket }) {
    const toggleStatus = async () => {
      try {
        await fetch(`${API_URL}/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            status: task.status === 'Pending' ? 'Completed' : 'Pending',
          }),
        });
        setSelectedTask(null);
        socket.emit('taskUpdate');
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    };
  
    return (
      <div className="p-6">
      <button
        onClick={() => setSelectedTask(null)}
        className="mb-6 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        <svg className="-ml-1 mr-2 h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to List
      </button>
      
      <div className="bg-white rounded-lg overflow-hidden">
        <div className="border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-bold text-gray-800">{task.title}</h2>
          <div className="mt-2 flex flex-wrap gap-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-sm">
              Due: {task.dueDate}
            </span>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-sm ${
              task.status === 'Pending' 
                ? 'bg-yellow-100 text-yellow-800' 
                : 'bg-green-100 text-green-800'
            }`}>
              {task.status}
            </span>
          </div>
        </div>
        
        <div className="py-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Description</h3>
          <div className="bg-gray-50 p-4 rounded-md text-gray-700 whitespace-pre-wrap">
            {task.description}
          </div>
        </div>
        
        <div className="pt-4 flex justify-end">
          <button
            onClick={toggleStatus}
            className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
              task.status === 'Pending'
                ? 'bg-green-500 hover:bg-green-600'
                : 'bg-yellow-500 hover:bg-yellow-600'
            }`}
          >
            {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
          </button>
        </div>
      </div>
    </div>
    );
  }
  
  export default TaskDetail;