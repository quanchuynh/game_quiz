import React, { Component } from 'react';
class Image extends Component {
  render() {
      return (
        <div>
          <img
            className="thumbnail"
            src={this.props.filePath}
            height={this.props.height}
            width={this.props.width}
            alt={this.props.alt} />
            <cite>{this.props.credit}</cite>
        </div>
      );
    }
}

export default Image;
