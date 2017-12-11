import React, { Component } from 'react';
import { connect } from 'react-redux';
import Home from './components/Home';
import JokePage from './components/JokePage';
import ProfilePage from './components/ProfilePage';
import SessionPane from './components/SessionPane';
import { goToProfile, setUser } from './actions/user';
import { RingLoader } from 'react-spinners';
import './App.css';


const LoadingPage = () => (
  <div className="row">
    <div style={{margin: 'auto'}}>
      <RingLoader
        color={'#123abc'}
        loading
      />
    </div>
  </div>
)

const pages = {
  home: Home,
  joke: JokePage,
  profile: ProfilePage,
  loading: LoadingPage
}

class App extends Component {
  render() {
    const { page, goToProfile, setUser, user } = this.props

    const PageComponent = pages[page];

    return (
      <div className="container">
      <header className="header clearfix">
        <nav>
          <ul className="nav nav-pills float-right">
            <li className="nav-item">
              <a className={`nav-link ${page === 'home' ? 'active' : ''}`}
               href="#" onClick={() => setUser(user)}>Jokes</a>
            </li>
            <li className="nav-item">
              <a className={`nav-link ${page === 'profile' ? 'active' : ''}`}
               href="#" onClick={() => goToProfile()}>Profile</a>
            </li>
          </ul>
        </nav>
        <a href="#" onClick={() => setUser(user)}><h3 className="text-muted">Joke Genie</h3></a>
      </header>
      <main role="main">
        <div><SessionPane /></div>
        <PageComponent />
      </main>
      <footer className="footer">
        <p>Powered by <a href="https://i.trfs.me/nlp.pdf">NLP</a></p>
      </footer>
    </div>
    );
  }
}

App = connect(state => {
  const user = state.activeUser
  const page = state.page.current;
  return { page, user };
}, {goToProfile, setUser})(App)

export default App;
