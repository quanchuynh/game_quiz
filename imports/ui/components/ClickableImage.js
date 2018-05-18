import React, { Component } from 'react';
import './ClickableImage.css';

class ClickableImage extends Component {
  render() {
      let clName= this.props.clName + ' gallery';
      let quizProfile = this.props.copy;
      let title = {__html: quizProfile.title};
      return (
        <div className={clName} onClick={() => this.props.action(this.props.copy)}>
           <img src={quizProfile.imagePath}/>
           <div className="desc"><p dangerouslySetInnerHTML={title}></p> </div>
           <div className="desc"><p className="cap">{quizProfile.quizType.replace(/_/g, ' ').toLowerCase()}</p></div>
        </div> 
      );
    }
}

export default ClickableImage;
