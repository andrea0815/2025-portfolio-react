import { useEffect } from "react";
import { useScramble } from "use-scramble";

type ScrambleTextProps = {
    text: string;
};

function ScrambleText({text}: ScrambleTextProps) {

    useEffect(() => {

    }, [text])

    const { ref: textEl, replay } = useScramble({
        text: text,
        scramble: 4,
        speed: 1,
        ignore: [" "],
        playOnMount: false,
        overflow: true,
    });

    const handleClick = () => {
        replay();
    }

    return (
        <p
            ref={textEl}
            onMouseEnter={handleClick}
            onClick={handleClick}
            className="inline-block text-inherit font-[inherit] [font-size:inherit]"
        >
            {text}
        </p>
    );
}

export default ScrambleText;
