//@ts-check
/* eslint-disable array-callback-return */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import setContent from '../../utils/setContent';
import './charInfo.scss';
import useMarvelService from '../../services/MarvelService';
import React from 'react';
import PropTypes from 'prop-types';

const CharInfo =  (props) => {

  const [char, setChar] = useState(null);
  const {getCharacter, clearError,process,setProcess } = useMarvelService();

  useEffect(() => { updateChar() }, [props.charId])
  
  const updateChar = () => {
    const { charId } = props;
    if (!charId) { return; }
    clearError();
    getCharacter(charId)
      .then(onCharLoaded)
      .then(()=>setProcess('confirmed'))
  }

  const onCharLoaded = (char) => {
    setChar(char);
  }

  return (
    <div className="char__info">
      {setContent(process, View, char)}
    </div>
  )

}

const View = ({ data }) => {
  const { name, description, thumbnail, homepage, wiki, comics } = data
  let comicsList;
  if (!comics[0]) { comicsList = <span>Информация о комиксах отсутствует</span> }
  if (comics[0]) {
    comicsList = comics.map((item, i) => {
      if (i > 9) return
      return (
        <li key={i} className="char__comics-item">
          {item.name}
        </li>
      )
    })
  }

  let imgStyle = { 'objectFit': 'cover' };
  if (thumbnail.includes('image_not_available')) { (imgStyle = { 'objectFit': 'unset' }) }

  return (
    <>
      <div className="char__basics">
        <img src={thumbnail} alt={name}
          // @ts-ignore
          style={imgStyle} />
        <div>
          <div className="char__info-name">{name}</div>
          <div className="char__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
      <div className="char__descr">
        {description}
      </div>
      <div className="char__comics">Comics:</div>
      <ul className="char__comics-list">
        {comicsList}
      </ul>
    </>
  )
}

CharInfo.propTypes = {
  charId: PropTypes.number
}

export default CharInfo;
