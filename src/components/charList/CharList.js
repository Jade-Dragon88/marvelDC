import { useState, useEffect, useRef, useMemo } from 'react'
import './charList.scss';
import Spinner from '../spinner/Spinner';
import useMarvelService from '../../services/MarvelService';
import ErrorMessage from '../errorMessage/ErrorMessage';
import React from 'react';
import PropTypes from 'prop-types';
// import setContent from '../../utils/setContent';


const setContent = (process,Component, newItemLoading)=>{
  if(process=='waiting')  {return <Spinner />}
  if(process=='loading')  {return newItemLoading ? <Component />:<Spinner />}
  if(process=='confirmed'){return <Component />}
  if(process=='error')    {return <ErrorMessage />}
}


const CharList =(props)=> {
  
  const [offset, setOffset]       = useState(210);
  const [charList, setCharList]   = useState([]);
  const [charEnded, setCharEnded] = useState(false);
  const [newItemLoading, setNewItemLoading] = useState(false);

  const {loading,error,getAllCharacters,process,setProcess} = useMarvelService();

  useEffect(()=>{onRequest(offset, true)},[])

  const onRequest = (/** @type {any} */ offset, initial)=>{
    initial ? setNewItemLoading(false) : setNewItemLoading(true);
    getAllCharacters(offset)
      .then(onCharListLoaded)
      .then(()=>setProcess('confirmed'))
  }

  const onCharListLoaded = async (/** @type {any} */ newCharList) => {
    
    let ended = false;
    if(newCharList.length<9){ended = true}

    setCharList(charList => [...charList, ...newCharList]);
    setNewItemLoading(newItemLoading => false);
    setOffset(offset => (offset + 9));
    setCharEnded(charEnded => ended)
  }

  console.log('!!!  charList  !!!');


  const itemRefs = useRef([]);

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


  const elements = useMemo(()=>{
    return (setContent(process, ()=>renderItems(charList), newItemLoading))
  },[process])
  

    return (

        <div className="char__list">
          {elements}
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
