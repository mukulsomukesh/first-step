const asyncHandler = require("express-async-handler");

const Todo = require("../modals/todo.model");

const createTodo = asyncHandler(async (req, res) => {
    const { task,  endDate, priority, status } = req.body;
    const userId = req.user._id; // Access the user ID from the authenticated user in the request

    try {
        const newTodo = new Todo({
            task,
            endDate,
            priority,
            status,
            userId
        });
        await newTodo.save();
        res.status(201).json(newTodo);
    } catch (error) {
        res.status(500).json({ message: "Error creating todo", error });
    }
})

const editTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { task, startDate, endDate, priority, status } = req.body;

    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { task, startDate, endDate, priority, status },
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error editing todo", error });
    }
})

const deleteTodo = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        await Todo.findByIdAndDelete(id);
        res.status(200).json({ message: "Todo deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting todo", error });
    }
})

const getAllTodosByUserId = asyncHandler(async (req, res) => {
    const userId = req.user._id; 
    try {
        const todos = await Todo.find({ userId });
        res.status(200).json(todos);
    } catch (error) {
        res.status(500).json({ message: "Error fetching todos", error });
    }
})

const getTodoById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const todo = await Todo.findById(id);
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(200).json(todo);
    } catch (error) {
        res.status(500).json({ message: "Error fetching todo", error });
    }
})

const markTodoAsCompleted = asyncHandler(async (req, res) => {
    const { id } = req.params;
    try {
        const updatedTodo = await Todo.findByIdAndUpdate(
            id,
            { status: "completed" },
            { new: true }
        );
        res.status(200).json(updatedTodo);
    } catch (error) {
        res.status(500).json({ message: "Error marking todo as completed", error });
    }
})

module.exports = {
    createTodo,
    editTodo,
    deleteTodo,
    getAllTodosByUserId,
    getTodoById,
    markTodoAsCompleted
};
