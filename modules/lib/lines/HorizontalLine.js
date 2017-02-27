'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _utils = require('../utils');

var _interact = require('interact.js');

var _interact2 = _interopRequireDefault(_interact);

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var HorizontalLine = function (_Component) {
  _inherits(HorizontalLine, _Component);

  function HorizontalLine(props) {
    _classCallCheck(this, HorizontalLine);

    var _this = _possibleConstructorReturn(this, (HorizontalLine.__proto__ || Object.getPrototypeOf(HorizontalLine)).call(this, props));

    _this.handleContextMenu = function (e) {
      if (_this.props.onContextMenu) {
        e.preventDefault();
        e.stopPropagation();
        var dropTime = _this.dragTime(e);
        _this.props.onContextMenu(_this.group, (0, _moment2.default)(dropTime));
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
        console.log("Clicky uip");
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

  _createClass(HorizontalLine, [{
    key: 'cacheDataFromProps',
    value: function cacheDataFromProps(props) {
      this.group = props.group;
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
    key: 'dragTimeSnap',
    value: function dragTimeSnap(dragTime, considerOffset) {
      var dragSnap = this.props.dragSnap;

      if (dragSnap) {
        var offset = considerOffset ? (0, _moment2.default)().utcOffset() * 60 * 1000 : 0;
        return Math.round(dragTime / dragSnap) * dragSnap - offset % dragSnap;
      } else {
        return dragTime;
      }
    }
  }, {
    key: 'coordinateToTimeRatio',
    value: function coordinateToTimeRatio() {
      var props = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.props;

      return (props.canvasTimeEnd - props.canvasTimeStart) / props.canvasWidth;
    }
  }, {
    key: 'dragTime',
    value: function dragTime(e) {
      var dragSnap = this.props.dragSnap;

      var viewportOffset = this.refs.hline.getBoundingClientRect();
      var x = e.pageX - viewportOffset.left;

      var time = Math.round(this.props.canvasTimeStart + x / this.props.canvasWidth * (this.props.canvasTimeEnd - this.props.canvasTimeStart));
      time = Math.floor(time / dragSnap) * dragSnap;
      return time;
    }
  }, {
    key: 'mountInteract',
    value: function mountInteract() {
      var _this2 = this;

      console.log("NMount");
      (0, _interact2.default)(this.refs.hline).draggable(false).resizable(false).gesturable(false).dropzone({
        accept: '.draggable',
        ondrop: function ondrop(event) {
          var dropTime = _this2.dragTime(event.dragEvent);
          _this2.props.onDrop(_this2.props.group, (0, _moment2.default)(dropTime));
          event.target.classList.remove('selected');
        },
        ondropmove: function ondropmove(event) {
          event.target.classList.add("selected");
        },
        ondragleave: function ondragleave(event) {
          console.log("onDropLeave");
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
        var clickTime = this.dragTime(e);
        this.props.onSelect(this.group, clickTime, clickType, e);
      }
    }
  }, {
    key: 'render',
    value: function render() {
      return _react2.default.createElement('div', { ref: 'hline',
        className: this.props.className,
        style: this.props.style,
        onContextMenu: this.handleContextMenu,
        onMouseDown: this.onMouseDown,
        onMouseUp: this.onMouseUp,
        onTouchStart: this.onTouchStart,
        onTouchEnd: this.onTouchEnd
      });
    }
  }]);

  return HorizontalLine;
}(_react.Component);

exports.default = HorizontalLine;


HorizontalLine.propTypes = {
  canvasTimeStart: _react2.default.PropTypes.number.isRequired,
  canvasTimeEnd: _react2.default.PropTypes.number.isRequired,
  canvasWidth: _react2.default.PropTypes.number.isRequired,
  group: _react2.default.PropTypes.object.isRequired,
  onSelect: _react2.default.PropTypes.func,
  onDrop: _react2.default.PropTypes.func,
  onContextMenu: _react2.default.PropTypes.func
};

HorizontalLine.defaultProps = {
  borderWidth: 1,
  selected: false

};