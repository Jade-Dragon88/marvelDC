
import Spinner from '../components/spinner/Spinner';
import ErrorMessage from '../components/errorMessage/ErrorMessage';
import Skeleton from '../components/skeleton/Skeleton';


const setContent = (process,Component, data)=>{
  
    if(process=='waiting')  {return <Skeleton />}
    if(process=='loading')  {return <Spinner />}
    if(process=='confirmed'){return <Component data={data} />}
    if(process=='error')    {return <ErrorMessage />}
  
}

export default setContent;