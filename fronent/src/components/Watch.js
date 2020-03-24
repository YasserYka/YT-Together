import React, { Component } from 'react';

class Watch extends Component {

  constructor(props){
    super(props);

    this.state = {
      currentTime: 0
    }

    this.updateDetails = this.updateDetails.bind(this);
    this.pauseVideo = this.pauseVideo.bind(this);
  }

    componentDidMount(){

      const loadVideo = () => {
        this.player = new window.YT.Player('player', {
          videoId: 'M7lc1UVf-VE',
          events: {
            'onReady': this.onPlayerReady,
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
