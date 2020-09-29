import React, { Component } from 'react';
import AppHeader from "../AppHeader";
import SearchPanel from "../SearchPanel";
import TodoList from "../TodoList";
import './app.css';
import ItemStatusFilter from "../ItemStatusFilter";
import ItemAddForm from "../ItemAddForm";

export default class App extends Component {

  maxId = 100;
  state = {
    todoData: [
      this.createTodoItem('Drink Coffee'),
      this.createTodoItem('Make Awesome App'),
      this.createTodoItem('Have a lunch')
    ],
    term: '',
    filter: 'all '
  };

  createTodoItem(label) {
    return {
      label,
      important: false,
      done: false,
      id: this.maxId++
    }
  };

  onDeleted = (id) => {
    this.setState(({ todoData }) => {
        // Первый способ
      const idx = todoData.findIndex(el => el.id === id);
      const before = todoData.slice(0, idx);
      const after = todoData.slice(idx + 1);
      const newArray = [...before, ...after];

      return {
        todoData: newArray
      };
        // Второй способ
      // const newArray = [...todoData];
      // newArray.splice(idx, 1);
        // Третий способ
      // const newArray = todoData.filter(el => el.id !== id);
    });
  };
  addItem = (text) => {
    if(text === '') {
      return null;
    }
    const newItem = this.createTodoItem(text);
    this.setState(({ todoData }) => {
      const newArr = [...todoData, newItem];
      return {
        todoData: newArr
      };
    });
  };

  toggleProperty(arr, id, propName) {
      const idx = arr.findIndex(el => el.id === id);
      const oldItem = arr[idx];
      const  newItem = {
        ...oldItem,
        [propName]: !oldItem[propName]
      };
      return [
        ...arr.slice(0, idx),
        newItem,
        ...arr.slice(idx + 1)
      ];
  };

  onToggleDone = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'done')
      };
    });
  };
  onToggleImportant = (id) => {
    this.setState(({ todoData }) => {
      return {
        todoData: this.toggleProperty(todoData, id, 'important')
      };
    });
  };

  onSearchChange = (term) => {
    this.setState({ term });
  };
  onFilterChange = (filter) => {
    this.setState({ filter });
  };

  search(items, term) {
    if(term.length === 0) {
      return items
    }
    return items.filter(item => {
      return item.label.toLowerCase().indexOf(term.toLowerCase()) > -1;
    })
  };

  filter(items, filter) {
    switch (filter) {
      case 'all':
        return items;
      case 'active':
        return items.filter(item => !item.done);
      case 'done':
        return items.filter(item => item.done);
      default:
        return items;
    }
  };


  render() {
    const { todoData, term, filter } = this.state;
    const visibleItem = this.filter(this.search(todoData, term), filter);
    const doneCount = todoData.filter(el => el.done === true).length;
    const todoCount = todoData.length - doneCount;
    return (
      <div className="todo-app">
        <AppHeader toDo={todoCount} done={doneCount}/>
        <div className="top-panel d-flex">
          <SearchPanel term={term} onSearchChange={this.onSearchChange}/>
          <ItemStatusFilter onFilterChange={this.onFilterChange} filter={filter}/>
        </div>
        <TodoList
          todos={visibleItem}
          onDeleted={this.onDeleted}
          onToggleImportant={this.onToggleImportant}
          onToggleDone={this.onToggleDone}
        />
        <ItemAddForm onItemAdded={this.addItem}/>
      </div>
    );
  }
}