import React from 'react';
import { connect } from 'react-redux';
import { RingLoader } from 'react-spinners';
import JokeStub from './JokeStub'
import { rateJoke } from '../actions/user'


const RatingPane = ({ onUpvote, onDownvote }) => {
  console.log(onUpvote)
return (
  <div className="row">
    <div className="col-md-6">
      <button type="button"
        className="btn btn-block btn-primary btn-success"
        style={{padding: '10px 0'}}
        onClick={onUpvote}
      >
        <div><b>Great joke</b></div>
        <div style={{fontSize: '0.8em'}}>I want to see more like this.</div>
      </button>
    </div>
    <div className="col-md-6">
      <button type="button"
        className="btn btn-block btn-primary btn-danger"
        style={{padding: '10px 0'}}
        onClick={onDownvote}
      >
        <div><b>Terrible joke</b></div>
        <div style={{fontSize: '0.8em'}}>Show me fewer like this.</div>
      </button>
    </div>
  </div>
)
}

const RecPane = ({similar, recommended}) => (
  <div className="row">
    <div className="col-md-6">
      <h3>Recommended for you</h3>
      {recommended.map(rec => (
        <div>
          <JokeStub jokeId={rec} />
        </div>
      ))}
    </div>
    <div className="col-md-6">
      <h3>Similar jokes</h3>
      {similar.map(rec => (
        <div>
          <JokeStub jokeId={rec} />
        </div>
      ))}
    </div>
  </div>
)

const JokePage = ({ joke, pane_state, items, ...props }) => {
  let footer = null;

  console.log(pane_state)

  switch(pane_state) {
    case 'not_rated':
      footer = <RatingPane
                onUpvote={() => props.rateJoke(joke.id, 1)}
                onDownvote={() => props.rateJoke(joke.id, -1)}
              />
      break;
    case 'loaded_recs':
      footer = <RecPane {...items}/>
      break;
    default:
      footer = (
        <div className="row">
          <div style={{margin: 'auto'}}>
            <RingLoader
              color={'#123abc'}
              loading
            />
          </div>
        </div>
      )
      break;
  }

  return (
    <div>
      <div className="row">
        <div className="col-md-12">
          <h1>{joke.title}</h1>
          <p>{joke.body.split('\n').map(par => <p>{par}</p>)}</p>
        </div>
      </div>

      {footer}

    </div>
  )
}

export default connect((state, ownProps) => {
  let items = {}
  if (state.page.state.state === 'loaded_recs') {
    items = {
      recommended: state.page.state.recs,
      similar: state.page.state.similar
    }
  }

  console.log(items)

  return {
    joke: state.recommendations[state.page.state.joke],
    pane_state: state.page.state.state,
    items
  }
}, { rateJoke })(JokePage)
