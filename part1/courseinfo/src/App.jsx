const App = () => {
  const course = {
    name: 'Half Stack application development', 
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }
  

  return (
    <div>
      <Header course={course} />
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

const Header = (props) => {
  console.log(props)
  return(
    <div>
      <h1>{props.course.name}</h1>
    </div>
  )
}

const Content = (props) => {
  console.log(props)

  return(
    <div>
      <Part part={props.parts[0]} />
      <Part part={props.parts[1]}/>
      <Part part={props.parts[2]}/>
    </div>
  )
}

const Total = (props) => {
  console.log(props)
  //I've found that props.parts[0].exercises + props.parts[1].exercises... was quite un-optimal and ugly, so I searched for a cleaner method
  const totalExercises = props.parts.reduce((i, part) => i + part.exercises, 0);

  return(
    <div>
      <p>Number of exercises {totalExercises}</p>
    </div>
  )
}

const Part = (props) => {
  console.log(props)
  return(
    <div>
      <p>
        {props.part.name} {props.part.exercises}
      </p>
    </div>
  )
}

export default App