import * as React from 'react';
import { Group, Rect, Line } from 'react-konva';
import { TransformerForProps, LayoutForProps } from '../../../Layout';
import Nothing from '../../../Layout/Nothing';
import { transformObject } from '../../../../types/viewport';
import { noop } from '../../../../types/utils';

interface OwnProps {
  x?: number;
  y?: number;
  width?: number;
  height?: number;
  disabled?: boolean;
  show: boolean;
  backgroundColor: string;
  color: string;
  action: () => void;
}

type Props = OwnProps & LayoutForProps & TransformerForProps;

interface State {
  width: number;
  height: number;
}

const TriangleUp = (x: number, y: number, base: number, height: number, color: string) => (
  <Line
    points={[x + base / 2, y + 0, x + base, y + height, x + 0, y + height]}
    closed={true}
    fill={color}
  />);

const TriangleDown = (x: number, y: number, base: number, height: number, color: string) => (
  <Line
    points={[x + 0, y + 0, x + base, y + 0, x + base / 2, y + height]}
    closed={true}
    fill={color}
  />);

class Toggle extends React.PureComponent<Props, State> {

  static style = {
    height: 20,
    cornerRadius: 4,
    triangle: {
      base: 10,
      height: 5,
      x: -5,
      yUp: 8.5,
      yDown: 6.5,
    },
  };

  handleResize = (): void => {
    const { transform, width = 0, onResize = noop } = this.props;
    const { height } = transformObject(transform, Toggle.style) as typeof Toggle.style;
    onResize(width, height);
  }

  render() {
    const { transform, x = 0, y = 0, width = 0, disabled = false, backgroundColor, color } = this.props;
    const style = transformObject(transform, Toggle.style) as typeof Toggle.style;

    return (
      <Group x={x} y={y} onClick={disabled ? undefined : this.props.action}>
        <Nothing onResize={this.handleResize} />
        <Rect
          width={width}
          height={style.height}
          fill={backgroundColor}
          cornerRadius={style.cornerRadius}
        />
        <Rect
          width={width}
          height={style.cornerRadius}
          fill={backgroundColor}
        />
        {this.props.show
          ? TriangleUp(
            width / 2 + style.triangle.x,
            style.triangle.yUp,
            style.triangle.base,
            style.triangle.height,
            disabled
              ? backgroundColor
              : color,
          )
          : TriangleDown(
            width / 2 + style.triangle.x,
            style.triangle.yDown,
            style.triangle.base,
            style.triangle.height,
            disabled
              ? backgroundColor
              : color,
          )}
      </Group>
    );
  }
}

export default Toggle;
