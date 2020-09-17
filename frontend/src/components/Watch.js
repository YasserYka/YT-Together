import React, { Component } from 'react';
import { Link } from "react-router-dom";

class Watch extends Component {

  constructor(props){
    super(props);

    this.state = {
      videoId: '00vnln25HBg',
      inputVideoId: ''
    }

    this.handleOnChangeVideoId = this.handleOnChangeVideoId.bind(this);
    this.handleOnVideoIdSubmit = this.handleOnVideoIdSubmit.bind(this);
  }

  componentDidMount(){

    this.props.socket.addEventListener('message', event => {
      let data = JSON.parse(event.data);
      if(data.event === 'sync')
        this.updateVideo(data);
    });

    const loadVideo = () => {
      this.player = new window.YT.Player('player', {
        videoId: this.state.videoId,
        playerVars: {
          'autoplay': 1,
          'mute': 1
        },
        events: {
          'onReady': this.onPlayerReady,
          'onStateChange' : this.onStateChange
        },
      });
    } 

    if(!window.YT){
      const tag = document.createElement('script');
      tag.src = "http://www.youtube.com/iframe_api";

      window.onYouTubeIframeAPIReady = loadVideo;

      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
    } else
      loadVideo();
  }

  syncPause = () => {
    this.props.socket.send(JSON.stringify({
      event: "sync",
      action: "pause"
      })
    )
  };

  updateVideo = data => {
    let videoStatus = this.player.getPlayerState();
    if(data.action === 'currenttime' && (videoStatus === 2 || videoStatus === -1)){
      this.player.playVideo();
      this.seekTo(data.currentTime);
    } else if (data.action === 'pause' && videoStatus !== 2)
      this.pauseVideo();
  }

  changeVideo = id => this.player.loadVideoById(id);

  onStateChange = event => this.changeState(event.data);

  onPlayerReady = event => event.target.playVideo();

  pauseVideo = () => this.player.pauseVideo();

  playVideo = () => this.player.playVideo();

  seekTo = second => this.player.seekTo(second, true);

  sync = () => this.props.socket.send(this.currentStatus());

  currentStatus = () => (JSON.stringify({
      event: "sync", 
      action: "currenttime",
      currentTime: this.player.getCurrentTime(),
    })
  );

  changeState = triggered => {
    if(this.props.haveControll){
      if(triggered === 1)
        this.sync();
      else if(triggered === 2)
        this.syncPause();
    }
  }

  handleOnChangeVideoId = event => {
    if(event)
      event.preventDefault();

    this.setState({
      inputVideoId: event.target.value
    });
  }

  handleOnVideoIdSubmit = event => {
    if(event)
      event.preventDefault();
    if(this.props.haveControll)
        this.player.loadVideoById(this.state.inputVideoId);
  }

  render () {
      return (
        <div class="container">
          <div className="embed-responsive embed-responsive-16by9 row">
            <div className="embed-responsive-item" id="player"></div>
          </div>

          <form className="m-3 row"  onSubmit={this.handleOnVideoIdSubmit}>
            <div className="form-group col">
              <input placeholder="Video ID" className="form-control mb-3 " onChange={this.handleOnChangeVideoId} value={this.state.inputVideoId} required />
              <button className="btn btn-primary mb-2 mx-auto d-block" type="submit">Change Video</button>
            </div>
            <div class="col text-center">
              <Link to="/" onClick={this.leaveRoom}>
                <button className="btn btn-primary btn-lg">
                  Leave Room
                </button>
              </Link>
            </div>
          </form>
          
        </div>
      )
  }
}

export default Watch;
