"use client";

import React, { useState, useEffect } from "react";
import ButtonCommon from "@/app/components/commonComponents/ButtonCommon";
import InputCommon from "@/app/components/commonComponents/InputCommon";
import SelectCommon from "@/app/components/commonComponents/SelectCommon";
import {
  createTodoService,
  listTodoService,
  deleteTodoService,
  markCompletedTodoService,
  updateTodoService,
} from "@/app/services/todo";

// Utility function to format date (only date, no time)
const formatDate = (dateString) => {
  const date = new Date(dateString);
  const options = { year: "numeric", month: "short", day: "numeric" };
  return date.toLocaleDateString("en-US", options);
};

const formatInputDate = (dateString) => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export default function TodoList() {
  const [todo, setTodo] = useState("");
  const [priority, setPriority] = useState("medium");
  const [endDate, setEndDate] = useState("");
  const [todos, setTodos] = useState([]);
  const [editId, setEditId] = useState(null); // For tracking which todo is being edited

  const resetForm = () => {
    setTodo("");
    setPriority("medium");
    const today = new Date();
    const defaultEndDate = new Date(today.setDate(today.getDate() + 7));
    setEndDate(formatInputDate(defaultEndDate)); // Default to 7 days from today
  };
    

  useEffect(() => {
    resetForm(); // Initialize form with default values
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await listTodoService();
      setTodos(response);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  const addOrUpdateTodo = async () => {
    if (!todo || !endDate) {
      alert("Please fill in all fields");
      return;
    }
  
    const payload = { task: todo, priority, endDate, status: "pending" };
  
    try {
      if (editId) {
        await updateTodoService(editId, payload);
        setEditId(null); // Clear edit mode
      } else {
        await createTodoService(payload);
      }
  
      resetForm();
      fetchTodos();
    } catch (error) {
      console.error("Error saving todo:", error.message);
    }
  };
  

  const startEditing = (todo) => {
    setEditId(todo._id);
    setTodo(todo.task);
    setPriority(todo.priority);
    setEndDate(formatInputDate(todo.endDate)); // Format date for input
  };

  const cancelEditing = () => {
    setEditId(null);
    setTodo("");
    setPriority("medium");
    setEndDate("");
  };

  const markCompleted = async (id) => {
    try {
      await markCompletedTodoService(id);
      fetchTodos();
    } catch (error) {
      console.error("Error marking todo as completed:", error.message);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await deleteTodoService(id);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  return (
    <div className="px-4 sm:px-8 flex flex-col items-center min-h-[90vh] justify-start h-screen mt-6 w-[100%] mx-auto">
      <div className="w-[100%] flex flex-wrap gap-4 max-w-[600px] mx-auto items-center">
        <InputCommon
          placeholder="Write Todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <SelectCommon
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          options={[
            { label: "High", value: "high" },
            { label: "Medium", value: "medium" },
            { label: "Low", value: "low" },
          ]}
          className="flex-1 min-w-[150px]"
        />
        <InputCommon
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <ButtonCommon
          label={editId ? "Update" : "Add"}
          className={`${
            editId ? "bg-yellow-500" : "bg-blue-500"
          } text-white px-4 py-2 rounded`}
          onClick={addOrUpdateTodo}
        />
        {editId && (
          <ButtonCommon
            label="Cancel"
            className="bg-gray-500 text-white px-4 py-2 rounded"
            onClick={cancelEditing}
          />
        )}
      </div>

      <div className="w-[100%] max-w-[800px] mx-auto flex flex-col gap-4 mt-6">
        {todos.length === 0 ? (
          <p className="text-center text-gray-500">No todos found</p>
        ) : (
          todos.map((item) => (
            <div
              key={item._id}
              className={`flex flex-wrap items-center justify-between bg-gray-100 shadow-sm p-4 rounded-lg ${
                item.status === "completed" ? "opacity-60 line-through" : ""
              }`}
            >
              <div className="flex-1">
                <p className="font-bold">{item.task}</p>
                <p className="text-sm text-gray-500">
                  Priority: {item.priority.toUpperCase()} | Due: {formatDate(item.endDate)}
                </p>
                <p className="text-sm text-gray-400">
                  Created: {formatDate(item.createdAt)}
                </p>
              </div>
              <div className="flex gap-2">
                {item.status !== "completed" && (
                  <ButtonCommon
                    label="Complete"
                    className="bg-green-500 text-white px-3 py-1 rounded"
                    onClick={() => markCompleted(item._id)}
                  />
                )}
                {item.status !== "completed" && !editId && (
                  <ButtonCommon
                    label="Edit"
                    className="bg-yellow-500 text-white px-3 py-1 rounded"
                    onClick={() => startEditing(item)}
                  />
                )}
                <ButtonCommon
                  label="Delete"
                  className="bg-red-500 text-white px-3 py-1 rounded"
                  onClick={() => deleteTodo(item._id)}
                />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
