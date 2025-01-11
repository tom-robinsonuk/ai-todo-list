const express = require('express');
const app = express();
const PORT = 3000;
const fs = require('fs');
const path = require('path');

//////////////////////
// Server Functions \\
//////////////////////

// Middleware to parse JSON
app.use(express.json());

// Test Route
app.get('/', (req, res) => {
    res.send('AI-Driven To-Do List is running!');
});

// Start the server 
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Path to tasks.json
const tasksFile = path.join(__dirname, 'tasks.json');

///////////////////////
// Utility Functions \\
///////////////////////

// Read tasks from JSON file
const readTasks = () => {

    // create the file if it doesn't exist. 
    if(!fs.existsSync(tasksFile)) {
        fs.writeFileSync(tasksFile, JSON.stringify([])); 
    }
    return JSON.parse(fs.readFileSync(tasksFile, 'utf8'));
};

// Write tasks to JSON file
const writeTasks = (tasks) => {
    fs.writeFileSync(tasksFile, JSON.stringify(tasks, null, 2));
};

///////////////////
// API Endpoints \\
///////////////////

// Get All Tasks
app.get('/getAllTasks', (req, res) => {
    const tasks = readTasks();
    res.json(tasks);
});

// Add a Task
app.post('/addTask', (req, res) => {
    const tasks = readTasks(); // Read existing tasks from tasks.json
    const newTask = { 
        id: Date.now(), // Generate a unique ID
        ...req.body     // Spread operator to include all properties from the incoming JSON
    };
    tasks.push(newTask); // Add the new task to the array
    writeTasks(tasks);   // Save the updated array to tasks.json
    res.status(201).json(newTask); // Respond with the newly created task
});

// Update a Task
app.put('/updateTask', (req, res) => {
    const tasks = readTasks();
    const { id, ...updates } = req.body; // Destructure id and the rest of the updates

    // Find the task by ID
    const taskIndex = tasks.findIndex(task => task.id === id);

    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }

    // Update the task
    tasks[taskIndex] = { ...tasks[taskIndex], ...updates };
    writeTasks(tasks);
    res.json(tasks[taskIndex]);
});

// Delete a Task by ID
app.delete('/deleteTask', (req, res) => {
    const tasks = readTasks();
    const { id } = req.body; // Extract the id from the request body

    // Filter out the task with the matching ID
    const updatedTasks = tasks.filter(task => task.id !== id);

    if (tasks.length === updatedTasks.length) {
        return res.status(404).json({ error: 'Task not found' });
    }

    writeTasks(updatedTasks); // Save the updated list to tasks.json
    res.json({ message: 'Task successfully deleted' }); // Return a confirmation message
});

// Delete all tasks
app.delete('/deleteAllTasks', (req, res) => {
    writeTasks([]); // Overwrite tasks.json with an empty array
    res.status(204).send(); // Respond with 204 No Content
});