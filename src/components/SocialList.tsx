import { Link } from "react-router-dom";

import InstagramIcon from './icons/InstagramIcon';
import GithubIcon from './icons/GithubIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import MailIcon from './icons/MailIcon';

function SocialList() {
  return (
    <div className='flex flex-col gap-5'>

      <Link to={'mailto:andrea.windisch@gmx.net'} target="_blank" className="translate-y-1/4">
        <MailIcon />
      </Link>

      <Link to={'https://www.instagram.com/andrea_windisch_/'} target="_blank" className="translate-y-1/4">
        <InstagramIcon />
      </Link>

      <Link to={'https://github.com/andrea0815'} target="_blank" className="translate-y-1/4">
        <GithubIcon />
      </Link>

      <Link to={'https://www.linkedin.com/in/andrea-windisch-16849518b/'} target="_blank" className="translate-y-1/4">
        <LinkedInIcon />
      </Link>

    </div>
  );
}

export default SocialList;
