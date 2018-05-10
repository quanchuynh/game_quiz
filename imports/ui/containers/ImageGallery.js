import React, { Component } from 'react';
import ClickableImage from '../components/ClickableImage';
import Button from '../components/Button';

class ImageGallery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pageCount: this.props.quizList.length / (4 * 3), 
      quizList: this.props.quizList,
      currentPage: 1
    };
    this.handlePageClick = this.handlePageClick.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  handlePageClick(pageId) {
    var page = parseInt(pageId);
    this.setState({currentPage: page});
  }

  handleImageClick(image) {
    this.props.action(image);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.quizList !== nextProps.quizList)
      return {quizList: nextProps.quizList,
              pageCount: nextProps.quizList.length / (4 * 3)
             };
    return null;
  }

  render() {
    let quiz = this.state.quizList;
    let pages = [], currentPage = this.state.currentPage;
    let images = quiz.slice((currentPage - 1)*12, currentPage * 12);
    /* pageCount is number (e.g. 76/12 = 6.333 would produce 7 pages below) */
    for (ii = 0; ii < this.state.pageCount; ii++) pages = [...pages, ii+1]; 
    return (
      <div className="image-gallery">
         <div className="gallery-header">
         {
           pages.map((label, i) => (
             <Button key={i} action={this.handlePageClick} copy={label.toString()}/>)
           )
         }
         </div>
         <div className="gallery-body">
         {
           images.map((image, i) => (
             <ClickableImage className="button-4 float-left" key={i} action={this.handleImageClick} copy={image}/>)
           )       
         }
         </div>
      </div>
    );
  }
}

export default ImageGallery;
