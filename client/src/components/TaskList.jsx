function TaskList({
    tasks,
    setSelectedTask,
    currentPage,
    totalPages,
    setCurrentPage,
    fetchTasks,
    socket,
    searchTerm,
  }) {
    const toggleStatus = async (task) => {
      try {
        await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...task,
            status: task.status === 'Pending' ? 'Completed' : 'Pending',
          }),
        });
        fetchTasks(currentPage, searchTerm);
        socket.emit('taskUpdate');
      } catch (error) {
        console.error('Error toggling status:', error);
      }
    };
  
    return (
      <div className="divide-y divide-gray-200">
      {tasks.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          {searchTerm ? 'No tasks match your search' : 'No tasks available. Create your first task!'}
        </div>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li key={task.id} className="hover:bg-gray-50 transition-colors duration-150">
              <div className="p-4 sm:p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div 
                  onClick={() => setSelectedTask(task)} 
                  className="cursor-pointer flex-grow"
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
                  <p className="text-gray-600 mb-2 line-clamp-2">{task.description.substring(0, 100)}...</p>
                  <div className="flex flex-wrap gap-3 text-sm">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      Due: {task.dueDate}
                    </span>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full ${
                      task.status === 'Pending' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {task.status}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => toggleStatus(task)}
                  className={`px-4 py-2 rounded-md text-white font-medium transition-colors duration-200 ${
                    task.status === 'Pending'
                      ? 'bg-green-500 hover:bg-green-600'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      
      {totalPages > 0 && (
        <div className="p-4 flex items-center justify-between bg-gray-50 border-t border-gray-200">
          <button
            disabled={currentPage === 1}
            onClick={() => {
              setCurrentPage(currentPage - 1);
              fetchTasks(currentPage - 1, searchTerm);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Previous
          </button>
          <span className="text-sm text-gray-700">
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => {
              setCurrentPage(currentPage + 1);
              fetchTasks(currentPage + 1, searchTerm);
            }}
            className="px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
    );
  }
  
  export default TaskList;