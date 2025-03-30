import { createSlice } from '@reduxjs/toolkit';

// Get initial state from local storage if available
const savedState = localStorage.getItem('gotaskState');
const initialState = savedState ? JSON.parse(savedState) : {
  tasks: [],
  boards: [
    { id: 'home', name: 'Home', color: 'primary' },
    { id: 'work', name: 'Work', color: 'secondary' },
    { id: 'school', name: 'School', color: 'info' },
    { id: 'fitness', name: 'Fitness', color: 'success' },
    { id: 'shopping', name: 'Shopping', color: 'warning' },
  ],
  filters: {
    status: 'all',
    board: 'all',
    priority: 'all',
    sortBy: 'dueDate',
    dateRange: {
      startDate: '',
      endDate: ''
    }
  },
};

const taskSlice = createSlice({
  name: 'tasks',
  initialState,
  reducers: {
    addTask: (state, action) => {
      state.tasks.push(action.payload);
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    updateTask: (state, action) => {
      const index = state.tasks.findIndex(task => task.id === action.payload.id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    deleteTask: (state, action) => {
      state.tasks = state.tasks.filter(task => task.id !== action.payload);
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    toggleTaskComplete: (state, action) => {
      const task = state.tasks.find(task => task.id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    updateFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    addBoard: (state, action) => {
      state.boards.push(action.payload);
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    updateBoard: (state, action) => {
      const index = state.boards.findIndex(board => board.id === action.payload.id);
      if (index !== -1) {
        state.boards[index] = action.payload;
      }
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
    deleteBoard: (state, action) => {
      // Move tasks from deleted board to Home board
      state.tasks.forEach(task => {
        if (task.board === action.payload) {
          task.board = 'home';
        }
      });
      
      // Remove the board
      state.boards = state.boards.filter(board => board.id !== action.payload);
      
      localStorage.setItem('gotaskState', JSON.stringify(state));
    },
  },
});

export const { 
  addTask, 
  updateTask, 
  deleteTask, 
  toggleTaskComplete, 
  updateFilters,
  addBoard,
  updateBoard,
  deleteBoard,
} = taskSlice.actions;

export default taskSlice.reducer; 