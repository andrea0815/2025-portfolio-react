interface IconProps {
    size?: number,
    children: React.ReactNode;
}

export default function Icon({
  children,
  size = 25,
}: IconProps) {
  return (
    <div
      className="icon hoverEl flex justify-center items-center hoverFlicker"
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}