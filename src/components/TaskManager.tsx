import { useState } from "react";
import { motion } from "framer-motion";
import Window from "./Window";

function TaskManager({ onClose, onFocus, isActive }: { onClose: () => void; onFocus?: () => void; isActive?: boolean }) {
  const [tasks, setTasks] = useState([
    { id: 1, name: "Update system", progress: 75, status: "running" },
    { id: 2, name: "Download drivers", progress: 45, status: "running" },
    { id: 3, name: "Install language pack", progress: 0, status: "pending" },
    { id: 4, name: "Clean cache", progress: 0, status: "pending" },
  ]);

  const cancelTask = (id: number) => {
    setTasks(tasks.filter(t => t.id !== id));
  };

  return (
    <Window
      title="Task Manager"
      icon="📋"
      isActive={isActive ?? true}
      defaultSize={{ width: 550, height: 480 }}
      minSize={{ width: 450, height: 400 }}
      onClose={onClose}
      onFocus={onFocus ?? (() => {})}
    >
      <div className="task-manager">
        <div className="task-header">
          <span>Task</span>
          <span>Progress</span>
          <span>Action</span>
        </div>
        {tasks.map((task) => (
          <motion.div
            key={task.id}
            className="task-item"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="task-name">
              <span className={`task-status ${task.status}`}>
                {task.status === "running" ? "🔄" : "⏳"}
              </span>
              {task.name}
            </div>
            <div className="task-progress">
              <div className="task-progress-bar">
                <motion.div
                  className="task-progress-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${task.progress}%` }}
                />
              </div>
              <span>{task.progress}%</span>
            </div>
            <button className="task-cancel" onClick={() => cancelTask(task.id)}>✕</button>
          </motion.div>
        ))}
      </div>
    </Window>
  );
}

export default TaskManager;