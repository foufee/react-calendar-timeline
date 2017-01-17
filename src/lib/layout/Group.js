import React, { Component } from 'react'
import interact from 'interact.js'
import moment from 'moment'


import { _get, deepObjectCompare } from '../utils'

export default class Group extends Component {
  static propTypes = {
    group: React.PropTypes.object.isRequired,
    onSelect: React.PropTypes.func,
    onDrop: React.PropTypes.func,
    onContextMenu: React.PropTypes.func
  }

  static defaultProps = {
    selected: false
  }

  constructor (props) {
    super(props)
    this.state = {
      interactMounted: false,
    }
  }

  cacheDataFromProps (props) {
    this.group = props.group
    this.groupTitle = _get(props.group, props.keys.groupTitleKey)
  }

  componentWillReceiveProps (nextProps) {
    this.cacheDataFromProps(nextProps)

    let {interactMounted} = this.state

    if (!interactMounted) {
      this.mountInteract()
    }
  }

  mountInteract () {
    return;
    interact(this.refs.group)
      .draggable(false)
      .resizable(false)
      .gesturable(false)
      .dropzone({
        accept: '.draggable',
        checker: (dragEvent,         // related dragmove or dragend
                   event,             // Touch, Pointer or Mouse Event
                   dropped,           // bool default checker result
                   dropzone,          // dropzone Interactable
                   dropElement,       // dropzone elemnt
                   draggable,         // draggable Interactable
                   draggableElement) => {// draggable element
          return dropped && this.props.group.dropTarget;
        },
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

  render() {
    console.log(this.props)
    const {
      group,className, style
    } = this.props

    const {groupIdKey, groupTitleKey} = this.props.keys

    const classNames = className +
      (group.dropTarget ? ' dropTarget' : ' ')

    return (
      <div key={_get(group, groupIdKey)} className={'rct-sidebar-row' + (i % 2 === 0 ? ' rct-sidebar-row-even' : ' rct-sidebar-row-odd')} style={style}>
        {_get(group, groupTitleKey)}
      </div>
    )
    /*
    return (
    <div {...this.props.group.groupProps}
         key={_get(group, groupIdKey)}
         ref='group'
         className={classNames} style={style}
         onContextMenu={this.handleContextMenu}
         onMouseDown={this.onMouseDown}
         onMouseUp={this.onMouseUp}
         onTouchStart={this.onTouchStart}
         onTouchEnd={this.onTouchEnd}>
        {_get(group, groupTitleKey)}
    </div>
    )
    */
  }
}
