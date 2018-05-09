import React, { Component } from 'react';
import ClickableImage from '../components/ClickableImage';

class ImageGallery extends Component {
  constructor(props) {
    this.state = {
      pageCount: this.props.quizList.length / (4 * 2) + 1, 
      quizList: this.props.quizList,
      currentPage: 1
    };
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  render() {
    let quiz = this.state.quizList;
    let pages = [];
    for (ii = 0; ii < this.state.pageCount; ii++) pages = [...pages, ii+1];
    <div className="image-gallery">
       <div className="gallery-header">
       {
         pages.map((label, i) => (
           <Button key={i} action={this.handlePageClick} copy={label}/>)
         );
       }
       </div>
    </div>
  }
}

export default ImageGallery;
