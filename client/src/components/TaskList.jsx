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
      <div>
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="p-4 border rounded flex justify-between">
              <div onClick={() => setSelectedTask(task)} className="cursor-pointer">
                <h3 className="font-bold">{task.title}</h3>
                <p>{task.description.substring(0, 50)}...</p>
                <p>Due: {task.dueDate}</p>
                <p>Status: {task.status}</p>
              </div>
              <button
                onClick={() => toggleStatus(task)}
                className={`p-2 rounded ${
                  task.status === 'Pending' ? 'bg-green-500' : 'bg-yellow-500'
                } text-white`}
              >
                {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
              </button>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage(currentPage + 1)}
            className="p-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>
    );
  }
  
  export default TaskList;