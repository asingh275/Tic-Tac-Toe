import React from 'react'

const Square = (props) => {
  return (
    <div className='square col-md-4 col-sm-4' onClick={props.selectSquare}>{props.value}</div>
  )
}

export default Square