import {useEffect, useState} from 'react';
import {useLocation} from 'react-router-dom';

export default function Footer(){
  const [offset, setOffset] = useState(true);
  let location = useLocation();

  useEffect(() => { // On home page, apply footer offset defined in Home.css
    setOffset(location.pathname == '/');
  }, [location]);

	return(
    <footer className={"text-center py-5" + (offset ? " footer-offset" : "")}>
      Powered by my <a href="https://github.com/md842/webserver" target="_blank">custom web server project</a>.
    </footer>
	);
}