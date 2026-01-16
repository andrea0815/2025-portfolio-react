import { useMediaQuery } from "../../hooks/useMediaQuery";

interface IconProps {
    size?: number,
    children: React.ReactNode;
}

export default function Icon({
  children,
  size = 20,
}: IconProps) {

  const iconSize = useMediaQuery("(min-width: 768px)") ? size : size * 0.9;

  return (
    <div
      className="icon hoverEl flex justify-center items-center hoverFlicker"
      style={{ width: iconSize, height: iconSize }}
    >
      {children}
    </div>
  );
}