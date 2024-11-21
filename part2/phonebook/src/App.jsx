import React from 'react'
import { useState } from 'react'
import './components/Filter'
import './components/Persons'
import './components/PersonForm'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setNewFilter(e.target.value)

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons[persons.length-1].id + 1
    }

    if (persons.find(e => e.name === newName)) {
      alert(`${newName} is already added to phonebook`)
    } 
    else if (persons.find(e => e.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
    } 
    else {
      setPersons(persons.concat(personObject))
      setNewName('')
      setNewNumber('')
    }

  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div>debug: {newFilter}</div>
      <Filter
      handleFilterChange={(e) => handleFilterChange(e)}
      ></Filter>
      <h2>Add a New</h2>
      <div>debug: {newName}</div>
      <PersonForm
        handleNameChange={(e) => handleNameChange(e)}
        handleNumberChange={(e) => handleNumberChange(e)}
        addPerson={(e) => addPerson(e)}
      >
      </PersonForm>
      <h2>Numbers</h2>
      <Persons persons={filteredPersons}></Persons>
    </div>
  )
}

export default App