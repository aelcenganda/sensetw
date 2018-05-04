
import * as React from 'react';
import { Group, Rect, Text } from 'react-konva';
import * as SO from '../../types/sense-object';
import * as SB from '../../types/sense-box';
import { noop } from '../../types/utils';
import { moveStart, moveEnd } from '../../tools/point';

interface Props {
  mapObject: SO.ObjectData;
  box: SB.BoxData;
  selected?: Boolean;
  toggleSelection?(id: SO.ObjectID): void;
  moveObject?(id: SO.ObjectID, x: number, y: number): void;
  openBox?(box: SB.BoxID): void;
}

const width = 240;
const height = 90;
const borderColor = '#707070';
const borderWidth = 8;
const bgColor = '#ffffff';
const cornerRadius = 4;

const titlePadding = 0;
const titleWidth = 180;
const titleOffsetX = (width - (titleWidth + titlePadding)) / 2;
const titleFontFamily = 'sans-serif';
const titleColor = '#000000';
const titleFontSize = 20;
const titleLineHeight = 22 / titleFontSize;
const titleOffsetY = (height - titleFontSize) / 2;
const titleLineBreak = 9;
const titleLimit = 18;

const selectedOffsetX = -6;
const selectedOffsetY = -6;
const selectedWidth = width - selectedOffsetY * 2;
const selectedHeight = height - selectedOffsetX * 2;
const selectedCornerRadius = 4;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 2;

function MapBox(props: Props) {
  const {id, x, y} = props.mapObject;
  const {title} = props.box;
  const sanitizedTitle = title.substr(0, titleLimit);
  const boxID = props.box.id;

  const toggleSelection = props.toggleSelection || noop;
  const moveObject      = props.moveObject      || noop;
  const openBox         = props.openBox         || noop;

  const selected = (
    <Rect
      x={selectedOffsetX}
      y={selectedOffsetY}
      width={selectedWidth}
      height={selectedHeight}
      cornerRadius={selectedCornerRadius}
      stroke={selectedColor}
      strokeWidth={selectedStrokeWidth}
    />);

  const offsetY = sanitizedTitle.length <= titleLineBreak ? titleOffsetY : titleOffsetY - titleFontSize / 2;
  // tslint:disable-next-line:no-console
  console.log(titleOffsetY, offsetY, sanitizedTitle.length);

  return (
    <Group
      x={x}
      y={y}
      key={id}
      draggable={true}
      onClick={() => toggleSelection(id)}
      onDragStart={(e) => moveStart(id, x, y, e.evt.layerX, e.evt.layerY)}
      onDragEnd={(e) => {
        // XXX TypeScript ought to understand this...
        // return moveObject(id, ...moveEnd(id, e.evt.layerX, e.evt.layerY));
        const r = moveEnd(id, e.evt.layerX, e.evt.layerY);
        return moveObject(id, r[0], r[1]);
      }}
      onDblClick={() => openBox(boxID)}
    >
      {props.selected ? selected : null}
      <Rect
        fill={bgColor}
        width={width}
        height={height}
        stroke={borderColor}
        strokeWidth={borderWidth}
        cornerRadius={cornerRadius}
      />
      <Text
        x={titleOffsetX}
        y={offsetY}
        align="center"
        width={titleWidth}
        fill={titleColor}
        fontFamily={titleFontFamily}
        fontSize={titleFontSize}
        lineHeight={titleLineHeight}
        padding={titlePadding}
        text={title}
      />
    </Group>
  );
}

export default MapBox;
