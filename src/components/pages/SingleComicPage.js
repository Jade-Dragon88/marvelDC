
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from "react-helmet";

import './singleComicPage.scss';
// import Spinner from '../spinner/Spinner';
// import ErrorMessage from '../errorMessage/ErrorMessage';
import useMarvelService from '../../services/MarvelService';
import setContent from '../../utils/setContent';


const SingleComicPage = () => {
    const {comicId} = useParams();
    const {comic, setComic} = useState(null);
    const { loading, error, getComic, clearError,process,setProcess } = useMarvelService();
    
    useEffect(() => { updateComic() }, [comicId])
  
    const onComicLoaded = (comic) => {
      setComic(comic);
    }
    const updateComic = () => {
      clearError();
      getComic(comicId)
        .then(onComicLoaded)
        .then(()=>setProcess('confirmed'));
    }

    // const spinner = loading ? <Spinner /> : null;
    // const errorMessage = error ? <ErrorMessage /> : null;
    // const content = !(!comic || loading || error) ? <View comic={comic} /> : null;

  
    return(
      <>
        {/* {errorMessage}
        {spinner}
        {content} */}
        {setContent(process,View,comic)}
      </>
    )
    
}

const View =({data})=>{
  const {title, description, pageCount, thumbnail, language, price} = data; 
  return (
        <div className="single-comic">
            <Helmet>
              <meta name="description" content=`${title} comics book`/>
              <title>{title}</title>
            </Helmet>
            <img src={thumbnail} alt={title} className="single-comic__img"/>
            <div className="single-comic__info">
                <h2 className="single-comic__name">{title}</h2>
                <p className="single-comic__descr">{description}</p>
                <p className="single-comic__descr">{pageCount}</p>
                <p className="single-comic__descr">Language: {language}</p>
                <div className="single-comic__price">{price}</div>
            </div>
            <Link to="/comics" className="single-comic__back">Back to all</Link>
        </div>
    )
}

export default SingleComicPage;






