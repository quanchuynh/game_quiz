import React, { Component } from 'react';

class ClickableImage extends Component {
  render() {
      let clName= this.props.clName;
      let quizProfile = this.props.quizProfile;
      return (
        <button className={clName} onClick={() => this.props.action(this.props.copy)}>
           <img src={this.props.imagePath}/>
           <div><h4>quizProfile.title</h4>
                <p>type: {quizProfile.quizType}, category: {quizProfile.mainCategory}</p></div>
        </button> 
      );
    }
}

export default ClickableImage;
