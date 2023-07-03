import { Rect } from 'react-konva';

const setCursorStyle = (e, style) => {
  const container = e.target.getStage().container();
  container.style.cursor = style;
};

const hoverProps = {
  onMouseEnter: (e) => setCursorStyle(e, "pointer"),
  onMouseLeave: (e) => setCursorStyle(e, "default"),
};

const ClickTarget = (props) => {
  return <Rect {...props} {...hoverProps} fill="transparent" />;
};

export { hoverProps, setCursorStyle };

export default ClickTarget
