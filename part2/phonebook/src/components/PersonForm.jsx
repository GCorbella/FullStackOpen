import React from 'react'

const PersonForm = ({ handleNameChange, handleNumberChange, addPerson }) => {

    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input onChange={handleNameChange} />
            </div>
            <div>
                number: <input onChange={handleNumberChange}/>
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm