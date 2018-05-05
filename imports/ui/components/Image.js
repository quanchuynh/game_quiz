import React, { Component } from 'react';
class Image extends Component {
  render() {
      return (
          <div>
            <img className="small-12"
              src={this.props.filePath}
              alt={this.props.alt} />
              <p><cite>{this.props.credit}</cite></p>
          </div>
      );
    }
}

export default Image;
