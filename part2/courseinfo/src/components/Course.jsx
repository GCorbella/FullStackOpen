import React from 'react'

const Course = ({ course }) => {
  return (
    <div>
      <Header name={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

const Header = ({ name }) => {
  return (
    <h1>
      {name}
    </h1>
  )
}

const Content = ({parts}) => {
  const partElements = parts.map(e => <Part key={e.id} part={e}></Part>)

  return (
    <div>
      {partElements}
    </div>
  )
}

const Part = ({part}) => {
  return (
    <p>
        {part.name} {part.exercises}
    </p>
  )
}

const Total = ({parts}) => {
  const totalExercises = parts.reduce((i, part) => i + part.exercises, 0)

  return (
    <div>
      <p>Number of exercises {totalExercises}</p>
    </div>
  )
}

export default Course