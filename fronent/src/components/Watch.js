import React, { Component } from 'react';

class Watch extends Component {

    componentDidMount(){

      if(!window.YT){
        const tag = document.createElement('script');
        tag.src = "https://www.youtube.com/iframe_api";

        window.onYouTubeIframeAPIReady = this.loadVideo;

        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
      } else {
        this.loadVideo();
      }
    }

    onPlayerReady = event => {event.target.playVideo()};

    loadVideo = () => {

      this.player = new window.YT.Player('player', {
        height: '390',
        width: '640',
        videoId: 'M7lc1UVf-VE',
        events: {
          'onReady': this.onPlayerReady,
        }
      });

    }


    render () {
        return (
            <React.Fragment>
                <div id="player"></div>
            </React.Fragment>
        )
    }
}

export default Watch;
