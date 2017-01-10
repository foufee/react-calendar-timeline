import React, { Component } from 'react'
import { _get} from '../utils'

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

  mountInteract () {
    console.log("NMount");
    interact(this.refs.hline)
      .draggable(false)
      .resizable(false)
      .gesturable(false)
      .dropzone({
        accept: '.draggable',
        ondrop: (event) => {
          if (this.props.onDrop) {
            this.props.onDrop(this.props.group)
          }
          event.target.classList.remove('selected');
        },
        ondropmove: (event) => {
          event.target.classList.add("selected")
        },
        ondragleave: (event) => {
          event.target.classList.remove('selected');
        },
      })
      .on('tap', (e) => {
        this.actualClick(e, e.pointerType === 'mouse' ? 'click' : 'touch')
      })
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
      this.props.onContextMenu(this.group, e)
    }
  };

  actualClick (e, clickType) {
    if (this.props.canSelect && this.props.onSelect) {
      this.props.onSelect(this.group, clickType, e)
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
  group: React.PropTypes.object.isRequired,
  onSelect: React.PropTypes.func,
  onDrop: React.PropTypes.func,
  onContextMenu: React.PropTypes.func
}

HorizontalLine.defaultProps = {
  borderWidth: 1,
  selected: false

}
