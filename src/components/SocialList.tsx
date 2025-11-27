import { Link } from "react-router-dom";
import { useTerminalQueue } from "../stores/useTerminalQueue";
import textData from "../texts.json";

import InstagramIcon from './icons/InstagramIcon';
import GithubIcon from './icons/GithubIcon';
import LinkedInIcon from './icons/LinkedInIcon';
import MailIcon from './icons/MailIcon';


function SocialList() {

  const enqueueLine = useTerminalQueue((s) => s.enqueueLine);
  const clearActives = useTerminalQueue((s) => s.clearActives);
  const linkText: string = textData.link[0]

  function handleClick(link: string): void {
    clearActives();
    enqueueLine("");
    enqueueLine(linkText, link);

  }

  function handleMailClick(link: string): void {
    clearActives();
    enqueueLine("");
    enqueueLine("you can contact me via mail:");
    enqueueLine(`${link}`);
  }

  return (
    <div className='flex flex-col gap-5'>

      <div onClick={() => { handleMailClick("mail@andreawindisch.com") }} className="hoverEl translate-y-1/4">
        <MailIcon />
      </div>

      <Link to={'https://www.instagram.com/andrea_windisch_/'} onClick={() => { handleClick("https://www.instagram.com/andrea_windisch_/") }} target="_blank" className="hoverEl translate-y-1/4">
        <InstagramIcon />
      </Link>

      <Link to={'https://github.com/andrea0815'} onClick={() => { handleClick("https://github.com/andrea0815") }} target="_blank" className="hoverEl translate-y-1/4">
        <GithubIcon />
      </Link>

      <Link to={'https://www.linkedin.com/in/andrea-windisch-16849518b/'} onClick={() => { handleClick("https://www.linkedin.com/in/andrea-windisch-16849518b/") }} target="_blank" className="hoverEl translate-y-1/4">
        <LinkedInIcon />
      </Link>

    </div>
  );
}

export default SocialList;
