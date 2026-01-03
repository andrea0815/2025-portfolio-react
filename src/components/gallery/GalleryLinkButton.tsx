import ScrambleText from '../base/ScrambleText';

type GalleryLinkButtonProps = {
    text: string,
    url: string,
}

function GalleryLinkButton({ text, url }: GalleryLinkButtonProps) {
    return (
        <a
            href={url}
            target="_blank"
            className='hoverEl px-4 pt-2 pb-2 border border-text  hover:border-text-highlight rounded-4xl z-50'
        >
            <ScrambleText
                text={text}
            />
        </a>
    );
}

export default GalleryLinkButton;
