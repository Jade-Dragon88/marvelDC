 //@ts-check
import React, { useState, useEffect } from 'react';
import './randomChar.scss';
import setContent from '../../utils/setContent';

import useMarvelService from '../../services/MarvelService';
import mjolnir from '../../resources/img/mjolnir.png';

const RandomChar = () => {
  const [char, setChar] = useState({});
  const {getCharacter,clearError,process,setProcess} = useMarvelService()


  useEffect(() => {
    console.log('Mount');
    // timerId = setInterval(updateChar, 10000);
    updateChar();

    return () => {
      console.log('Unmount');
      // clearInterval(timerId);
    };
  }, []);

  const onCharLoaded = (char) => {
    setChar(char);
  };

  const updateChar = () => {
    clearError();
    const id = Math.floor(Math.random() * (1011400 - 1011000) + 1011000);
    getCharacter(id)
      .then(onCharLoaded)
      .then(()=>setProcess('confirmed'));
  };

  const View = ({ data }) => {
    const { name, description, thumbnail, homepage, wiki } = data;
    let clazz = 'randomchar__img';
    // if (thumbnail.includes('image_not_available')) {
    //   clazz += ' no_img';
    // }
    return (
      <div className="randomchar__block">
        <img src={thumbnail} alt="Random character" className={clazz} />
        <div className="randomchar__info">
          <p className="randomchar__name">{name}</p>
          <p className="randomchar__descr">{description}</p>
          <div className="randomchar__btns">
            <a href={homepage} className="button button__main">
              <div className="inner">homepage</div>
            </a>
            <a href={wiki} className="button button__secondary">
              <div className="inner">Wiki</div>
            </a>
          </div>
        </div>
      </div>
    );
  };


  return (
    <div className="randomchar">
      {setContent(process,View,char)}
      <div className="randomchar__static">
        <p className="randomchar__title">
          Random character for today!
          <br />
          Do you want to get to know him better?
        </p>
        <p className="randomchar__title">Or choose another one</p>
        <button className="button button__main" onClick={updateChar}>
          <div className="inner">try it</div>
        </button>
        <img src={mjolnir} alt="mjolnir" className="randomchar__decoration" />
      </div>
    </div>
  );
};

export default RandomChar;
