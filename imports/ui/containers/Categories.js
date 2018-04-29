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
    let colors = ["orange", "maroon", "green", "blue" ];
    return (
      <div className="categories"><p>Select a Category</p>
        {
          allCategories.map((cat, i) => (<Button key={i} copy={cat} action={this.handelSelect} 
            clName={colors[i%4] + ' button-4'}/>))
        }
      </div>
    );
  }
}

export default Categories;
