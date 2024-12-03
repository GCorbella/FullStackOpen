import React from 'react'

const Notification = ({ message }) => {

    if (message.includes("rror")) {
        return (
            <div className="error">
                {message}
            </div>
        )
    } else if (message.includes("dded")) {
        return (
            <div className="notification">
                {message}
            </div>
        )
    } else {
        return null
    }
}

export default Notification