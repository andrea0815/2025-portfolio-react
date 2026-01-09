import ScrambleText from '../base/ScrambleText';

type TopicTagProps = {
  text: string;
  isCurrent: boolean;
  showAll: boolean;
  onSelect: () => void;
  onHoverEnter: () => void;
  onHoverLeave: () => void;
};

function TopicTag({ text, isCurrent, showAll, onSelect, onHoverEnter, onHoverLeave }: TopicTagProps) {

  const handleClick = () => {
    onSelect();
  }

  return (
    <a
      onClick={handleClick}
      onMouseEnter={onHoverEnter}
      onMouseLeave={onHoverLeave}
      className={`topicEl pl-2 hoverEl bg-grayish
        ${isCurrent && showAll ? "text-text-highlight" : "text-text"}
      `}>
      <ScrambleText text={text} />
    </a>
  );
}

export default TopicTag;
