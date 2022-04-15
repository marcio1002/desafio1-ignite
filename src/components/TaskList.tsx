import { useEffect, useState } from "react";

import "../styles/tasklist.scss";

import { FiTrash, FiCheckSquare, FiEdit } from "react-icons/fi";

export interface Task {
  id: number;
  title: string;
  isComplete: boolean;
  editable: boolean;
}

export interface TaskEdit {
  id: number;
  title: string;
}

export function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [edit, setEdit] = useState<TaskEdit[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState("");

  useEffect(() => {
    setEdit(tasks.map(({ id, title }) => ({ id, title })));
  }, [tasks]);

  function handleCreateNewTask() {
    if (newTaskTitle.trim()?.length <= 0) return;

    const newTask: Task = {
      id: Math.floor(Math.random() * (10000000000 - 0)) + 0,
      title: newTaskTitle,
      isComplete: false,
      editable: false,
    };

    setTasks([...tasks, newTask]);
    setNewTaskTitle("");
  }

  function handleToggleTaskCompletion(id: number) {
    const changeTask = tasks.map((task: Task) => {
      if (task.id === id) {
        task.isComplete = !task.isComplete;
      }

      return task;
    });

    setTasks(changeTask);
  }

  function handleRemoveTask(id: number) {
    const changeTask = tasks.filter((task: Task) => task.id != id);
    setTasks(changeTask);
  }

  function changeTextEdit(id: number, text: string) {
    const textTaskEditable = edit.map((task: TaskEdit) => {
      if (task.id === id) {
        task.title = text;
      }
      return task;
    });

    setEdit(textTaskEditable);
  }

  function handleEditTask(id: number) {
    const changeEditableTask = tasks.map((task: Task) => {
      if (task.id === id) {
        task.editable = !task.editable;
      }

      return task;
    });

    setTasks(changeEditableTask);
  }

  function handleUpdateTask(id: number) {
    const changeTasks = tasks.map((task) => {
      const editableTask = edit.find((task) => task.id === id);

      if (
        editableTask &&
        editableTask.title.trim()?.length > 0 &&
        task.title !== editableTask.title
      ) {
        task.title = editableTask.title;
      }

      return task;
    });

    setTasks(changeTasks);
    handleEditTask(id);
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
            type="button"
            data-testid="add-task-button"
            onClick={handleCreateNewTask}
          >
            <FiCheckSquare size={16} color="#fff" />
          </button>
        </div>
      </header>

      <main>
        <ul>
          {tasks.map((task, i) => (
            <li key={task.id.toString()}>
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
                  {task.editable == true ? (
                    <input
                      type="text"
                      className="edit-task-input"
                      data-testid="edit-task-input"
                      value={edit.find((e) => e.id === task.id)?.title}
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
