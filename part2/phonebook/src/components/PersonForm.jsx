import React from 'react'

const PersonForm = ({ handleNameChange, addPerson }) => {

    return (
        <form onSubmit={addPerson}>
            <div>
                name: <input onChange={handleNameChange} />
            </div>
            <div>
                <button type="submit">add</button>
            </div>
        </form>
    )
}

export default PersonForm