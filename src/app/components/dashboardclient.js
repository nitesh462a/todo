'use client';

import { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../logout/page';
import toast from 'react-hot-toast';

export default function DashboardClient() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState("");
const [rem, setRem] = useState([]);
  const clearAll = async ()=>{
    const isconfirm =window.confirm("do yo want to delete all");
    if(isconfirm){
      try {
       
      await axios.delete("/api/todos/deleteall");
      fetchTodos();
      toast.success("delete all successfully");

    } catch (err) {
      console.error("❌ Error deletingall todo:", err);
    }

    }
  }

 
  const fetchTodos = async () => {
    try {
      const res = await axios.get("/api/todos");
setRem(res.data.filter(t=>(t.completed ===false)))
      setTodos(res.data);
      
      console.log(todos)
    } catch (err) {
      console.error("❌ Error fetching todos:", err);
    }
  };

  useEffect(() => {
    fetchTodos();
    
    
  }, []);

  const addTodo = async () => {
    if (!text.trim()) return;

    try {
      await axios.post("/api/todos", { text });
      setText("");
      fetchTodos();
    } catch (err) {
      console.error("❌ Error adding todo:", err);
    }
  };

  const toggle = async (todo) => {
    try {
      await axios.put("/api/todos", {
        _id: todo._id,
        completed: !todo.completed
      });
      fetchTodos();
    } catch (err) {
      console.error("❌ Error toggling todo:", err);
    }
  };


  const del = async (_id) => {
    const isconfirm =window.confirm("do yo want to delete this");
    if(isconfirm){
      try {
      await axios.delete("/api/todos", {
        data: { _id },
      });
      fetchTodos();
       toast.success("delete successfully");
    } catch (err) {
      console.error("❌ Error deleting todo:", err);
    }}
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6 space-y-6">
      <div className="bg-white shadow-md rounded-lg p-4 w-full max-w-xl">
        <h2 className="text-3xl font-bold text-blue-700 text-center mb-4">📝 To-Do Dashboard</h2>

        <div className="flex gap-2 mb-4">
          <input
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="New task..."
            className="flex-1 px-4 py-2 border w-1 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <button
            onClick={addTodo}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Add
          </button>
        </div>

        <ul className="space-y-3">
          {todos.map(t => (
            <li key={t._id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg shadow-sm">
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={t.completed}
                  onChange={() => toggle(t)}
                  className="h-5 w-5 accent-blue-600"
                />
                <span className={`text-lg ${t.completed ? "line-through text-gray-400" : ""}`}>
                  {t.text}
                </span>
              </div>
              <button
                onClick={() => del(t._id)}
                className="text-red-500 hover:text-red-700 text-xl"
                title="Delete"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>

        {todos.length === 0 ? 
         ( <p className="text-center text-gray-500 mt-4">No tasks added yet.</p>)
      :

       ( <div className='flex justify-between mt-2.5 text-blue-600'>
          <p>{rem.length} Task remaining</p>
          <h3 onClick={clearAll}>delete All</h3>
        </div>)}
      </div>

     
      <div className="bg-white p-4 rounded shadow max-w-xl w-full">
      
      

 


      </div>

      <LogoutButton />
    </div>
  );
}
