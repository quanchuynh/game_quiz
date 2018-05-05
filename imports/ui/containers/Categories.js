import React, { Component } from 'react';
import Button from '../components/Button';
import '../index.css';

const nextQuestionTime = 2;

class Categories extends Component {
  constructor(props) {
    super(props);
    this.state = {
      active: false,
      allCategories: []
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
    Meteor.call('getCategoryQuizId', category, gameId, (err, ret) => {
      let quizId = ret;
      this.props.action(quizId);
    });
  }

  render() {
    let allCategories = this.state.allCategories;
    let needAdd = 4 - allCategories.length % 4;
    /* let colors = ["orange", "maroon", "green", "blue" ]; */
    let colors = ["category-color1","category-color2","category-color3","category-color4"];
    needAdd = needAdd == 4 ? 0 : needAdd;
    for (i = 0; i < needAdd; i++) allCategories = [...allCategories, "."];
    let selectText = {color: "#005780", fontSize: "1.5em"};

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
      </div>
    );
  }
}

export default Categories;
