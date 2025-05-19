function TaskDetail({ task, setSelectedTask, socket }) {
    const toggleStatus = async () => {
      try {
        await fetch(`http://localhost:5000/api/tasks/${task.id}`, {
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
      <div className="p-4 border rounded">
        <button
          onClick={() => setSelectedTask(null)}
          className="mb-4 p-2 bg-gray-300 rounded"
        >
          Back
        </button>
        <h2 className="text-2xl font-bold">{task.title}</h2>
        <p className="my-2">{task.description}</p>
        <p>Due: {task.dueDate}</p>
        <p>Status: {task.status}</p>
        <button
          onClick={toggleStatus}
          className={`mt-4 p-2 rounded ${
            task.status === 'Pending' ? 'bg-green-500' : 'bg-yellow-500'
          } text-white`}
        >
          {task.status === 'Pending' ? 'Mark Completed' : 'Mark Pending'}
        </button>
      </div>
    );
  }
  
  export default TaskDetail;