'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _interact = require('interact.js');

var _interact2 = _interopRequireDefault(_interact);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _utils = require('../utils');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Group = function (_Component) {
  _inherits(Group, _Component);

  function Group(props) {
    _classCallCheck(this, Group);

    var _this = _possibleConstructorReturn(this, (Group.__proto__ || Object.getPrototypeOf(Group)).call(this, props));

    _this.handleContextMenu = function (e) {
      if (_this.props.onContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        _this.props.onContextMenu(_this.group, e);
      }
    };

    _this.onMouseDown = function (e) {
      if (!_this.state.interactMounted) {
        e.preventDefault();
        _this.startedClicking = true;
      }
    };

    _this.onMouseUp = function (e) {
      if (!_this.state.interactMounted && _this.startedClicking) {
        _this.startedClicking = false;
        _this.actualClick(e, 'click');
      }
    };

    _this.onTouchStart = function (e) {
      if (!_this.state.interactMounted) {
        e.preventDefault();
        _this.startedTouching = true;
      }
    };

    _this.onTouchEnd = function (e) {
      if (!_this.state.interactMounted && _this.startedTouching) {
        _this.startedTouching = false;
        _this.actualClick(e, 'touch');
      }
    };

    _this.state = {
      interactMounted: false
    };
    return _this;
  }

  _createClass(Group, [{
    key: 'cacheDataFromProps',
    value: function cacheDataFromProps(props) {
      this.group = props.group;
      this.groupTitle = (0, _utils._get)(props.group, props.keys.groupTitleKey);
    }
  }, {
    key: 'componentWillReceiveProps',
    value: function componentWillReceiveProps(nextProps) {
      this.cacheDataFromProps(nextProps);

      var interactMounted = this.state.interactMounted;


      if (!interactMounted) {
        this.mountInteract();
      }
    }
  }, {
    key: 'mountInteract',
    value: function mountInteract() {
      var _this2 = this;

      (0, _interact2.default)(this.refs.group).draggable(false).resizable(false).gesturable(false).dropzone({
        accept: '.draggable',
        checker: function checker(dragEvent, // related dragmove or dragend
        event, // Touch, Pointer or Mouse Event
        dropped, // bool default checker result
        dropzone, // dropzone Interactable
        dropElement, // dropzone elemnt
        draggable, // draggable Interactable
        draggableElement) {
          // draggable element
          return dropped && _this2.props.group.dropTarget;
        },
        ondrop: function ondrop(event) {
          if (_this2.props.onDrop) {
            _this2.props.onDrop(_this2.props.group);
          }
          event.target.classList.remove('selected');
        },
        ondropmove: function ondropmove(event) {
          event.target.classList.add("selected");
        },
        ondragleave: function ondragleave(event) {
          event.target.classList.remove('selected');
        }
      }).on('tap', function (e) {
        _this2.actualClick(e, e.pointerType === 'mouse' ? 'click' : 'touch');
      });
      this.setState({
        interactMounted: true
      });
    }
  }, {
    key: 'actualClick',
    value: function actualClick(e, clickType) {
      if (this.props.canSelect && this.props.onSelect) {
        this.props.onSelect(this.group, clickType, e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      var _props = this.props,
          group = _props.group,
          className = _props.className,
          style = _props.style;
      var _props$keys = this.props.keys,
          groupIdKey = _props$keys.groupIdKey,
          groupTitleKey = _props$keys.groupTitleKey;


      var classNames = className + (group.dropTarget ? ' dropTarget' : ' ');

      return _react2.default.createElement(
        'div',
        _extends({}, this.props.group.groupProps, {
          key: (0, _utils._get)(group, groupIdKey),
          ref: 'group',
          className: classNames, style: style,
          onContextMenu: this.handleContextMenu,
          onMouseDown: this.onMouseDown,
          onMouseUp: this.onMouseUp,
          onTouchStart: this.onTouchStart,
          onTouchEnd: this.onTouchEnd }),
        (0, _utils._get)(group, groupTitleKey)
      );
    }
  }]);

  return Group;
}(_react.Component);

Group.propTypes = {
  group: _react2.default.PropTypes.object.isRequired,
  onSelect: _react2.default.PropTypes.func,
  onDrop: _react2.default.PropTypes.func,
  onContextMenu: _react2.default.PropTypes.func
};
Group.defaultProps = {
  selected: false
};
exports.default = Group;