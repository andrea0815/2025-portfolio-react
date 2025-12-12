import ScrambleText from '../base/ScrambleText';

type TopicTagProps = {
  text: string;
  isCurrent: boolean;
  onSelect: () => void;
};

function TopicTag({ text, isCurrent, onSelect }: TopicTagProps) {

  const handleClick = () => {
        onSelect();
  }

  return (
    <a onClick={handleClick} className='topicEl ml-2 hoverEl'>
      <ScrambleText text={text} />
    </a>
  );
}

export default TopicTag;
