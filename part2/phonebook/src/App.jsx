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
    { name: 'Arto Hellas' }
  ])
  const [newName, setNewName] = useState('')

  const handleNameChange = (e) => setNewName(e.target.value)

  const addPerson = (event) => {
    event.preventDefault()
    const personObject = {
      name: newName
    }
  
    setPersons(persons.concat(personObject))
    setNewName('')
  }

  return (
    <div>
      <Filter></Filter>
      <h2>Phonebook</h2>
      <div>debug: {newName}</div>
      <PersonForm
      handleNameChange={(e) => handleNameChange(e)}
      addPerson={(e) => addPerson(e)}
      >
      </PersonForm>
      <h2>Numbers</h2>
      <Persons persons={persons}></Persons>
    </div>
  )
}

export default App