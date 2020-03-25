import React, { Component } from 'react';

class Watch extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentTime: 0,
      videoId: '00vnln25HBg',
    }

    this.youHaveControll = false;

    this.updateDetails = this.updateDetails.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.seekTo = this.seekTo.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.changeState = this.changeState.bind(this);
    this.sync = this.sync.bind(this);
    this.currentStatus = this.currentStatus.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
    this.updateVideo = this.updateVideo.bind(this);
    this.haveControll = this.haveControll.bind(this);
  }

  componentDidMount(){

    this.props.socket.onmessage = event => {
      let data = JSON.parse(event.data);
      if(data.event === 'control')
        this.haveControll(data)
      else if(data.event === 'sync')
        this.updateVideo(data);
    }

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
    } else {
      loadVideo();
    }
  }

  updateVideo = data => {
    let videoStatus = this.player.getPlayerState();

    if(videoStatus === 2)
      this.player.playVideo();
    this.seekTo(data.currentTime);
  }

  changeVideo = id => this.player.loadVideoById(id);

  onStateChange = event => this.changeState(event.data);

  onPlayerReady = event => event.target.playVideo();

  updateDetails = () => this.setState({currentTime: this.player.getCurrentTime()});

  pauseVideo = () => this.player.pauseVideo();

  playVideo = () => this.player.playVideo();

  seekTo = second => {

    this.player.seekTo(second, true);
  }

  sync = () => this.props.socket.send(this.currentStatus());

  currentStatus = () => (JSON.stringify({
    event: "sync", 
    currentTime: this.player.getCurrentTime(),
  }));

  changeState = triggered => {
    if(triggered === 1 && this.youHaveControll)
      this.sync();
  }

  haveControll = data => this.youHaveControll = JSON.parse(data.youHaveControll);

  render () {
      return (
        <React.Fragment>
          <div className="embed-responsive embed-responsive-16by9">
            <div className="embed-responsive-item" id="player"></div>
          </div>
          <button onClick={this.updateDetails}>Upadate</button>
          <h5>{this.state.currentTime}</h5>
        </React.Fragment>
      )
  }
}

export default Watch;
