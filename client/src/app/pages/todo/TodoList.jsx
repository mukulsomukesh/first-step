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
import { IoMdAdd } from "react-icons/io";
import { MdDelete } from "react-icons/md";
import { MdEditDocument } from "react-icons/md";
import { IoCheckmarkDoneCircle } from "react-icons/io5";

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
  const [filters, setFilters] = useState({
    status: "all", // Filter for status (all, completed, pending)
    priority: "all", // Filter for priority (all, high, medium, low)
    dueDate: "", // Filter for due date
  });
  const [isFetching, setIsFetching] = useState(false); // For tracking fetch status
  const [isAdding, setIsAdding] = useState(false); // For tracking add/update status

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
  }, [filters]); // Re-fetch todos when filters change

  const fetchTodos = async () => {
    setIsFetching(true);
    try {
      const response = await listTodoService(filters); // Pass filters to service
      setTodos(response);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    } finally {
      setIsFetching(false);
    }
  };

  const addOrUpdateTodo = async () => {
    if (!todo || !endDate) {
      alert("Please fill in all fields");
      return;
    }

    const payload = { task: todo, priority, endDate, status: "pending" };
    setIsAdding(true);

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
    } finally {
      setIsAdding(false);
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

  // const handleFilterChange = (e) => {
  //   const { name, value } = e.target;
  //   setFilters((prevFilters) => ({
  //     ...prevFilters,
  //     [name]: value,
  //   }));
  // };

  
  return (
    <div className="px-4 sm:px-8 flex flex-col items-center min-h-[90vh] justify-start h-screen mt-6 w-[100%] mx-auto">
      <div className="w-[100%] flex flex-wrap gap-4 max-w-[900px] mx-auto items-end mt-6">
      <div className="lg:w-[450px]" >
        <InputCommon
          label={"Write Todo"}
          placeholder="Write Todo"
          value={todo}
          onChange={(e) => setTodo(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        </div>
        <SelectCommon
          label={"Priority"}
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
          label={"Due Date"}
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="flex-1 min-w-[150px]"
        />
        <ButtonCommon
          label={editId ? "Update" : "Add"}
          variant="solid"
          icon={<IoMdAdd size={20} />}
          onClick={addOrUpdateTodo}
          isLoading={isAdding} // Add loading state to button
        />
        {editId && (
          <ButtonCommon
            label="Cancel"
            variant="danger"
            onClick={cancelEditing}
          />
        )}
      </div>

      {/* Filter Section */}

      <div className="w-[100%] max-w-[900px] mx-auto flex flex-col gap-4 mt-6">
        <p className="text-xl font-bold">List of Todo's</p>

        {todos?.length === 0 && isFetching ? (
          <p className="text-center text-gray-500">Loading...</p>
        ) : todos?.length === 0 ? (
          <p className="text-center text-gray-500">No todos found</p>
        ) : (
          todos?.map((item) => (
            <div
              key={item._id}
              className={`flex flex-col bg-gray-100 shadow-sm p-4 rounded-lg ${
                item.status === "completed" ? "opacity-60 line-through" : ""
              }`}
            >
              {/* First Row - Task Title */}
              <div className="w-full mb-2">
                <p className="font-bold text-lg">{item.task}</p>
              </div>

              {/* Second Row - Info (Priority, Due Date, Created Date) & Buttons */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between w-full">
                {/* Info Section (Priority, Due Date, Created Date) */}
                <div className="flex flex-col sm:flex-row sm:gap-6 sm:items-center w-full sm:w-auto">
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Priority:{" "}
                    <span className="font-semibold">{item.priority.toUpperCase()}</span>
                  </p>
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Due:{" "}
                    <span className="font-semibold">
                      {formatDate(item.endDate)}
                    </span>
                  </p>
                  <p className="text-sm text-gray-500 mb-2 sm:mb-0">
                    Created:{" "}
                    <span className="font-semibold">
                      {formatDate(item.createdAt)}
                    </span>
                  </p>
                </div>
                {/* Buttons Section */}
                <div className="flex gap-2 flex-wrap mt-4 sm:mt-0 sm:ml-auto">
                  {item.status !== "completed" && (
                    <ButtonCommon
                      label="Mark As Complete"
                      variant="success"
                      icon={<IoCheckmarkDoneCircle />}
                      className="px-3 py-1"
                      onClick={() => markCompleted(item._id)}
                    />
                  )}
                  {item.status !== "completed" && !editId && (
                    <ButtonCommon
                      label="Edit"
                      variant="highlight"
                      icon={<MdEditDocument />}
                      className="px-3 py-1"
                      onClick={() => startEditing(item)}
                    />
                  )}
                  <ButtonCommon
                    label="Delete"
                    variant="danger"
                    icon={<MdDelete />}
                    className="px-3 py-1"
                    onClick={() => deleteTodo(item._id)}
                  />
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
