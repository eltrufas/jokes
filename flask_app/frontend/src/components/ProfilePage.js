import React from 'react';
import { connect } from 'react-redux';

const TopicDisplay = (topic) => {
  const topFive = topic.description.slice(0, 5);
  const rest = topic.description.slice(5);

  return (
    <div class="row" key={topic.id}>
      <div class="col-md-12">
        <h2>{topFive.join(' ')}</h2>
        <p>{rest.join(' ')}</p>
      </div>
    </div>
  )
}

const ProfilePage = ({ topics }) => (
  <div>
    <div class='row'>
    <div class="col-md-12">
      <h3>Your favorite joke topics are: </h3>
    </div>
    </div>
    {
      topics.map(TopicDisplay)
    }
  </div>
)

export default connect((state, ownProps) => {
  return {topics: state.page.state.topics.map(i => state.topics[i])}
})(ProfilePage)
