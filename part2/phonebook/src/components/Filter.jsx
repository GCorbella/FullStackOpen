import React from 'react'

const Filter = ({handleFilterChange}) => {
    return(
        <form>
            <div>
                filter shown with <input onChange={handleFilterChange}/>
            </div>
        </form>
    )
}

export default Filter