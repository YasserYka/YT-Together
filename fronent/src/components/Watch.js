import React, { Component } from 'react';

class Watch extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentTime: 0,
      videoId: 'M7lc1UVf-VE'
    }

    this.updateDetails = this.updateDetails.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.seekTo = this.seekTo.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
    this.videoForwarded = this.videoForwarded.bind(this);
    this.sync = this.sync.bind(this);
    this.currentStatus = this.currentStatus.bind(this);
    this.changeVideo = this.changeVideo.bind(this);
  }

  componentDidMount(){

    console.log('? ', this.props.socket)

    const loadVideo = () => {
      this.player = new window.YT.Player('player', {
        videoId: this.state.videoId,
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

  changeVideo = id => this.player.loadVideoById(id);

  onStateChange = event => this.videoForwarded(event.data);

  onPlayerReady = event => event.target.playVideo();

  updateDetails = () => this.setState({currentTime: this.player.getCurrentTime()});

  pauseVideo = () => this.player.pauseVideo();

  playVideo = () => this.player.playVideo();

  seekTo = second => this.player.seekTo(second, false);

  sync = () => this.props.socket.send(this.currentStatus());

  currentStatus = () => ({
    currentTime: this.player.getCurrentTime(),
  });

  videoForwarded = triggered => {
    if(triggered === 1)
      this.sync();
  }
  
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
