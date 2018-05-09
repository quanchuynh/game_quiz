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
      gameMode: this.props.mode
    };
    this.handelSelect = this.handelSelect.bind(this);
  }

  componentDidMount() {
    Meteor.call('getCategories', (err, ret) => {
      this.setState({allCategories: ret});
    });
  }

  handelSelect(category) {
    let gameId = this.props.gameId;
    if (this.state.gameMode) {
      Meteor.call('getCategoryQuizId', category, gameId, (err, ret) => {
        let quizId = ret;
        this.props.action(quizId);
      });
    }
    else {
      Meteor.call('getAllQuizIn', category, (err, ret) => {
        this.setState({quizList: ret});
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
    let galleryVisibility = this.state.gameMode ? 'is-hidden' : 'is-visible';

    return (
      <div className="categories"><p style={selectText}>Select a Category</p>
        {
          allCategories.map((cat, i) => {
             if (cat === ".") 
                return <Button key={i} copy={cat} clName={colors[i%4] + ' button-4'} disable={true}/>
             else
                return <Button key={i} copy={cat} action={this.handelSelect} clName={colors[i%4] + ' button-4'}/>
          })
        }
        <div className={galleryVisibility}>
           <ImageGallery quizList={this.state.quizList}/>
        </div>
      </div>
    );
  }
}

export default Categories;
