import React, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import PlaylistGenerator from './PlaylistGenerator';
import './App.css';
import qplogo from './qp2.png';

const spotifyWebAPI = new SpotifyWebApi();
const client_id = process.env.REACT_APP_CLIENT_ID;
const redirect = process.env.REACT_APP_REDIRECT;
const port = process.env.PORT || 3000;
const authURL = 'https://accounts.spotify.com/authorize?'
                  + 'client_id=' + client_id
                  + '&redirect_uri=' + redirect + port
                  + '&scope=user-read-recently-played%20playlist-modify-public%20playlist-modify-private'
                  + '&response_type=token'
                  + '&state=123';

class App extends Component {
  constructor() {
    super();
    const params = this.getHashParams();
    if(params.access_token){
      spotifyWebAPI.setAccessToken(params.access_token);
    }
    this.state = {
      loggedIn: params.access_token ? true : false,
    }
  }

  getHashParams() {   //from Spotify authorization code, gets hash parameters from URL
    var hashParams = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    while (e = r.exec(q)) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
    }
    return hashParams;
  }

  render(){
    const appBody = this.state.loggedIn   //shows the input fields if the user is logged in, log in button otherwise
      ? <PlaylistGenerator/>
      : <a href={authURL}>
          <button>Login to Spotify</button>
        </a>;
    
    return ( 
        <body>
          <div className="nameAndLogo">
            <img src={qplogo} className="logo"/>
            <h1>QuickPlaylist for Spotify</h1>
          </div>
          <p className="description">
            With this tool, you can create a new Spotify playlist and instantly populate it with tracks you have recently played.
            <br/>Note: tracks that you listened to for less than 30 seconds and your currently playing track will not be included.
          </p>
          <hr/>
          <div>
            {appBody}
          </div>
        </body>
    );
  }
}

export default App;