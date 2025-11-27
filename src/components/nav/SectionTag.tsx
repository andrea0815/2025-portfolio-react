import ScrambleText from '../base/scrambleText';

type SectionTagProps = {
  text: string;
};

function SectionTag({ text }: SectionTagProps) {

  console.log(text);

  const handleClick = () => {

  }

  return (
    <a onClick={handleClick} className='ml-2'>
      <ScrambleText text={text} />
    </a>
  );
}

export default SectionTag;
