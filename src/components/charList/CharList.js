import { useState, useEffect, useRef } from 'react'
import './charList.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import React from 'react';
import PropTypes from 'prop-types';


const CharList =(props)=> {
  
  const [offset, setOffset]       = useState(210);
  const [charList, setCharList]   = useState([]);
  const [charEnded, setCharEnded] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);

  const {loading,error,getAllCharacters} = useMarvelService();

  useEffect(()=>{onRequest(offset, true)},[])

  const onRequest = (/** @type {any} */ offset, initial)=>{
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
    .then(onCharListLoaded)
  }

  const onCharListLoaded = (/** @type {any} */ newCharList) => {
    
    let ended = false;
    if(newCharList.length<9){ended = true}

    setCharList(charList => [...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => (offset + 9));
    setCharEnded(charEnded => ended)
  }

  console.log('!!!  charList  !!!');


  const itemRefs = useRef([]);

  // setRef = (ref) =>{
  //   this.itenRefs.push(ref);
  // }

  const focusOnItem = (id) =>{
    itemRefs.current.forEach(item =>item.classList.remove('char__item_selected'));
    itemRefs.current[id].classList.add('char__item_selected');
    itemRefs.current[id].focus();
  }

  /** @param {any[]} arr */
  function renderItems(arr){
    const items = arr.map((/** @type {{ thumbnail: string; id: React.Key; name: string | React.ReactElement<any, string | React.JSXElementConstructor<any>> | React.ReactFragment | null | undefined; }} */ item,i)=>{
      let imgStyle = {'objectFit' : 'cover'}; // @ts-ignore
      if(item.thumbnail.includes('image_not_available')){ (imgStyle = {'objectFit' : 'unset'}) }
      
      return(
        <li className = "char__item"
            tabIndex={0}
            ref = {el=>itemRefs.current[i] = el}
            key={item.id}
            onClick={() =>{
              props.onCharSelected(item.id);
              focusOnItem(i);
            }}
            onKeyPress={(e)=>{
              if(e.key === ' ' || e.key === 'Enter'){
                props.onCharSelected(item.id);
                focusOnItem(i);
              }
            }}>
          
          <img src={item.thumbnail} // @ts-ignore
          alt={item.name} style={imgStyle}/>
          <div className="char__name">{item.name}</div>
        </li>
      )
    });
    // А эта конструкция вынесена для центровки спиннера/ошибки
    return(
      <ul className="char__grid">
        {items}
      </ul>
    )
  }

    const items = renderItems(charList);
    const errorMessage = error   ? <ErrorMessage/> : null;
    const spinner = loading && !newItemLoading ? <Spinner /> : null;

    return (

        <div className="char__list">
          {errorMessage}
          {spinner}
          {items}
          <button 
            className="button button__main button__long"
            disabled={newItemLoading}
            style={{'display': (charEnded ? 'none' : 'block')}}
            onClick={()=>onRequest(offset)}
            >
            <div className="inner">load more</div>
          </button>
        </div>
    )

}

CharList.propTypes={
  onCharSelected: PropTypes.func.isRequired
}


export default CharList;
