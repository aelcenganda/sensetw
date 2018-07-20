import * as React from 'react';
import { Group, Rect, Circle, Text } from 'react-konva';
import TagList from '../TagList';
import * as T from '../../../types';
import { noop, toTags } from '../../../types/utils';
import { Event as KonvaEvent } from '../../../types/konva';
import * as G from '../../../graphics/point';

interface Props {
  isDirty?: boolean;
  mapObject: T.ObjectData;
  card: T.CardData;
  selected?: Boolean;
  transform: G.Transform;
  inverseTransform: G.Transform;
  handleSelect?(object: T.ObjectData): void;
  handleDeselect?(object: T.ObjectData): void;
  handleDragStart?(e: KonvaEvent.Mouse): void;
  handleDragMove?(e: KonvaEvent.Mouse): void;
  handleDragEnd?(e: KonvaEvent.Mouse): void;
  openCard?(id: T.CardID): void;
}

interface State {
  tagHeight: number;
  newlySelected: boolean;
}

const cornerRadius = 4;

const dirtyRadius = 5;
const dirtyPadding = 10;
const dirtyColor = '#3ad8fa';

const summaryPadding = 0;
const summaryOffsetX = 10 - summaryPadding;
const summaryOffsetY = 8 - summaryPadding;
const summaryFontFamily = 'sans-serif';
const summaryFontSize = 16;
const summaryAbsoluteLineHegiht = 22;
const summaryLineHeight = summaryAbsoluteLineHegiht / summaryFontSize;
const summaryHeight = summaryAbsoluteLineHegiht * 3;
const summaryColor = '#000000';
const summaryLimit = 39;

const titlePadding = 0;
const titleOffsetX = 10 - titlePadding;
const titleOffsetY = 12 + summaryHeight - summaryPadding - titlePadding;
const titleFontFamily = 'sans-serif';
const titleFontSize = 13;
const titleAbsoluteLineHeight = 16;
const titleLineHeight = titleAbsoluteLineHeight / titleFontSize;
const titleHeight = titleAbsoluteLineHeight * 2;
const titleColor = '#5a5a5a';
const titleLimit = 32;

const color = {
  [T.CardType.NORMAL]: 'rgba(255, 255, 255, 1)',
  [T.CardType.NOTE]: 'rgba(255, 255, 255, 1)',
  [T.CardType.QUESTION]: 'rgba(255, 236, 239, 1)',
  [T.CardType.ANSWER]: 'rgba(222, 255, 245, 1)'
};

const shadowBlur = 10;
const shadowColor = '#999';
const shadowOffsetX = 2;
const shadowOffsetY = 3;

const selectedOffsetX = -6;
const selectedOffsetY = -6;
const selectedCornerRadius = 8;
const selectedColor = '#3ad8fa';
const selectedStrokeWidth = 3;

const tagLeft = 8;
const tagBottom = 8;

class Card extends React.Component<Props, State> {
  state = {
    tagHeight: 0,
    newlySelected: false,
  };

  render() {
    const { isDirty = false } = this.props;
    const { data } = this.props.mapObject;
    const { x, y, width, height } = this.props.transform({
      x: this.props.mapObject.x,
      y: this.props.mapObject.y,
      width: this.props.mapObject.width,
      height: this.props.mapObject.height,
    });
    const {title, summary, cardType, tags} = this.props.card;
    const sanitizedSummary = summary.substr(0, summaryLimit);
    const sanitizedTitle   = title.substr(0, titleLimit);
    const tagHeight = this.state.tagHeight;
    const selectedWidth = width - selectedOffsetX * 2;
    const selectedHeight = height - selectedOffsetY * 2;
    const summaryWidth = width - summaryOffsetX * 2;
    const titleWidth = width - titleOffsetX * 2;

    const handleSelect    = this.props.handleSelect    || noop;
    const handleDeselect  = this.props.handleDeselect  || noop;
    const handleDragStart = this.props.handleDragStart || noop;
    const handleDragMove  = this.props.handleDragMove  || noop;
    const handleDragEnd   = this.props.handleDragEnd   || noop;
    const openCard        = this.props.openCard        || noop;
    const bgColor         = color[cardType];

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

    return (
      <Group
        x={x}
        y={y}
        draggable={true}
        onMouseDown={(e) => {
          e.cancelBubble = true;
          if (this.props.selected) {
            return;
          }
          this.setState({ newlySelected: true });
          handleSelect(this.props.mapObject);
        }}
        onClick={(e) => {
          e.cancelBubble = true;
          if (!this.state.newlySelected) {
            handleDeselect(this.props.mapObject);
          }
          this.setState({ newlySelected: false });
        }}
        onDblClick={() => {
          handleSelect(this.props.mapObject);
          openCard(data);
        }}
        onMouseUp={(e) => {
          e.cancelBubble = true;
        }}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        {this.props.selected ? selected : null}
        <Rect
          width={width}
          height={height}
          fill={bgColor}
          cornerRadius={cornerRadius}
          shadowBlur={shadowBlur}
          shadowOffsetX={shadowOffsetX}
          shadowOffsetY={shadowOffsetY}
          shadowColor={shadowColor}
        />
        {
          isDirty &&
          <Circle
            x={width - dirtyPadding}
            y={dirtyPadding}
            radius={dirtyRadius}
            fill={dirtyColor}
          />
        }
        <Text
          x={summaryOffsetX}
          y={summaryOffsetY}
          width={summaryWidth}
          height={summaryHeight}
          padding={summaryPadding}
          fontSize={summaryFontSize}
          fontFamily={summaryFontFamily}
          lineHeight={summaryLineHeight}
          fill={summaryColor}
          text={sanitizedSummary}
        />
        <Text
          x={titleOffsetX}
          y={titleOffsetY}
          width={titleWidth}
          height={titleHeight}
          padding={titlePadding}
          fontSize={titleFontSize}
          fontFamily={titleFontFamily}
          lineHeight={titleLineHeight}
          fill={titleColor}
          text={sanitizedTitle}
        />
        <TagList
          x={tagLeft}
          y={height - tagBottom - tagHeight}
          width={width - 2 * tagLeft}
          tags={toTags(tags)}
          onResize={(w, h) => this.setState({ tagHeight: h })}
        />
      </Group>
    );
  }
}

export default Card;
