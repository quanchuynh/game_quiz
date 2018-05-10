import React, { Component } from 'react';

class ClickableImage extends Component {
  render() {
      let clName= this.props.clName;
      let quizProfile = this.props.copy;
      let title = {__html: quizProfile.title};
      return (
        <button className={clName} onClick={() => this.props.action(this.props.copy)}>
           <img src={quizProfile.imagePath}/>
           <div><p dangerouslySetInnerHTML={title}></p>
                <span>{quizProfile.quizType.replace(/_/g, ' ')}</span>
           </div>
        </button> 
      );
    }
}

export default ClickableImage;
