import { useEffect, useState } from "react";
import { useStorageTask, Task } from "../hooks/useStorageTask";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare, FiEdit } from "react-icons/fi";

interface TaskEditableProps {
  id: number;
  title: string;
  editable: boolean;
}

export function TaskList() {
  const { storedTask, updateTask } = useStorageTask("storageToDoTask", []);
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [edit, setEdit] = useState<TaskEditableProps[]>([]);

  useEffect(() => {
    setEdit(
      storedTask.map(({ id, title }) => ({ id, title, editable: false }))
    );
  }, [storedTask]);

  function handleCreateNewTask() {
    if (newTaskTitle.trim().length == 0) return;

    const newTask: Task = {
      id: Math.floor(Math.random() * (10000000000 - 0)) + 0,
      title: newTaskTitle,
      isComplete: false,
    };

    updateTask([...storedTask, newTask]);
    setNewTaskTitle("");
  }

  function handleToggleTaskCompletion(id: number) {
    const changeTask = storedTask.map((task: Task) => {
      if (task.id === id) {
        task.isComplete = !task.isComplete;
      }

      return task;
    });

    updateTask(changeTask);
  }

  function handleRemoveTask(id: number) {
    const changeTask = storedTask.filter((task: Task) => task.id !== id);
    updateTask(changeTask);
  }

  function changeTextEdit(id: number, text: string) {
    const textTaskEditable = edit.map((task: TaskEditableProps) => {
      if (task.id === id) {
        task.title = text;
      }
      return task;
    });

    setEdit(textTaskEditable);
  }

  function handleEditTask(id: number) {
    const changeEditableTask = edit.map((task: TaskEditableProps) => {
      if (task.id === id) {
        task.editable = !task.editable;
      }

      return task;
    });
    setEdit(changeEditableTask);
  }

  function handleUpdateTask(id: number) {
    const newStoredTask = storedTask.map((task: Task) => {
      const taskEditable = edit.find((x) => task.id === x.id);
      if (taskEditable && task.title !== taskEditable.title) {
        task.title = taskEditable.title;
      }

      return task;
    });

    updateTask(newStoredTask);
    setTimeout(() => handleEditTask(id), 200);
  }

  return (
    <section className="task-list container">
      <header>
        <h2>Minhas tasks</h2>

        <div className="input-group">
          <input
            type="text"
            placeholder="Adicionar novo todo"
            onChange={(e) => setNewTaskTitle(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleCreateNewTask()}
            value={newTaskTitle}
          />
          <button
            type="submit"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {storedTask.map((task, i) => (
            <li key={task.id}>
              <div
                className={task.isComplete ? "completed" : ""}
                data-testid="task"
              >
                <label className="checkbox-container">
                  <input
                    type="checkbox"
                    readOnly
                    checked={task.isComplete}
                    onClick={() => handleToggleTaskCompletion(task.id)}
                  />
                  <span className="checkmark"></span>
                </label>

                <p>
                  {edit[i]?.editable == true ? (
                    <input
                      className="task-edit"
                      type="text"
                      value={edit[i].title}
                      onChange={(e) => changeTextEdit(task.id, e.target.value)}
                      onBlur={() => handleUpdateTask(task.id)}
                    />
                  ) : (
                    task.title
                  )}
                </p>
              </div>

              <div>
                <button
                  type="button"
                  data-testid="edit-task-button"
                  className="edit-task-button"
                  onClick={() => handleEditTask(task.id)}
                >
                  <FiEdit size={16} />
                </button>

                <button
                  type="button"
                  data-testid="remove-task-button"
                  className="remove-task-button"
                  onClick={() => handleRemoveTask(task.id)}
                >
                  <FiTrash size={16} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </section>
  );
}
