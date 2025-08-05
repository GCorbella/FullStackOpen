import React from 'react'

const Notification = ({ message }) => {
  if (!message) {
    return null
  }

  const isError = message.toLowerCase().includes('rror') || message.includes("rong")
  const isSuccess = message.toLowerCase().includes('dded') || message.toLowerCase().includes('changed')

  const className = isError
    ? 'error'
    : isSuccess
      ? 'notification'
      : ''

  return (
    <div className={className}>
      {message}
    </div>
  )
}

export default Notification