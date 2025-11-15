import { useRef, useEffect, useState } from 'react';
import terminalData from '../terminal.json';


function Terminal() {

    const terminal = useRef<HTMLParagraphElement | null>(null);
    const greetingText: string = terminalData.greeting[0];
    const workExperienceLines: string[] = terminalData.workExperience;

    const [staticText, setStaticText] = useState<string>(terminalData.static[0]);


    const activeElements: HTMLSpanElement[] = [];

    function setLine(lineText: string, input: string | null = null): void {
        let newText: string = lineText;

        const lineEl: HTMLSpanElement = document.createElement('span');
        lineEl.classList.add("line");

        const staticEl: HTMLSpanElement = document.createElement('span');
        staticEl.classList.add('static');
        staticEl.innerText = staticText;

        const outputEl: HTMLSpanElement = document.createElement('span');
        outputEl.classList.add('output');
        outputEl.classList.add('active');
        if (input && newText.includes("BLANK")) {
            newText = newText.replace("BLANK", input);
        } else if (newText.includes("BLANK") && !input) {
            console.error("BLANK found but no input provided");
        } else if (!newText.includes("BLANK") && input) {
            console.warn("Input provided but no BLANK found");
        }

        outputEl.innerText = newText;


        lineEl.appendChild(staticEl)
        lineEl.appendChild(outputEl)

        terminal.current?.appendChild(lineEl);
    }

    function setLines(lines: string[] | string, input: string[] | string | null = null): void {
        if (typeof lines === "string" && Array.isArray(input)) {
            input.forEach((input) => {
                setLine(lines, input);
            })
        } else if (Array.isArray(lines) && (typeof input === "string" || input === null)) {
            lines.forEach((line) => {
                setLine(line, input);
            })
        } else if (Array.isArray(lines) && Array.isArray(input)) {
            lines.forEach((line, index) => {
                setLine(line, input[index]);
            })
        }
    }

    useEffect(() => {

        setLine(greetingText, 'illustrator');
        setLine(greetingText, 'creative developer');
        setLines(workExperienceLines);

        const updateStaticText = () => {
            if (window.innerWidth < 640) {
                setStaticText(terminalData.static[1]);
            } else {
                setStaticText(terminalData.static[0]);
            }
        };

        updateStaticText();
        window.addEventListener("resize", updateStaticText);

        return () => window.removeEventListener("resize", updateStaticText);




    }, [])

    useEffect(() => {
        const staticElements = terminal.current?.querySelectorAll<HTMLSpanElement>(".static");
        staticElements?.forEach(el => {
            el.innerText = staticText;
        });
    }, [staticText]);


    return (
        <div className='[grid-area:main] self-end mix-blend-difference'>
            <p ref={terminal} className="terminal w-fit flex flex-col leading-[1.2em]"></p>
        </div >
    );
}



export { Terminal as default };
