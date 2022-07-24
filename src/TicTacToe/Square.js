import React from 'react'

const Square = (props) => {
  return (
    <div className='square' onClick={props.selectSquare}>{props.value}</div>
  )
}

export default Square