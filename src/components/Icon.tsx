interface IconProps {
  icon: string;
  name: string;
  onOpen?: () => void;
}

function Icon({ icon, name, onOpen }: IconProps) {
  return (
    <button className="desktop-icon" onDoubleClick={onOpen} onClick={onOpen}>
      <span className="desktop-icon__glyph">{icon}</span>
      <span className="desktop-icon__label">{name}</span>
    </button>
  );
}

export default Icon;
