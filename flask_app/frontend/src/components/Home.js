import { connect } from 'react-redux';
import JokeStub from './JokeStub';
import React from 'react';


const Home = ({ jokes }) => {
  return (
    <div>
      <div className="row">
        <div className="col-md-12"><h3>Recommended for you</h3></div>
      </div>
      { jokes.map(r => (
        <div className="row" key={r}>
          <div className="col-md-12"><JokeStub jokeId={r} /></div>
        </div>
      )) }
    </div>
  )
};

export default connect(state => ({
  jokes: state.page.state.recs
}))(Home)
