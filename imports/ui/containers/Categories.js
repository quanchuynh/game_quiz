import React, { Component } from 'react';
import Button from '../components/Button';
import SelectCategoryCountDown from '../components/SelectCategoryCountDown';
import ImageGallery from '../containers/ImageGallery';
import GameResultTable from '../components/GameResultTable';

import '../index.css';

/* props: mode, action, gameId, quizId, categorySelector, player */

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
    this.scoreSummary = {__html:  ''};
    this.winner = '';
  }

  detailResult() {
    let param = {gameName: this.props.gameId, quizId: this.props.quizId};
    Meteor.call('getResultDetail', param, (err, ret) => {
      let res = ret.results[0];
      var content = '<span style="float: left">' + ret.gameName + ', ' + res.title + '</span><br/>' +
                res.players.map((player) => ('<span style="float: left"><em>' + player.player + '</em> got ' 
                + player.score + ' questions: ' + JSON.stringify(player.questions) + '</span><br/>')) +
                '<span style="float: left">' + res.winner + ' will select next category</span></br>';
      this.scoreSummary = {__html:  content};
      this.winner = res.winner;
    });
  }

  componentDidMount() {
    this.setState({gameMode: this.props.mode});
    console.log("Categories, componentDidMount, gameMode: " + this.state.gameMode);
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
    if (this.props.mode) {
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
    let selectText = {color: "#005780", position: "relative", top: "40px"};
    let activeCategory = {backgroundColor: "white"};
    let galleryVisibility = this.props.mode ? 'is-hidden' : 'is-visible';
    let categorySelector = this.props.categorySelector;
    let categoryVisible = this.props.mode && !(categorySelector === this.props.player) ? false : true;
    let quizList = this.state.quizList;
    let param = {gameName: this.props.gameId, quizId: this.props.quizId};
    console.log("Cateogries props: " + JSON.stringify(this.props));
    console.log("Categories state.gameMode: " + this.state.gameMode);

    return (
      categoryVisible ? 
        <div className="categories" style={selectText}>
          <p style={{fontSize: "1.5em", textAlign: "center"}}>Select a Category</p>
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
          <div className={galleryVisibility}> {/* visible in practice mode */}
             <ImageGallery quizList={quizList} action={this.handleImageClick}/>
          </div>
        </div>
      :
        <div className="columns small-8 float-center" style={{position: "relative", top: "40px"}}> 
           {this.detailResult() /* Get winner name below */}
           <GameResultTable remoteCall={'getResultDetail'} gameName={param}/>
           <SelectCategoryCountDown gameName={this.props.gameId} quizId={this.props.quizId}
              winner={this.winner}/>
        </div>
    );
  }
}

export default Categories;
