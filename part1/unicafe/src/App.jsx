import { useState } from 'react'

const App = () => {
    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGoodClick = () => {
        console.log(good)
        setGood(good + 1)
    }

    const handleNeutralClick = () => {
        setNeutral(neutral + 1)
    }

    const handleBadClick = () => {
        setBad(bad + 1)
    }

    return (
        <div>
            <h1>Give Feedback</h1>
            <Button text='Good' onClickHandler={handleGoodClick}></Button>
            <Button text='Neutral' onClickHandler={handleNeutralClick}></Button>
            <Button text='Bad' onClickHandler={handleBadClick}></Button>
            <Statistics good={good} neutral={neutral} bad={bad}></Statistics>
        </div>
    )
}

const Statistics = ({ good, neutral, bad }) => {
    const sum = good + neutral + bad
    if (sum === 0) {
        return (
            <div>
                <h1>Statistics</h1>
                <p>No feedback given</p>
            </div>
        )
    }

    return (
        <div>
            <h1>Statistics</h1>
            <table>
                <StatisticsLine text='Good' value={good}></StatisticsLine>
                <StatisticsLine text='Neutral' value={neutral}></StatisticsLine>
                <StatisticsLine text='Bad' value={bad}></StatisticsLine>
                <StatisticsLine text='All' value={sum}></StatisticsLine>
                <StatisticsLine text='Average' value={(good * 1 + neutral + 0 + bad * (-1))/sum}></StatisticsLine>
                <StatisticsLine text='Positive' value={`${parseFloat(good / sum) * 100 } %`}></StatisticsLine>
            </table>
        </div>
    )
}

const Button = ({ text, onClickHandler }) => {
    return (
        <div>
            <button onClick={onClickHandler}>{text}</button>
        </div>
    )
}

const StatisticsLine = ({ text, value }) => {
    return (
        <tr>
            <td>{text}</td>
            <td>{value}</td>
        </tr>
    )
}

export default App