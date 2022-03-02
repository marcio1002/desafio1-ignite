import { useState, useEffect } from "react";

export interface Task {
  id: number;
  title: string;
  isComplete: boolean;
}

export function useStorageTask(key: string, initialValue: Task[]) {
  const [storedTask, setStoredTask] = useState<Task[]>(() => {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : initialValue;
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(storedTask));
  }, [storedTask]);

  function updateTask(changeTask: Task[]) {
    setStoredTask(changeTask);
  }

  return {
    storedTask,
    updateTask,
  };
}
