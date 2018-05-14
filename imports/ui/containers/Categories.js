import React, { Component } from 'react';
import Button from '../components/Button';
import ImageGallery from '../containers/ImageGallery';
import '../index.css';

const nextQuestionTime = 2;

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      allCategories: [],
      quizList: [],
      gameMode: this.props.mode,
      currentActiveCategory: ""
    };
    this.handleSelect = this.handleSelect.bind(this);
    this.handleImageClick = this.handleImageClick.bind(this);
  }

  componentDidMount() {
    Meteor.call('getCategories', (err, ret) => {
      this.setState({allCategories: ret, currentActiveCategory: ret[0]});
      Meteor.call('getAllQuizIn', ret[0], (err, ret2) => {
        this.setState({quizList: ret2});
      });
    });
  }

  handleImageClick(image) {
    this.props.action(image.id);
  }

  handleSelect(category) {
    let gameId = this.props.gameId;
    if (this.state.gameMode) {
      Meteor.call('getCategoryQuizId', category, gameId, (err, ret) => {
        let quizId = ret;
        this.props.action(quizId);
      });
    }
    else {
      Meteor.call('getAllQuizIn', category, (err, ret) => {
        this.setState({quizList: ret, currentActiveCategory: category});
      });
    }
  }

  render() {
    let allCategories = this.state.allCategories;
    let needAdd = 4 - allCategories.length % 4;
    /* let colors = ["orange", "maroon", "green", "blue" ]; */
    let colors = ["category-color1","category-color2","category-color3","category-color4"];
    needAdd = needAdd == 4 ? 0 : needAdd;
    for (i = 0; i < needAdd; i++) allCategories = [...allCategories, "."];
    let selectText = {color: "#005780", fontSize: "1.5em"};
    let activeCategory = {backgroundColor: "white"};
    let galleryVisibility = this.state.gameMode ? 'is-hidden' : 'is-visible';
    let quizList = this.state.quizList;

    return (
      <div className="categories"><p style={selectText}>Select a Category</p>
        {
          allCategories.map((cat, i) => {
             if (cat === ".") 
                return <Button key={i} copy={cat} clName={colors[i%4] + ' button-4'} disable={true}/>
             else if (cat === this.state.currentActiveCategory) {
                return <Button key={i} copy={cat} action={this.handleSelect} style={activeCategory}
                   clName={' category-focus category button-4'}/>
             }
             else
                return <Button key={i} copy={cat} action={this.handleSelect} 
                   clName={colors[i%4] + ' category button-4'}/>
          })
        }
        <div className={galleryVisibility}>
           <ImageGallery quizList={quizList} action={this.handleImageClick}/>
        </div>
      </div>
    );
  }
}

export default Categories;
