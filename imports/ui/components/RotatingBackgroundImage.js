import React, { Component } from 'react';
import './RotatingBackgroundImage.css';

class RotatingBackgroundImage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imageIndex: 0
    }
    this.images = ['111_1499738-W.jpg',  '132_1305218-W.jpg',  '132_1310835-W.jpg',  '139_1964909-W.jpg'];
  }

  componentDidMount() {
  }

  render() {
    let backgroundImage = {opacity: 0.25, float: "left", height: "600px"},
        aImage = 'images/' + this.images[this.state.imageIndex],
        images = this.images;
    console.log("Rotate: render");
    return (
      <div className="imageContainer">
        <div className="wrapper">
          {
            images.map((im, i) => {
                return (
                  <img key={i} className="sliding-background" src={'images/' + im} style={backgroundImage}/>
                )
              })
          }
        </div>
      </div>
    )
  }
}

export default RotatingBackgroundImage;
