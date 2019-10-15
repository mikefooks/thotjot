import _ from "lodash";

import React from "react";
import { connect } from "react-redux";

import SentenceTile from "./SentenceTile.jsx";
import WordTile from "./WordTile.jsx";


let sentenceCounter = 1000;

const mapStateToProps = (state, ownProps) => {
  let sentences;

  if (ownProps.role == "target") {
    sentences = state.target;
  } else if (ownProps.role == "quiver") {
    sentences = state.quiver;
  }
  
  return { sentences };
}

const ConnectedWordBoard = ({ sentences, role }) => {
  let areSentences = sentences.length > 0 ? true : false;
  let classNames = "wordBoard " + role;

  if (areSentences) {
    let tiles = _.map(sentences, sentId => {
      return <SentenceTile key={sentenceCounter++} sentenceId={sentId} />
    });

    return (
      <div className={classNames}>
	  {tiles}
      </div>
    );
  } else {
    return (
      <div className={classNames}>
	  <h2>Nothing here...</h2>
      </div>
    );
  }
}

const WordBoard = connect(mapStateToProps)(ConnectedWordBoard);

export default WordBoard;
