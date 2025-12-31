import { useEffect } from "react";
import { useScramble } from "use-scramble";

type ScrambleTextProps = {
    text: string;
    isStatic?: boolean;
};

function ScrambleText({ text, isStatic = false }: ScrambleTextProps) {

    const { ref: textEl, replay } = useScramble({
        text: text,
        scramble: 3,
        speed: 0.5,
        ignore: [" "],
        playOnMount: false,
        overflow: true,
        overdrive: false,
    });

    useEffect(() => {
        replay();

    }, [])

    const handleClick = () => {
        if (!isStatic) {
            replay();
        }
    }

    return (
        <p
            ref={textEl}
            onMouseEnter={handleClick}
            onClick={handleClick}
            className="hoverEl text-inherit font-[inherit] [font-size:inherit] hover:text-text-highlight"
        >
            {text}
        </p>
    );
}

export default ScrambleText;
