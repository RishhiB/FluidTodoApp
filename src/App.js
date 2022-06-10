import React, { useState, useEffect } from "react";
import Form from "./components/Form";
import Todo from "./components/Todo";
import { getMyMap, todoKey, inputKey } from "./components/FluidMap";
import "./App.css";

export default () => {
  const [tasks, setTasks] = useState(undefined);

  const [formInput, setFormInput] = useState("");

  const [fluidMap, setFluidMap] = useState(undefined);

  const setTodo = (todos) => fluidMap.set(todoKey, todos);
  const setInput = (input) => fluidMap.set(inputKey, input);

  useEffect(() => {
    getMyMap().then((myMap) => setFluidMap(myMap));
  }, []);

  useEffect(() => {
    if (fluidMap === undefined) return;
    // sync Fluid data into view state
    const syncView = () => {
      setTasks(fluidMap.get(todoKey));
      setFormInput(fluidMap.get(inputKey));
    };
    // ensure sync runs at least once
    syncView();
    // update state each time our map changes
    fluidMap.on("valueChanged", syncView);
    // turn off listener when component is unmounted
    return () => {
      fluidMap.off("valueChanged", syncView);
    };
  }, [fluidMap]);

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formInput == "") return;
    const date = new Date().toLocaleDateString();
    const newTask = {
      date: date,
      task: formInput,
      completed: false,
    };
    setTodo([...tasks, newTask]);
    setInput("");
  };

  const handleComplete = (index) => {
    const newTasks = [...tasks];
    newTasks[index].completed = !newTasks[index].completed;
    setTodo(newTasks);
  };

  const handleRemove = (index) => {
    const newTasks = [...tasks];
    newTasks.splice(index, 1);
    setTodo(newTasks);
  };

  const handleRemoveAll = () => {
    setTodo([]);
  };

  if (!tasks) return <div />;
  return (
    <div className="App">
      <Form
        formInput={formInput}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
      />
      <Todo
        tasks={tasks}
        handleComplete={handleComplete}
        handleRemove={handleRemove}
        handleRemoveAll={handleRemoveAll}
      />
    </div>
  );
};
