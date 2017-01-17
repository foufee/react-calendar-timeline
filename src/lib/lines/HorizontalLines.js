import React, { Component } from 'react'
import HorizontalLine from './HorizontalLine'
import { _length, _get  } from '../utils.js'

export default class HorizontalLines extends Component {
  shouldComponentUpdate (nextProps, nextState) {
    return !(nextProps.canvasWidth === this.props.canvasWidth &&
             nextProps.lineHeight === this.props.lineHeight &&
             nextProps.lineCount === this.props.lineCount &&
             nextProps.groupHeights === this.props.groupHeights)
  }

  render () {
    const { groups, canvasWidth, groupHeights, headerHeight } = this.props
    let lines = []
    let lineCount = _length(groups)
    var totalHeight = headerHeight
    for (let i = 0; i < lineCount; i++) {
      let group = _get(groups,i)

      const elementStyle = {
        top: `${totalHeight}px`,
        left: '0px',
        width: `${canvasWidth}px`,
        height: `${groupHeights[i] - 1}px`,
        lineHeight: `${groupHeights[i] - 1}px`,
        opacity: 0.99
      }
      lines.push(

        <HorizontalLine
          canvasTimeStart={this.props.canvasTimeStart}
          canvasTimeEnd={this.props.canvasTimeEnd}
          canvasWidth={this.props.canvasWidth}
          dragSnap={this.props.dragSnap}
          keys={this.props.keys}
          key={`horizontal-line-${i}`}
          className={i % 2 === 0 ? 'rct-hl-even' : 'rct-hl-odd'}
          group={group}
          style={elementStyle}
          onDrop={this.props.onGroupTimelineDrop}
          onContextMenu={this.props.onGroupTimelineContextMenu}
          onSelect={this.props.onGroupTimelineSelect}
          canSelect={_get(group, 'canSelect') !== undefined ? _get(group, 'canSelect') : this.props.canSelect}
              />)
      totalHeight += groupHeights[i]
    }

    return (
      <div className='rct-horizontal-lines'>
        {lines}
      </div>
    )
  }
}

HorizontalLines.propTypes = {
  canvasTimeStart: React.PropTypes.number.isRequired,
  canvasTimeEnd: React.PropTypes.number.isRequired,
  canvasWidth: React.PropTypes.number.isRequired,
  groups: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  canvasWidth: React.PropTypes.number.isRequired,
  lineHeight: React.PropTypes.number.isRequired
}
HorizontalLines.defaultProps = {
  borderWidth: 1
}
