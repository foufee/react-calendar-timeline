import React, { Component } from 'react'
import { _get} from '../utils'
import interact from 'interact.js';
import moment from 'moment';
export default class HorizontalLine extends Component {
  constructor (props) {
    super(props)
    this.state = {
      interactMounted: false,
    }
  }

  cacheDataFromProps (props) {
    this.group = props.group
  }

  componentWillReceiveProps (nextProps) {
    this.cacheDataFromProps(nextProps)
    let {interactMounted} = this.state

    if (!interactMounted) {
      this.mountInteract()
    }
  }

  dragTimeSnap (dragTime, considerOffset) {
    const { dragSnap } = this.props
    if (dragSnap) {
      const offset = considerOffset ? moment().utcOffset() * 60 * 1000 : 0
      return Math.round(dragTime / dragSnap) * dragSnap - offset % dragSnap
    } else {
      return dragTime
    }
  }

  coordinateToTimeRatio (props = this.props) {
    return (props.canvasTimeEnd - props.canvasTimeStart) / props.canvasWidth
  }

  dragTime (e) {
    const { dragSnap } = this.props
    const viewportOffset = this.refs.hline.getBoundingClientRect()
    const x = e.pageX - viewportOffset.left

    let time = Math.round(this.props.canvasTimeStart + x / this.props.canvasWidth * (this.props.canvasTimeEnd - this.props.canvasTimeStart))
    time = Math.floor(time / dragSnap) * dragSnap
    return time
  }

  mountInteract () {
    console.log("NMount");
    interact(this.refs.hline)
      .draggable(false)
      .resizable(false)
      .gesturable(false)
      .dropzone({
        accept: '.draggable',
        ondrop: (event) => {
          let dropTime = this.dragTime(event.dragEvent)
          this.props.onDrop(this.props.group, moment(dropTime))
          event.target.classList.remove('selected');
        },
        ondropmove: (event) => {
          event.target.classList.add("selected")
        },
        ondragleave: (event) => {
          console.log("onDropLeave")
          event.target.classList.remove('selected');
        },
      })
      .on('tap', (e) => {
        this.actualClick(e, e.pointerType === 'mouse' ? 'click' : 'touch')
      });
    this.setState(
      {
        interactMounted: true
      }
    )
  }

  handleContextMenu = (e) => {
    if (this.props.onContextMenu) {
      e.preventDefault()
      e.stopPropagation()
      let dropTime = this.dragTime(e)
      this.props.onContextMenu(this.group, moment(dropTime))
    }
  };

  actualClick (e, clickType) {
    if (this.props.canSelect && this.props.onSelect) {
      let clickTime = this.dragTime(e)
      this.props.onSelect(this.group, clickTime, clickType, e)
    }
  }

  onMouseDown = (e) => {
    if (!this.state.interactMounted) {
      e.preventDefault()
      this.startedClicking = true
    }
  };

  onMouseUp = (e) => {
    if (!this.state.interactMounted && this.startedClicking) {
      this.startedClicking = false
      console.log("Clicky uip")
      this.actualClick(e, 'click')
    }
  };
  onTouchStart = (e) => {
    if (!this.state.interactMounted) {
      e.preventDefault()
      this.startedTouching = true
    }
  };

  onTouchEnd = (e) => {
    if (!this.state.interactMounted && this.startedTouching) {
      this.startedTouching = false
      this.actualClick(e, 'touch')
    }
  }

  render () {
    return (
      <div ref='hline'
           className={this.props.className}
           style={this.props.style}
           onContextMenu={this.handleContextMenu}
           onMouseDown={this.onMouseDown}
           onMouseUp={this.onMouseUp}
           onTouchStart={this.onTouchStart}
           onTouchEnd={this.onTouchEnd}
      />)
  }
}

HorizontalLine.propTypes = {
  canvasTimeStart: React.PropTypes.number.isRequired,
  canvasTimeEnd: React.PropTypes.number.isRequired,
  canvasWidth: React.PropTypes.number.isRequired,
  group: React.PropTypes.object.isRequired,
  onSelect: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  onContextMenu: React.PropTypes.func
}

HorizontalLine.defaultProps = {
  borderWidth: 1,
  selected: false

}
