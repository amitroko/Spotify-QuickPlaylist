import React, {Component} from 'react';
import SpotifyWebApi from 'spotify-web-api-js';
import styled from 'styled-components';

const spotifyWebAPI = new SpotifyWebApi();

const Styles = styled.div`
`;

class PlaylistGenerator extends Component {
    constructor() {
        super();
        this.state = {
            playlistName: 'New Playlist',
            playlistDescription: ':)',
            isPrivate: false,
            isCollaborative: false,
            addSongs: 10,
            statusMessage: ''
        }
    }

    async createNewPlaylist(){    //create a new playlist and populate it with the user's recently played tracks
        let userID = '';
        await spotifyWebAPI.getMe()  //retrieve the current user and set the userID field accordingly
        .then((response) => {
            if (response.hasOwnProperty('error')){
              this.setState({
                statusMessage: 'Error: failed to fetch user'
              });
              this.resetState();
              return;
            }
            console.log(response.id);
            userID = response.id;
        });

        let newPlaylistID = '';
        await spotifyWebAPI.createPlaylist(   //create a new playlist and save its ID
        userID,
        {"name": this.state.playlistName,
        "public": !(this.state.isPrivate),
        "collaborative": this.state.isCollaborative,
        "description": this.state.playlistDescription})
            .then((response) => {
              if (response.hasOwnProperty('error')){
                this.setState({
                  statusMessage: 'Error: failed to create new playlist'
                });
                this.resetState();
                return;
              }
            newPlaylistID = response.id;
            });

        let tracklist = [];
        await spotifyWebAPI.getMyRecentlyPlayedTracks({"limit": this.state.addSongs}) //retrieve recently played tracks up to user selecte limit and save them
        .then((response) => {
          if (response.hasOwnProperty('error')){
            this.setState({
              statusMessage: 'Error: failed to read recently played tracks user'
            });
            this.resetState();
            return;
          }
            for(var i = 0; i < response.items.length; i++){
            tracklist.push("spotify:track:"+response.items[i].track.id);
            }
        })

        await spotifyWebAPI.addTracksToPlaylist(   //add recently played tracks to playlist
          userID,
          newPlaylistID,
          tracklist
        )
        .then((response) => {
          if (response.hasOwnProperty('error')){
            this.setState({
              statusMessage: 'Error: failed to add tracks to playlist'
            });
            this.resetState();
            return;
          }
        });

        this.setState({
          statusMessage: 'Playlist "' + this.state.playlistName + '" created'
        });
        this.resetState();
    }

    resetState() {
      this.setState({   //return the input fields to their default values
        playlistName: 'New Playlist',
        playlistDescription: ':)',
        isPrivate: false,
        isCollaborative: false,
        addSongs: 10,
      });
    }

    handleNameChange = (event) => this.setState({playlistName: event.target.value});
    handleDescriptionChange = (event) => this.setState({playlistDescription: event.target.value});
    handlePrivacyChange = (event) => this.setState({isPrivate: event.target.checked});
    handleCollaborativeChange = (event) => this.setState({isCollaborative: event.target.checked});
    handleSliderChange = (event) => this.setState({addSongs: event.target.value});

    render() {
        const collaborativeCheckbox = this.state.isPrivate    //only shows the make collaborative checkbox if the make private checkbox is checked
            ?   <div>
                    Make the Playlist Collaborative?&nbsp;
                    <input name="isCollaborative" type="checkbox" checked={this.state.isCollaborative} onChange={this.handleCollaborativeChange}/>
                </div>
            :   null;

        return(
            <div>
            <form>
              <label>
                Playlist Name:&nbsp;
              <input type="text" value={this.state.playlistName} onChange={this.handleNameChange} name="name"/>
              </label>
              <label>
                Playlist Description:&nbsp;
              <input type="text" value={this.state.playlistDescription} onChange={this.handleDescriptionChange} name="description"/>
              </label>
              <label>
                Make the Playlist Private?&nbsp;
              <input name="isPrivate" type="checkbox" checked={this.state.isPrivate} onChange={this.handlePrivacyChange}/>
              </label>
              <label>
                {collaborativeCheckbox}
              </label>
              <label>
                Number of Tracks:
                <Styles>
                  <Slider value={this.state.addSongs} onChange={this.handleSliderChange}/>
                </Styles>
              </label>
              <p>{this.state.addSongs}</p>
            </form>
            <button onClick ={() => this.createNewPlaylist()}>
              Create Playlist
            </button>
            <p className="statusMessage">{this.state.statusMessage}</p>
          </div>
        )
    }
}

const Slider = ({value, onChange}) => (
    <Styles>
      <input type="range" min={1} max={50} value={value} className="slider" onChange={onChange}/>
    </Styles>
);

export default PlaylistGenerator;