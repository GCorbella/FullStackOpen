import React from 'react'
import { useState, useEffect } from 'react'

import personsService from "./services/persons"

import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Filter from './components/Filter'
import Notification from './components/Notification'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newFilter, setNewFilter] = useState('')
  const [errorMessage, setErrorMessage] = useState('some error happened...')

  useEffect(() => {
    personsService
      .getAll()
      .then(response => {
        setPersons(response.data)
      })
  }, [])

  const handleNameChange = (e) => setNewName(e.target.value)
  const handleNumberChange = (e) => setNewNumber(e.target.value)
  const handleFilterChange = (e) => setNewFilter(e.target.value)

  const filteredPersons = persons.filter(person => person.name.toLowerCase().includes(newFilter.toLowerCase()))

  const addPerson = (event) => {
    event.preventDefault()

    const personObject = {
      name: newName,
      number: newNumber
    }

    if (persons.find(e => e.name === newName)) {
      const personUpdated = persons.find(person => person.name === newName)
      if (window.confirm(`Do you want to change ${personUpdated.name} number?`)) {
        personsService.update(personUpdated.id, personObject)
          .then((response) => {
            setPersons(persons.map(person =>
              person.id === personUpdated.id ? response.data : person
            ))
            setNewName('');
            setNewNumber('');
          })
          .catch(error => {
            setErrorMessage(
              `Note '${note.content}' was already removed from server`
            )
            setTimeout(() => {
              setErrorMessage(null)
            }, 5000)
          })
      }
    }
    else if (persons.find(e => e.number === newNumber)) {
      alert(`${newNumber} is already added to phonebook`)
    }
    else {
      personsService
        .create(personObject)
        .then(response => {
          setPersons(persons.concat(response.data))
          setNewName('')
          setNewNumber('')
        })
    }

  }

  const deletePerson = (id) => {
    const personToDelete = persons.find(person => person.id === id)
    if (window.confirm(`Do you really want to delete ${personToDelete.name}?`)) {
      personsService.eliminate(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
        .catch(error => {
          setErrorMessage(
            `Contact '${personToDelete.name}' was already removed from server`
          )
          setTimeout(() => {
            setErrorMessage(null)
          }, 5000)
        })
    }
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification message={errorMessage} />
      <Filter
        handleFilterChange={(e) => handleFilterChange(e)}
      ></Filter>
      <h2>Add a New</h2>
      <PersonForm
        handleNameChange={(e) => handleNameChange(e)}
        handleNumberChange={(e) => handleNumberChange(e)}
        addPerson={(e) => addPerson(e)}
      >
      </PersonForm>
      <h2>Numbers</h2>
      <Persons
        persons={filteredPersons}
        deletePerson={(e) => deletePerson(e)}
      >
      </Persons>
    </div>
  )
}

export default App