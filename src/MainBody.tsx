import { useLang} from './langContext';


function MainBody(){
    const{currentLang} = useLang();
    return(
        <div>
            {currentLang}
        </div>
    );
}

export default MainBody;
