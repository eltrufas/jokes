import React from 'react';
import { connect } from 'react-redux';
import { setUser } from '../actions/user';

class SessionPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = {input: '33'}

    this.handleChange = this.handleChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)

  }

  handleChange(event) {
    this.setState({input: event.target.value})
  }

  handleSubmit() {
    console.log('hi')
    if (this.state.input.length) {
      console.log('bye')
      this.props.setUser(this.state.input);
    }
  }

  render() {
    const { user } = this.props;
    return (
      <div className="row">
        <div className="col-md-12">
        <form className="form-inline" style={{display: 'block', margin: 'auto'}}>
          <span style={{marginRight: '10px'}}>
            Currently browsing as session { user }.
            Browse as
          </span>
          <input
           type='textfield' className='form-control'
           value={this.state.input} onChange={this.handleChange}/>
          <span  style={{marginLeft: '10px', marginRight: '10px'}}>
            instead
          </span>
          <button type="button" className="btn btn-primary"
           onClick={this.handleSubmit} disabled={!this.state.input}>Go!</button>
        </form>
        </div>
      </div>
    )
  }
}

export default connect((state, ownProps) => {
  return {user: state.activeUser}
}, {setUser})(SessionPane)
