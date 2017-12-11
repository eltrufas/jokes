import React from 'react'
import { connect } from 'react-redux'
import { setPage} from '../actions/user'

const JokeStub = ({ joke, openJoke, fontSize }) => (
  <div>
  <a onClick={() => openJoke('joke', joke.id)} href="#">
  <h2 style={{ fontSize: fontSize || '' }}>{ joke.title }</h2>
  </a>
  </div>
)

export default connect((state, ownProps) => {
  return {joke: state.recommendations[ownProps.jokeId]}
}, {openJoke: setPage})(JokeStub)
