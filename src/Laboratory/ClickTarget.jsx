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
  return (
    <Rect
      {...props}
      onMouseEnter={(e) => {
        hoverProps.onMouseEnter(e);
        props.onMouseEnter?.(e)
      }}
      onMouseLeave={(e) => {
        hoverProps.onMouseLeave(e);
        props.onMouseLeave?.(e)
      }}
      fill="transparent"
      onTap={props.onClick}
    />
  );
};

export { hoverProps, setCursorStyle };

export default ClickTarget;
