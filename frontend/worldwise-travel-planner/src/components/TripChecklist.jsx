import React, { useState } from "react";

export default function TripChecklist() {
  const [checklistItems, setChecklistItems] = useState([]);
  const [newItem, setNewItem] = useState("");

  const handleAddItem = (e) => {
    e.preventDefault();
    if (newItem.trim() === "") return;
    setChecklistItems([...checklistItems, { id: Date.now(), text: newItem, completed: false }]);
    setNewItem("");
  };

  const handleToggleComplete = (id) => {
    setChecklistItems(
      checklistItems.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const handleDeleteItem = (id) => {
    setChecklistItems(checklistItems.filter((item) => item.id !== id));
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4">Trip Checklist</h3>
      <form onSubmit={handleAddItem} className="flex space-x-2 mb-4">
        <input
          type="text"
          value={newItem}
          onChange={(e) => setNewItem(e.target.value)}
          placeholder="Add a new checklist item"
          className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Add
        </button>
      </form>
      <ul className="space-y-2">
        {checklistItems.length === 0 ? (
          <p className="text-gray-500">No checklist items yet. Add some tasks!</p>
        ) : (
          checklistItems.map((item) => (
            <li
              key={item.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-md"
            >
              <span
                className={`flex-1 cursor-pointer ${item.completed ? "line-through text-gray-500" : ""}`}
                onClick={() => handleToggleComplete(item.id)}
              >
                {item.text}
              </span>
              <button
                onClick={() => handleDeleteItem(item.id)}
                className="ml-4 text-red-600 hover:text-red-800"
              >
                Delete
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
