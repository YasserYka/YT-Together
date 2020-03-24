import React, { Component } from 'react';

class Watch extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentTime: 0
    }

    this.updateDetails = this.updateDetails.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
    this.seekTo = this.seekTo.bind(this);
    this.playVideo = this.playVideo.bind(this);
    this.onStateChange = this.onStateChange.bind(this);
  }

    componentDidMount(){

      const loadVideo = () => {
        this.player = new window.YT.Player('player', {
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': this.onPlayerReady,
            'onStateChange' : this.onStateChange
          }
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

    onPlayerReady = event => event.target.playVideo();

    updateDetails = () => this.setState({currentTime: this.player.getCurrentTime()});

    pauseVideo = () => this.player.pauseVideo();

    playVideo = () => this.player.playVideo();

    seekTo = (second) => this.player.seekTo(second, false);

    onStateChange = event => {
      if(event.data == 0)
        console.info("Video Ended!");
      else if(event.data == 1)
        console.info("Video is Playing!");
      else if(event.data == 2)
        console.info("Video Paused!");
    };

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
