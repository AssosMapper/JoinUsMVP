import { addStyle, isTouchDevice, relativePosition, getOuterWidth, absolutePosition, find, getIndex, getAttribute, findSingle, getFocusableElements, setAttribute } from '@primeuix/utils/dom';
import { localeComparator, isEmpty } from '@primeuix/utils/object';
import { ZIndex } from '@primeuix/utils/zindex';
import { UniqueComponentId, ConnectedOverlayScrollHandler } from '@primevue/core/utils';
import CalendarIcon from '@primevue/icons/calendar';
import ChevronDownIcon from '@primevue/icons/chevrondown';
import ChevronLeftIcon from '@primevue/icons/chevronleft';
import ChevronRightIcon from '@primevue/icons/chevronright';
import ChevronUpIcon from '@primevue/icons/chevronup';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import OverlayEventBus from 'primevue/overlayeventbus';
import Portal from 'primevue/portal';
import Ripple from 'primevue/ripple';
import BaseComponent from '@primevue/core/basecomponent';
import DatePickerStyle from 'primevue/datepicker/style';
import { resolveComponent, resolveDirective, openBlock, createElementBlock, mergeProps, createBlock, normalizeClass, normalizeStyle, createCommentVNode, renderSlot, createElementVNode, resolveDynamicComponent, Fragment, createVNode, withCtx, Transition, renderList, withDirectives, vShow, toDisplayString, createTextVNode, withKeys } from 'vue';

var script$1 = {
  name: 'BaseDatePicker',
  "extends": BaseComponent,
  props: {
    modelValue: null,
    selectionMode: {
      type: String,
      "default": 'single'
    },
    dateFormat: {
      type: String,
      "default": null
    },
    inline: {
      type: Boolean,
      "default": false
    },
    showOtherMonths: {
      type: Boolean,
      "default": true
    },
    selectOtherMonths: {
      type: Boolean,
      "default": false
    },
    showIcon: {
      type: Boolean,
      "default": false
    },
    iconDisplay: {
      type: String,
      "default": 'button'
    },
    icon: {
      type: String,
      "default": undefined
    },
    prevIcon: {
      type: String,
      "default": undefined
    },
    nextIcon: {
      type: String,
      "default": undefined
    },
    incrementIcon: {
      type: String,
      "default": undefined
    },
    decrementIcon: {
      type: String,
      "default": undefined
    },
    numberOfMonths: {
      type: Number,
      "default": 1
    },
    responsiveOptions: Array,
    breakpoint: {
      type: String,
      "default": '769px'
    },
    view: {
      type: String,
      "default": 'date'
    },
    minDate: {
      type: Date,
      value: null
    },
    maxDate: {
      type: Date,
      value: null
    },
    disabledDates: {
      type: Array,
      value: null
    },
    disabledDays: {
      type: Array,
      value: null
    },
    maxDateCount: {
      type: Number,
      value: null
    },
    showOnFocus: {
      type: Boolean,
      "default": true
    },
    autoZIndex: {
      type: Boolean,
      "default": true
    },
    baseZIndex: {
      type: Number,
      "default": 0
    },
    showButtonBar: {
      type: Boolean,
      "default": false
    },
    shortYearCutoff: {
      type: String,
      "default": '+10'
    },
    showTime: {
      type: Boolean,
      "default": false
    },
    timeOnly: {
      type: Boolean,
      "default": false
    },
    hourFormat: {
      type: String,
      "default": '24'
    },
    stepHour: {
      type: Number,
      "default": 1
    },
    stepMinute: {
      type: Number,
      "default": 1
    },
    stepSecond: {
      type: Number,
      "default": 1
    },
    showSeconds: {
      type: Boolean,
      "default": false
    },
    hideOnDateTimeSelect: {
      type: Boolean,
      "default": false
    },
    hideOnRangeSelection: {
      type: Boolean,
      "default": false
    },
    timeSeparator: {
      type: String,
      "default": ':'
    },
    showWeek: {
      type: Boolean,
      "default": false
    },
    manualInput: {
      type: Boolean,
      "default": true
    },
    appendTo: {
      type: [String, Object],
      "default": 'body'
    },
    variant: {
      type: String,
      "default": null
    },
    invalid: {
      type: Boolean,
      "default": false
    },
    disabled: {
      type: Boolean,
      "default": false
    },
    readonly: {
      type: Boolean,
      "default": false
    },
    placeholder: {
      type: String,
      "default": null
    },
    name: {
      type: String,
      "default": null
    },
    id: {
      type: String,
      "default": null
    },
    inputId: {
      type: String,
      "default": null
    },
    inputClass: {
      type: [String, Object],
      "default": null
    },
    inputStyle: {
      type: Object,
      "default": null
    },
    panelClass: {
      type: [String, Object],
      "default": null
    },
    panelStyle: {
      type: Object,
      "default": null
    },
    todayButtonProps: {
      type: Object,
      "default": function _default() {
        return {
          severity: 'secondary',
          text: true,
          size: 'small'
        };
      }
    },
    clearButtonProps: {
      type: Object,
      "default": function _default() {
        return {
          severity: 'secondary',
          text: true,
          size: 'small'
        };
      }
    },
    navigatorButtonProps: {
      type: Object,
      "default": function _default() {
        return {
          severity: 'secondary',
          text: true,
          rounded: true
        };
      }
    },
    timepickerButtonProps: {
      type: Object,
      "default": function _default() {
        return {
          severity: 'secondary',
          text: true,
          rounded: true
        };
      }
    },
    fluid: {
      type: Boolean,
      "default": null
    },
    ariaLabelledby: {
      type: String,
      "default": null
    },
    ariaLabel: {
      type: String,
      "default": null
    }
  },
  style: DatePickerStyle,
  provide: function provide() {
    return {
      $pcDatePicker: this,
      $parentInstance: this
    };
  }
};

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _createForOfIteratorHelper(r, e) { var t = "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (!t) { if (Array.isArray(r) || (t = _unsupportedIterableToArray(r)) || e) { t && (r = t); var _n = 0, F = function F() {}; return { s: F, n: function n() { return _n >= r.length ? { done: !0 } : { done: !1, value: r[_n++] }; }, e: function e(r) { throw r; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var o, a = !0, u = !1; return { s: function s() { t = t.call(r); }, n: function n() { var r = t.next(); return a = r.done, r; }, e: function e(r) { u = !0, o = r; }, f: function f() { try { a || null == t["return"] || t["return"](); } finally { if (u) throw o; } } }; }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
var script = {
  name: 'DatePicker',
  "extends": script$1,
  inheritAttrs: false,
  emits: ['show', 'hide', 'input', 'month-change', 'year-change', 'date-select', 'update:modelValue', 'today-click', 'clear-click', 'focus', 'blur', 'keydown'],
  inject: {
    $pcFluid: {
      "default": null
    }
  },
  navigationState: null,
  timePickerChange: false,
  scrollHandler: null,
  outsideClickListener: null,
  resizeListener: null,
  matchMediaListener: null,
  overlay: null,
  input: null,
  previousButton: null,
  nextButton: null,
  timePickerTimer: null,
  preventFocus: false,
  typeUpdate: false,
  data: function data() {
    return {
      d_id: this.id,
      currentMonth: null,
      currentYear: null,
      currentHour: null,
      currentMinute: null,
      currentSecond: null,
      pm: null,
      focused: false,
      overlayVisible: false,
      currentView: this.view,
      query: null,
      queryMatches: false
    };
  },
  watch: {
    id: function id(newValue) {
      this.d_id = newValue || UniqueComponentId();
    },
    modelValue: function modelValue(newValue) {
      this.updateCurrentMetaData();
      if (!this.typeUpdate && !this.inline && this.input) {
        this.input.value = this.inputFieldValue;
      }
      this.typeUpdate = false;
    },
    showTime: function showTime() {
      this.updateCurrentMetaData();
    },
    minDate: function minDate() {
      this.updateCurrentMetaData();
    },
    maxDate: function maxDate() {
      this.updateCurrentMetaData();
    },
    months: function months() {
      if (this.overlay) {
        if (!this.focused) {
          if (this.inline) {
            this.preventFocus = true;
          }
          setTimeout(this.updateFocus, 0);
        }
      }
    },
    numberOfMonths: function numberOfMonths() {
      this.destroyResponsiveStyleElement();
      this.createResponsiveStyle();
    },
    responsiveOptions: function responsiveOptions() {
      this.destroyResponsiveStyleElement();
      this.createResponsiveStyle();
    },
    currentView: function currentView() {
      var _this = this;
      Promise.resolve(null).then(function () {
        return _this.alignOverlay();
      });
    },
    view: function view(newValue) {
      this.currentView = newValue;
    }
  },
  created: function created() {
    this.updateCurrentMetaData();
  },
  mounted: function mounted() {
    this.d_id = this.d_id || UniqueComponentId();
    this.createResponsiveStyle();
    this.bindMatchMediaListener();
    if (this.inline) {
      if (!this.disabled) {
        this.preventFocus = true;
        this.initFocusableCell();
      }
    } else {
      this.input.value = this.inputFieldValue;
    }
  },
  updated: function updated() {
    if (this.overlay) {
      this.preventFocus = true;
      setTimeout(this.updateFocus, 0);
    }
    if (this.input && this.selectionStart != null && this.selectionEnd != null) {
      this.input.selectionStart = this.selectionStart;
      this.input.selectionEnd = this.selectionEnd;
      this.selectionStart = null;
      this.selectionEnd = null;
    }
  },
  beforeUnmount: function beforeUnmount() {
    if (this.timePickerTimer) {
      clearTimeout(this.timePickerTimer);
    }
    this.destroyResponsiveStyleElement();
    this.unbindOutsideClickListener();
    this.unbindResizeListener();
    this.unbindMatchMediaListener();
    if (this.scrollHandler) {
      this.scrollHandler.destroy();
      this.scrollHandler = null;
    }
    if (this.overlay && this.autoZIndex) {
      ZIndex.clear(this.overlay);
    }
    this.overlay = null;
  },
  methods: {
    isComparable: function isComparable() {
      return this.modelValue != null && typeof this.modelValue !== 'string';
    },
    isSelected: function isSelected(dateMeta) {
      if (!this.isComparable()) {
        return false;
      }
      if (this.modelValue) {
        if (this.isSingleSelection()) {
          return this.isDateEquals(this.modelValue, dateMeta);
        } else if (this.isMultipleSelection()) {
          var selected = false;
          var _iterator = _createForOfIteratorHelper(this.modelValue),
            _step;
          try {
            for (_iterator.s(); !(_step = _iterator.n()).done;) {
              var date = _step.value;
              selected = this.isDateEquals(date, dateMeta);
              if (selected) {
                break;
              }
            }
          } catch (err) {
            _iterator.e(err);
          } finally {
            _iterator.f();
          }
          return selected;
        } else if (this.isRangeSelection()) {
          if (this.modelValue[1]) return this.isDateEquals(this.modelValue[0], dateMeta) || this.isDateEquals(this.modelValue[1], dateMeta) || this.isDateBetween(this.modelValue[0], this.modelValue[1], dateMeta);else {
            return this.isDateEquals(this.modelValue[0], dateMeta);
          }
        }
      }
      return false;
    },
    isMonthSelected: function isMonthSelected(month) {
      var _this2 = this;
      if (!this.isComparable()) return false;
      if (this.isMultipleSelection()) {
        return this.modelValue.some(function (currentValue) {
          return currentValue.getMonth() === month && currentValue.getFullYear() === _this2.currentYear;
        });
      } else if (this.isRangeSelection()) {
        if (!this.modelValue[1]) {
          var _this$modelValue$, _this$modelValue$2;
          return ((_this$modelValue$ = this.modelValue[0]) === null || _this$modelValue$ === void 0 ? void 0 : _this$modelValue$.getFullYear()) === this.currentYear && ((_this$modelValue$2 = this.modelValue[0]) === null || _this$modelValue$2 === void 0 ? void 0 : _this$modelValue$2.getMonth()) === month;
        } else {
          var currentDate = new Date(this.currentYear, month, 1);
          var startDate = new Date(this.modelValue[0].getFullYear(), this.modelValue[0].getMonth(), 1);
          var endDate = new Date(this.modelValue[1].getFullYear(), this.modelValue[1].getMonth(), 1);
          return currentDate >= startDate && currentDate <= endDate;
        }
      } else {
        return this.modelValue.getMonth() === month && this.modelValue.getFullYear() === this.currentYear;
      }
    },
    isYearSelected: function isYearSelected(year) {
      if (!this.isComparable()) return false;
      if (this.isMultipleSelection()) {
        return this.modelValue.some(function (currentValue) {
          return currentValue.getFullYear() === year;
        });
      } else if (this.isRangeSelection()) {
        var start = this.modelValue[0] ? this.modelValue[0].getFullYear() : null;
        var end = this.modelValue[1] ? this.modelValue[1].getFullYear() : null;
        return start === year || end === year || start < year && end > year;
      } else {
        return this.modelValue.getFullYear() === year;
      }
    },
    isDateEquals: function isDateEquals(value, dateMeta) {
      if (value) return value.getDate() === dateMeta.day && value.getMonth() === dateMeta.month && value.getFullYear() === dateMeta.year;else return false;
    },
    isDateBetween: function isDateBetween(start, end, dateMeta) {
      var between = false;
      if (start && end) {
        var date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
        return start.getTime() <= date.getTime() && end.getTime() >= date.getTime();
      }
      return between;
    },
    getFirstDayOfMonthIndex: function getFirstDayOfMonthIndex(month, year) {
      var day = new Date();
      day.setDate(1);
      day.setMonth(month);
      day.setFullYear(year);
      var dayIndex = day.getDay() + this.sundayIndex;
      return dayIndex >= 7 ? dayIndex - 7 : dayIndex;
    },
    getDaysCountInMonth: function getDaysCountInMonth(month, year) {
      return 32 - this.daylightSavingAdjust(new Date(year, month, 32)).getDate();
    },
    getDaysCountInPrevMonth: function getDaysCountInPrevMonth(month, year) {
      var prev = this.getPreviousMonthAndYear(month, year);
      return this.getDaysCountInMonth(prev.month, prev.year);
    },
    getPreviousMonthAndYear: function getPreviousMonthAndYear(month, year) {
      var m, y;
      if (month === 0) {
        m = 11;
        y = year - 1;
      } else {
        m = month - 1;
        y = year;
      }
      return {
        month: m,
        year: y
      };
    },
    getNextMonthAndYear: function getNextMonthAndYear(month, year) {
      var m, y;
      if (month === 11) {
        m = 0;
        y = year + 1;
      } else {
        m = month + 1;
        y = year;
      }
      return {
        month: m,
        year: y
      };
    },
    daylightSavingAdjust: function daylightSavingAdjust(date) {
      if (!date) {
        return null;
      }
      date.setHours(date.getHours() > 12 ? date.getHours() + 2 : 0);
      return date;
    },
    isToday: function isToday(today, day, month, year) {
      return today.getDate() === day && today.getMonth() === month && today.getFullYear() === year;
    },
    isSelectable: function isSelectable(day, month, year, otherMonth) {
      var validMin = true;
      var validMax = true;
      var validDate = true;
      var validDay = true;
      if (otherMonth && !this.selectOtherMonths) {
        return false;
      }
      if (this.minDate) {
        if (this.minDate.getFullYear() > year) {
          validMin = false;
        } else if (this.minDate.getFullYear() === year) {
          if (this.minDate.getMonth() > month) {
            validMin = false;
          } else if (this.minDate.getMonth() === month) {
            if (this.minDate.getDate() > day) {
              validMin = false;
            }
          }
        }
      }
      if (this.maxDate) {
        if (this.maxDate.getFullYear() < year) {
          validMax = false;
        } else if (this.maxDate.getFullYear() === year) {
          if (this.maxDate.getMonth() < month) {
            validMax = false;
          } else if (this.maxDate.getMonth() === month) {
            if (this.maxDate.getDate() < day) {
              validMax = false;
            }
          }
        }
      }
      if (this.disabledDates) {
        validDate = !this.isDateDisabled(day, month, year);
      }
      if (this.disabledDays) {
        validDay = !this.isDayDisabled(day, month, year);
      }
      return validMin && validMax && validDate && validDay;
    },
    onOverlayEnter: function onOverlayEnter(el) {
      var styles = !this.inline ? {
        position: 'absolute',
        top: '0',
        left: '0'
      } : undefined;
      addStyle(el, styles);
      if (this.autoZIndex) {
        ZIndex.set('overlay', el, this.baseZIndex || this.$primevue.config.zIndex.overlay);
      }
      this.alignOverlay();
      this.$emit('show');
    },
    onOverlayEnterComplete: function onOverlayEnterComplete() {
      this.bindOutsideClickListener();
      this.bindScrollListener();
      this.bindResizeListener();
    },
    onOverlayAfterLeave: function onOverlayAfterLeave(el) {
      if (this.autoZIndex) {
        ZIndex.clear(el);
      }
    },
    onOverlayLeave: function onOverlayLeave() {
      this.currentView = this.view;
      this.unbindOutsideClickListener();
      this.unbindScrollListener();
      this.unbindResizeListener();
      this.$emit('hide');
      this.overlay = null;
    },
    onPrevButtonClick: function onPrevButtonClick(event) {
      this.navigationState = {
        backward: true,
        button: true
      };
      this.navBackward(event);
    },
    onNextButtonClick: function onNextButtonClick(event) {
      this.navigationState = {
        backward: false,
        button: true
      };
      this.navForward(event);
    },
    navBackward: function navBackward(event) {
      event.preventDefault();
      if (!this.isEnabled()) {
        return;
      }
      if (this.currentView === 'month') {
        this.decrementYear();
        this.$emit('year-change', {
          month: this.currentMonth,
          year: this.currentYear
        });
      } else if (this.currentView === 'year') {
        this.decrementDecade();
      } else {
        if (event.shiftKey) {
          this.decrementYear();
        } else {
          if (this.currentMonth === 0) {
            this.currentMonth = 11;
            this.decrementYear();
          } else {
            this.currentMonth--;
          }
          this.$emit('month-change', {
            month: this.currentMonth + 1,
            year: this.currentYear
          });
        }
      }
    },
    navForward: function navForward(event) {
      event.preventDefault();
      if (!this.isEnabled()) {
        return;
      }
      if (this.currentView === 'month') {
        this.incrementYear();
        this.$emit('year-change', {
          month: this.currentMonth,
          year: this.currentYear
        });
      } else if (this.currentView === 'year') {
        this.incrementDecade();
      } else {
        if (event.shiftKey) {
          this.incrementYear();
        } else {
          if (this.currentMonth === 11) {
            this.currentMonth = 0;
            this.incrementYear();
          } else {
            this.currentMonth++;
          }
          this.$emit('month-change', {
            month: this.currentMonth + 1,
            year: this.currentYear
          });
        }
      }
    },
    decrementYear: function decrementYear() {
      this.currentYear--;
    },
    decrementDecade: function decrementDecade() {
      this.currentYear = this.currentYear - 10;
    },
    incrementYear: function incrementYear() {
      this.currentYear++;
    },
    incrementDecade: function incrementDecade() {
      this.currentYear = this.currentYear + 10;
    },
    switchToMonthView: function switchToMonthView(event) {
      this.currentView = 'month';
      setTimeout(this.updateFocus, 0);
      event.preventDefault();
    },
    switchToYearView: function switchToYearView(event) {
      this.currentView = 'year';
      setTimeout(this.updateFocus, 0);
      event.preventDefault();
    },
    isEnabled: function isEnabled() {
      return !this.disabled && !this.readonly;
    },
    updateCurrentTimeMeta: function updateCurrentTimeMeta(date) {
      var currentHour = date.getHours();
      if (this.hourFormat === '12') {
        this.pm = currentHour > 11;
        if (currentHour >= 12) currentHour = currentHour == 12 ? 12 : currentHour - 12;else currentHour = currentHour == 0 ? 12 : currentHour;
      }
      this.currentHour = Math.floor(currentHour / this.stepHour) * this.stepHour;
      this.currentMinute = Math.floor(date.getMinutes() / this.stepMinute) * this.stepMinute;
      this.currentSecond = Math.floor(date.getSeconds() / this.stepSecond) * this.stepSecond;
    },
    bindOutsideClickListener: function bindOutsideClickListener() {
      var _this3 = this;
      if (!this.outsideClickListener) {
        this.outsideClickListener = function (event) {
          if (_this3.overlayVisible && _this3.isOutsideClicked(event)) {
            _this3.overlayVisible = false;
          }
        };
        document.addEventListener('mousedown', this.outsideClickListener);
      }
    },
    unbindOutsideClickListener: function unbindOutsideClickListener() {
      if (this.outsideClickListener) {
        document.removeEventListener('mousedown', this.outsideClickListener);
        this.outsideClickListener = null;
      }
    },
    bindScrollListener: function bindScrollListener() {
      var _this4 = this;
      if (!this.scrollHandler) {
        this.scrollHandler = new ConnectedOverlayScrollHandler(this.$refs.container, function () {
          if (_this4.overlayVisible) {
            _this4.overlayVisible = false;
          }
        });
      }
      this.scrollHandler.bindScrollListener();
    },
    unbindScrollListener: function unbindScrollListener() {
      if (this.scrollHandler) {
        this.scrollHandler.unbindScrollListener();
      }
    },
    bindResizeListener: function bindResizeListener() {
      var _this5 = this;
      if (!this.resizeListener) {
        this.resizeListener = function () {
          if (_this5.overlayVisible && !isTouchDevice()) {
            _this5.overlayVisible = false;
          }
        };
        window.addEventListener('resize', this.resizeListener);
      }
    },
    unbindResizeListener: function unbindResizeListener() {
      if (this.resizeListener) {
        window.removeEventListener('resize', this.resizeListener);
        this.resizeListener = null;
      }
    },
    bindMatchMediaListener: function bindMatchMediaListener() {
      var _this6 = this;
      if (!this.matchMediaListener) {
        var query = matchMedia("(max-width: ".concat(this.breakpoint, ")"));
        this.query = query;
        this.queryMatches = query.matches;
        this.matchMediaListener = function () {
          _this6.queryMatches = query.matches;
          _this6.mobileActive = false;
        };
        this.query.addEventListener('change', this.matchMediaListener);
      }
    },
    unbindMatchMediaListener: function unbindMatchMediaListener() {
      if (this.matchMediaListener) {
        this.query.removeEventListener('change', this.matchMediaListener);
        this.matchMediaListener = null;
      }
    },
    isOutsideClicked: function isOutsideClicked(event) {
      return !(this.$el.isSameNode(event.target) || this.isNavIconClicked(event) || this.$el.contains(event.target) || this.overlay && this.overlay.contains(event.target));
    },
    isNavIconClicked: function isNavIconClicked(event) {
      return this.previousButton && (this.previousButton.isSameNode(event.target) || this.previousButton.contains(event.target)) || this.nextButton && (this.nextButton.isSameNode(event.target) || this.nextButton.contains(event.target));
    },
    alignOverlay: function alignOverlay() {
      if (this.overlay) {
        if (this.appendTo === 'self' || this.inline) {
          relativePosition(this.overlay, this.$el);
        } else {
          if (this.view === 'date') {
            this.overlay.style.width = getOuterWidth(this.overlay) + 'px';
            this.overlay.style.minWidth = getOuterWidth(this.$el) + 'px';
          } else {
            this.overlay.style.width = getOuterWidth(this.$el) + 'px';
          }
          absolutePosition(this.overlay, this.$el);
        }
      }
    },
    onButtonClick: function onButtonClick() {
      if (this.isEnabled()) {
        if (!this.overlayVisible) {
          this.input.focus();
          this.overlayVisible = true;
        } else {
          this.overlayVisible = false;
        }
      }
    },
    isDateDisabled: function isDateDisabled(day, month, year) {
      if (this.disabledDates) {
        var _iterator2 = _createForOfIteratorHelper(this.disabledDates),
          _step2;
        try {
          for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
            var disabledDate = _step2.value;
            if (disabledDate.getFullYear() === year && disabledDate.getMonth() === month && disabledDate.getDate() === day) {
              return true;
            }
          }
        } catch (err) {
          _iterator2.e(err);
        } finally {
          _iterator2.f();
        }
      }
      return false;
    },
    isDayDisabled: function isDayDisabled(day, month, year) {
      if (this.disabledDays) {
        var weekday = new Date(year, month, day);
        var weekdayNumber = weekday.getDay();
        return this.disabledDays.indexOf(weekdayNumber) !== -1;
      }
      return false;
    },
    onMonthDropdownChange: function onMonthDropdownChange(value) {
      this.currentMonth = parseInt(value);
      this.$emit('month-change', {
        month: this.currentMonth + 1,
        year: this.currentYear
      });
    },
    onYearDropdownChange: function onYearDropdownChange(value) {
      this.currentYear = parseInt(value);
      this.$emit('year-change', {
        month: this.currentMonth + 1,
        year: this.currentYear
      });
    },
    onDateSelect: function onDateSelect(event, dateMeta) {
      var _this7 = this;
      if (this.disabled || !dateMeta.selectable) {
        return;
      }
      find(this.overlay, 'table td span:not([data-p-disabled="true"])').forEach(function (cell) {
        return cell.tabIndex = -1;
      });
      if (event) {
        event.currentTarget.focus();
      }
      if (this.isMultipleSelection() && this.isSelected(dateMeta)) {
        var newValue = this.modelValue.filter(function (date) {
          return !_this7.isDateEquals(date, dateMeta);
        });
        this.updateModel(newValue);
      } else {
        if (this.shouldSelectDate(dateMeta)) {
          if (dateMeta.otherMonth) {
            this.currentMonth = dateMeta.month;
            this.currentYear = dateMeta.year;
            this.selectDate(dateMeta);
          } else {
            this.selectDate(dateMeta);
          }
        }
      }
      if (this.isSingleSelection() && (!this.showTime || this.hideOnDateTimeSelect)) {
        if (this.input) {
          this.input.focus();
        }
        setTimeout(function () {
          _this7.overlayVisible = false;
        }, 150);
      }
    },
    selectDate: function selectDate(dateMeta) {
      var _this8 = this;
      var date = new Date(dateMeta.year, dateMeta.month, dateMeta.day);
      if (this.showTime) {
        this.hourFormat === '12' && this.currentHour !== 12 && this.pm ? date.setHours(this.currentHour + 12) : date.setHours(this.currentHour);
        date.setMinutes(this.currentMinute);
        date.setSeconds(this.currentSecond);
      }
      if (this.minDate && this.minDate > date) {
        date = this.minDate;
        this.currentHour = date.getHours();
        this.currentMinute = date.getMinutes();
        this.currentSecond = date.getSeconds();
      }
      if (this.maxDate && this.maxDate < date) {
        date = this.maxDate;
        this.currentHour = date.getHours();
        this.currentMinute = date.getMinutes();
        this.currentSecond = date.getSeconds();
      }
      var modelVal = null;
      if (this.isSingleSelection()) {
        modelVal = date;
      } else if (this.isMultipleSelection()) {
        modelVal = this.modelValue ? [].concat(_toConsumableArray(this.modelValue), [date]) : [date];
      } else if (this.isRangeSelection()) {
        if (this.modelValue && this.modelValue.length) {
          var startDate = this.modelValue[0];
          var endDate = this.modelValue[1];
          if (!endDate && date.getTime() >= startDate.getTime()) {
            endDate = date;
          } else {
            startDate = date;
            endDate = null;
          }
          modelVal = [startDate, endDate];
        } else {
          modelVal = [date, null];
        }
      }
      if (modelVal !== null) {
        this.updateModel(modelVal);
      }
      if (this.isRangeSelection() && this.hideOnRangeSelection && modelVal[1] !== null) {
        setTimeout(function () {
          _this8.overlayVisible = false;
        }, 150);
      }
      this.$emit('date-select', date);
    },
    updateModel: function updateModel(value) {
      this.$emit('update:modelValue', value);
    },
    shouldSelectDate: function shouldSelectDate() {
      if (this.isMultipleSelection()) return this.maxDateCount != null ? this.maxDateCount > (this.modelValue ? this.modelValue.length : 0) : true;else return true;
    },
    isSingleSelection: function isSingleSelection() {
      return this.selectionMode === 'single';
    },
    isRangeSelection: function isRangeSelection() {
      return this.selectionMode === 'range';
    },
    isMultipleSelection: function isMultipleSelection() {
      return this.selectionMode === 'multiple';
    },
    formatValue: function formatValue(value) {
      if (typeof value === 'string') {
        return value;
      }
      var formattedValue = '';
      if (value) {
        try {
          if (this.isSingleSelection()) {
            formattedValue = this.formatDateTime(value);
          } else if (this.isMultipleSelection()) {
            for (var i = 0; i < value.length; i++) {
              var dateAsString = this.formatDateTime(value[i]);
              formattedValue += dateAsString;
              if (i !== value.length - 1) {
                formattedValue += ', ';
              }
            }
          } else if (this.isRangeSelection()) {
            if (value && value.length) {
              var startDate = value[0];
              var endDate = value[1];
              formattedValue = this.formatDateTime(startDate);
              if (endDate) {
                formattedValue += ' - ' + this.formatDateTime(endDate);
              }
            }
          }
        } catch (err) {
          formattedValue = value;
        }
      }
      return formattedValue;
    },
    formatDateTime: function formatDateTime(date) {
      var formattedValue = null;
      if (date) {
        if (this.timeOnly) {
          formattedValue = this.formatTime(date);
        } else {
          formattedValue = this.formatDate(date, this.datePattern);
          if (this.showTime) {
            formattedValue += ' ' + this.formatTime(date);
          }
        }
      }
      return formattedValue;
    },
    formatDate: function formatDate(date, format) {
      if (!date) {
        return '';
      }
      var iFormat;
      var lookAhead = function lookAhead(match) {
          var matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
          if (matches) {
            iFormat++;
          }
          return matches;
        },
        formatNumber = function formatNumber(match, value, len) {
          var num = '' + value;
          if (lookAhead(match)) {
            while (num.length < len) {
              num = '0' + num;
            }
          }
          return num;
        },
        formatName = function formatName(match, value, shortNames, longNames) {
          return lookAhead(match) ? longNames[value] : shortNames[value];
        };
      var output = '';
      var literal = false;
      if (date) {
        for (iFormat = 0; iFormat < format.length; iFormat++) {
          if (literal) {
            if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
              literal = false;
            } else {
              output += format.charAt(iFormat);
            }
          } else {
            switch (format.charAt(iFormat)) {
              case 'd':
                output += formatNumber('d', date.getDate(), 2);
                break;
              case 'D':
                output += formatName('D', date.getDay(), this.$primevue.config.locale.dayNamesShort, this.$primevue.config.locale.dayNames);
                break;
              case 'o':
                output += formatNumber('o', Math.round((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000), 3);
                break;
              case 'm':
                output += formatNumber('m', date.getMonth() + 1, 2);
                break;
              case 'M':
                output += formatName('M', date.getMonth(), this.$primevue.config.locale.monthNamesShort, this.$primevue.config.locale.monthNames);
                break;
              case 'y':
                output += lookAhead('y') ? date.getFullYear() : (date.getFullYear() % 100 < 10 ? '0' : '') + date.getFullYear() % 100;
                break;
              case '@':
                output += date.getTime();
                break;
              case '!':
                output += date.getTime() * 10000 + this.ticksTo1970;
                break;
              case "'":
                if (lookAhead("'")) {
                  output += "'";
                } else {
                  literal = true;
                }
                break;
              default:
                output += format.charAt(iFormat);
            }
          }
        }
      }
      return output;
    },
    formatTime: function formatTime(date) {
      if (!date) {
        return '';
      }
      var output = '';
      var hours = date.getHours();
      var minutes = date.getMinutes();
      var seconds = date.getSeconds();
      if (this.hourFormat === '12' && hours > 11 && hours !== 12) {
        hours -= 12;
      }
      if (this.hourFormat === '12') {
        output += hours === 0 ? 12 : hours < 10 ? '0' + hours : hours;
      } else {
        output += hours < 10 ? '0' + hours : hours;
      }
      output += ':';
      output += minutes < 10 ? '0' + minutes : minutes;
      if (this.showSeconds) {
        output += ':';
        output += seconds < 10 ? '0' + seconds : seconds;
      }
      if (this.hourFormat === '12') {
        output += date.getHours() > 11 ? " ".concat(this.$primevue.config.locale.pm) : " ".concat(this.$primevue.config.locale.am);
      }
      return output;
    },
    onTodayButtonClick: function onTodayButtonClick(event) {
      var date = new Date();
      var dateMeta = {
        day: date.getDate(),
        month: date.getMonth(),
        year: date.getFullYear(),
        otherMonth: date.getMonth() !== this.currentMonth || date.getFullYear() !== this.currentYear,
        today: true,
        selectable: true
      };
      this.onDateSelect(null, dateMeta);
      this.$emit('today-click', date);
      event.preventDefault();
    },
    onClearButtonClick: function onClearButtonClick(event) {
      this.updateModel(null);
      this.overlayVisible = false;
      this.$emit('clear-click', event);
      event.preventDefault();
    },
    onTimePickerElementMouseDown: function onTimePickerElementMouseDown(event, type, direction) {
      if (this.isEnabled()) {
        this.repeat(event, null, type, direction);
        event.preventDefault();
      }
    },
    onTimePickerElementMouseUp: function onTimePickerElementMouseUp(event) {
      if (this.isEnabled()) {
        this.clearTimePickerTimer();
        this.updateModelTime();
        event.preventDefault();
      }
    },
    onTimePickerElementMouseLeave: function onTimePickerElementMouseLeave() {
      this.clearTimePickerTimer();
    },
    repeat: function repeat(event, interval, type, direction) {
      var _this9 = this;
      var i = interval || 500;
      this.clearTimePickerTimer();
      this.timePickerTimer = setTimeout(function () {
        _this9.repeat(event, 100, type, direction);
      }, i);
      switch (type) {
        case 0:
          if (direction === 1) this.incrementHour(event);else this.decrementHour(event);
          break;
        case 1:
          if (direction === 1) this.incrementMinute(event);else this.decrementMinute(event);
          break;
        case 2:
          if (direction === 1) this.incrementSecond(event);else this.decrementSecond(event);
          break;
      }
    },
    convertTo24Hour: function convertTo24Hour(hours, pm) {
      if (this.hourFormat == '12') {
        if (hours === 12) {
          return pm ? 12 : 0;
        } else {
          return pm ? hours + 12 : hours;
        }
      }
      return hours;
    },
    validateTime: function validateTime(hour, minute, second, pm) {
      var value = this.isComparable() ? this.modelValue : this.viewDate;
      var convertedHour = this.convertTo24Hour(hour, pm);
      if (this.isRangeSelection()) {
        value = this.modelValue[1] || this.modelValue[0];
      }
      if (this.isMultipleSelection()) {
        value = this.modelValue[this.modelValue.length - 1];
      }
      var valueDateString = value ? value.toDateString() : null;
      if (this.minDate && valueDateString && this.minDate.toDateString() === valueDateString) {
        if (this.minDate.getHours() > convertedHour) {
          return false;
        }
        if (this.minDate.getHours() === convertedHour) {
          if (this.minDate.getMinutes() > minute) {
            return false;
          }
          if (this.minDate.getMinutes() === minute) {
            if (this.minDate.getSeconds() > second) {
              return false;
            }
          }
        }
      }
      if (this.maxDate && valueDateString && this.maxDate.toDateString() === valueDateString) {
        if (this.maxDate.getHours() < convertedHour) {
          return false;
        }
        if (this.maxDate.getHours() === convertedHour) {
          if (this.maxDate.getMinutes() < minute) {
            return false;
          }
          if (this.maxDate.getMinutes() === minute) {
            if (this.maxDate.getSeconds() < second) {
              return false;
            }
          }
        }
      }
      return true;
    },
    incrementHour: function incrementHour(event) {
      var prevHour = this.currentHour;
      var newHour = this.currentHour + Number(this.stepHour);
      var newPM = this.pm;
      if (this.hourFormat == '24') newHour = newHour >= 24 ? newHour - 24 : newHour;else if (this.hourFormat == '12') {
        // Before the AM/PM break, now after
        if (prevHour < 12 && newHour > 11) {
          newPM = !this.pm;
        }
        newHour = newHour >= 13 ? newHour - 12 : newHour;
      }
      if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
        this.currentHour = newHour;
        this.pm = newPM;
      }
      event.preventDefault();
    },
    decrementHour: function decrementHour(event) {
      var newHour = this.currentHour - this.stepHour;
      var newPM = this.pm;
      if (this.hourFormat == '24') newHour = newHour < 0 ? 24 + newHour : newHour;else if (this.hourFormat == '12') {
        // If we were at noon/midnight, then switch
        if (this.currentHour === 12) {
          newPM = !this.pm;
        }
        newHour = newHour <= 0 ? 12 + newHour : newHour;
      }
      if (this.validateTime(newHour, this.currentMinute, this.currentSecond, newPM)) {
        this.currentHour = newHour;
        this.pm = newPM;
      }
      event.preventDefault();
    },
    incrementMinute: function incrementMinute(event) {
      var newMinute = this.currentMinute + Number(this.stepMinute);
      if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
        this.currentMinute = newMinute > 59 ? newMinute - 60 : newMinute;
      }
      event.preventDefault();
    },
    decrementMinute: function decrementMinute(event) {
      var newMinute = this.currentMinute - this.stepMinute;
      newMinute = newMinute < 0 ? 60 + newMinute : newMinute;
      if (this.validateTime(this.currentHour, newMinute, this.currentSecond, this.pm)) {
        this.currentMinute = newMinute;
      }
      event.preventDefault();
    },
    incrementSecond: function incrementSecond(event) {
      var newSecond = this.currentSecond + Number(this.stepSecond);
      if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
        this.currentSecond = newSecond > 59 ? newSecond - 60 : newSecond;
      }
      event.preventDefault();
    },
    decrementSecond: function decrementSecond(event) {
      var newSecond = this.currentSecond - this.stepSecond;
      newSecond = newSecond < 0 ? 60 + newSecond : newSecond;
      if (this.validateTime(this.currentHour, this.currentMinute, newSecond, this.pm)) {
        this.currentSecond = newSecond;
      }
      event.preventDefault();
    },
    updateModelTime: function updateModelTime() {
      var _this10 = this;
      this.timePickerChange = true;
      var value = this.isComparable() ? this.modelValue : this.viewDate;
      if (this.isRangeSelection()) {
        value = this.modelValue[1] || this.modelValue[0];
      }
      if (this.isMultipleSelection()) {
        value = this.modelValue[this.modelValue.length - 1];
      }
      value = value ? new Date(value.getTime()) : new Date();
      if (this.hourFormat == '12') {
        if (this.currentHour === 12) value.setHours(this.pm ? 12 : 0);else value.setHours(this.pm ? this.currentHour + 12 : this.currentHour);
      } else {
        value.setHours(this.currentHour);
      }
      value.setMinutes(this.currentMinute);
      value.setSeconds(this.currentSecond);
      if (this.isRangeSelection()) {
        if (this.modelValue[1]) value = [this.modelValue[0], value];else value = [value, null];
      }
      if (this.isMultipleSelection()) {
        value = [].concat(_toConsumableArray(this.modelValue.slice(0, -1)), [value]);
      }
      this.updateModel(value);
      this.$emit('date-select', value);
      setTimeout(function () {
        return _this10.timePickerChange = false;
      }, 0);
    },
    toggleAMPM: function toggleAMPM(event) {
      var validHour = this.validateTime(this.currentHour, this.currentMinute, this.currentSecond, !this.pm);
      if (!validHour && (this.maxDate || this.minDate)) return;
      this.pm = !this.pm;
      this.updateModelTime();
      event.preventDefault();
    },
    clearTimePickerTimer: function clearTimePickerTimer() {
      if (this.timePickerTimer) {
        clearInterval(this.timePickerTimer);
      }
    },
    onMonthSelect: function onMonthSelect(event, _ref) {
      _ref.month;
        var index = _ref.index;
      if (this.view === 'month') {
        this.onDateSelect(event, {
          year: this.currentYear,
          month: index,
          day: 1,
          selectable: true
        });
      } else {
        this.currentMonth = index;
        this.currentView = 'date';
        this.$emit('month-change', {
          month: this.currentMonth + 1,
          year: this.currentYear
        });
      }
      setTimeout(this.updateFocus, 0);
    },
    onYearSelect: function onYearSelect(event, year) {
      if (this.view === 'year') {
        this.onDateSelect(event, {
          year: year.value,
          month: 0,
          day: 1,
          selectable: true
        });
      } else {
        this.currentYear = year.value;
        this.currentView = 'month';
        this.$emit('year-change', {
          month: this.currentMonth + 1,
          year: this.currentYear
        });
      }
      setTimeout(this.updateFocus, 0);
    },
    updateCurrentMetaData: function updateCurrentMetaData() {
      var viewDate = this.viewDate;
      this.currentMonth = viewDate.getMonth();
      this.currentYear = viewDate.getFullYear();
      if (this.showTime || this.timeOnly) {
        this.updateCurrentTimeMeta(viewDate);
      }
    },
    isValidSelection: function isValidSelection(value) {
      var _this11 = this;
      if (value == null) {
        return true;
      }
      var isValid = true;
      if (this.isSingleSelection()) {
        if (!this.isSelectable(value.getDate(), value.getMonth(), value.getFullYear(), false)) {
          isValid = false;
        }
      } else if (value.every(function (v) {
        return _this11.isSelectable(v.getDate(), v.getMonth(), v.getFullYear(), false);
      })) {
        if (this.isRangeSelection()) {
          isValid = value.length > 1 && value[1] >= value[0];
        }
      }
      return isValid;
    },
    parseValue: function parseValue(text) {
      if (!text || text.trim().length === 0) {
        return null;
      }
      var value;
      if (this.isSingleSelection()) {
        value = this.parseDateTime(text);
      } else if (this.isMultipleSelection()) {
        var tokens = text.split(',');
        value = [];
        var _iterator3 = _createForOfIteratorHelper(tokens),
          _step3;
        try {
          for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
            var token = _step3.value;
            value.push(this.parseDateTime(token.trim()));
          }
        } catch (err) {
          _iterator3.e(err);
        } finally {
          _iterator3.f();
        }
      } else if (this.isRangeSelection()) {
        var _tokens = text.split(' - ');
        value = [];
        for (var i = 0; i < _tokens.length; i++) {
          value[i] = this.parseDateTime(_tokens[i].trim());
        }
      }
      return value;
    },
    parseDateTime: function parseDateTime(text) {
      var date;
      var parts = text.split(' ');
      if (this.timeOnly) {
        date = new Date();
        this.populateTime(date, parts[0], parts[1]);
      } else {
        var dateFormat = this.datePattern;
        if (this.showTime) {
          date = this.parseDate(parts[0], dateFormat);
          this.populateTime(date, parts[1], parts[2]);
        } else {
          date = this.parseDate(text, dateFormat);
        }
      }
      return date;
    },
    populateTime: function populateTime(value, timeString, ampm) {
      if (this.hourFormat == '12' && !ampm) {
        throw 'Invalid Time';
      }
      this.pm = ampm === this.$primevue.config.locale.pm || ampm === this.$primevue.config.locale.pm.toLowerCase();
      var time = this.parseTime(timeString);
      value.setHours(time.hour);
      value.setMinutes(time.minute);
      value.setSeconds(time.second);
    },
    parseTime: function parseTime(value) {
      var tokens = value.split(':');
      var validTokenLength = this.showSeconds ? 3 : 2;
      var regex = /^[0-9][0-9]$/;
      if (tokens.length !== validTokenLength || !tokens[0].match(regex) || !tokens[1].match(regex) || this.showSeconds && !tokens[2].match(regex)) {
        throw 'Invalid time';
      }
      var h = parseInt(tokens[0]);
      var m = parseInt(tokens[1]);
      var s = this.showSeconds ? parseInt(tokens[2]) : null;
      if (isNaN(h) || isNaN(m) || h > 23 || m > 59 || this.hourFormat == '12' && h > 12 || this.showSeconds && (isNaN(s) || s > 59)) {
        throw 'Invalid time';
      } else {
        if (this.hourFormat == '12' && h !== 12 && this.pm) {
          h += 12;
        } else if (this.hourFormat == '12' && h == 12 && !this.pm) {
          h = 0;
        }
        return {
          hour: h,
          minute: m,
          second: s
        };
      }
    },
    parseDate: function parseDate(value, format) {
      if (format == null || value == null) {
        throw 'Invalid arguments';
      }
      value = _typeof(value) === 'object' ? value.toString() : value + '';
      if (value === '') {
        return null;
      }
      var iFormat,
        dim,
        extra,
        iValue = 0,
        shortYearCutoff = typeof this.shortYearCutoff !== 'string' ? this.shortYearCutoff : new Date().getFullYear() % 100 + parseInt(this.shortYearCutoff, 10),
        year = -1,
        month = -1,
        day = -1,
        doy = -1,
        literal = false,
        date,
        lookAhead = function lookAhead(match) {
          var matches = iFormat + 1 < format.length && format.charAt(iFormat + 1) === match;
          if (matches) {
            iFormat++;
          }
          return matches;
        },
        getNumber = function getNumber(match) {
          var isDoubled = lookAhead(match),
            size = match === '@' ? 14 : match === '!' ? 20 : match === 'y' && isDoubled ? 4 : match === 'o' ? 3 : 2,
            minSize = match === 'y' ? size : 1,
            digits = new RegExp('^\\d{' + minSize + ',' + size + '}'),
            num = value.substring(iValue).match(digits);
          if (!num) {
            throw 'Missing number at position ' + iValue;
          }
          iValue += num[0].length;
          return parseInt(num[0], 10);
        },
        getName = function getName(match, shortNames, longNames) {
          var index = -1;
          var arr = lookAhead(match) ? longNames : shortNames;
          var names = [];
          for (var i = 0; i < arr.length; i++) {
            names.push([i, arr[i]]);
          }
          names.sort(function (a, b) {
            return -(a[1].length - b[1].length);
          });
          for (var _i = 0; _i < names.length; _i++) {
            var name = names[_i][1];
            if (value.substr(iValue, name.length).toLowerCase() === name.toLowerCase()) {
              index = names[_i][0];
              iValue += name.length;
              break;
            }
          }
          if (index !== -1) {
            return index + 1;
          } else {
            throw 'Unknown name at position ' + iValue;
          }
        },
        checkLiteral = function checkLiteral() {
          if (value.charAt(iValue) !== format.charAt(iFormat)) {
            throw 'Unexpected literal at position ' + iValue;
          }
          iValue++;
        };
      if (this.currentView === 'month') {
        day = 1;
      }
      if (this.currentView === 'year') {
        day = 1;
        month = 1;
      }
      for (iFormat = 0; iFormat < format.length; iFormat++) {
        if (literal) {
          if (format.charAt(iFormat) === "'" && !lookAhead("'")) {
            literal = false;
          } else {
            checkLiteral();
          }
        } else {
          switch (format.charAt(iFormat)) {
            case 'd':
              day = getNumber('d');
              break;
            case 'D':
              getName('D', this.$primevue.config.locale.dayNamesShort, this.$primevue.config.locale.dayNames);
              break;
            case 'o':
              doy = getNumber('o');
              break;
            case 'm':
              month = getNumber('m');
              break;
            case 'M':
              month = getName('M', this.$primevue.config.locale.monthNamesShort, this.$primevue.config.locale.monthNames);
              break;
            case 'y':
              year = getNumber('y');
              break;
            case '@':
              date = new Date(getNumber('@'));
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case '!':
              date = new Date((getNumber('!') - this.ticksTo1970) / 10000);
              year = date.getFullYear();
              month = date.getMonth() + 1;
              day = date.getDate();
              break;
            case "'":
              if (lookAhead("'")) {
                checkLiteral();
              } else {
                literal = true;
              }
              break;
            default:
              checkLiteral();
          }
        }
      }
      if (iValue < value.length) {
        extra = value.substr(iValue);
        if (!/^\s+/.test(extra)) {
          throw 'Extra/unparsed characters found in date: ' + extra;
        }
      }
      if (year === -1) {
        year = new Date().getFullYear();
      } else if (year < 100) {
        year += new Date().getFullYear() - new Date().getFullYear() % 100 + (year <= shortYearCutoff ? 0 : -100);
      }
      if (doy > -1) {
        month = 1;
        day = doy;
        do {
          dim = this.getDaysCountInMonth(year, month - 1);
          if (day <= dim) {
            break;
          }
          month++;
          day -= dim;
          // eslint-disable-next-line
        } while (true);
      }
      date = this.daylightSavingAdjust(new Date(year, month - 1, day));
      if (date.getFullYear() !== year || date.getMonth() + 1 !== month || date.getDate() !== day) {
        throw 'Invalid date'; // E.g. 31/02/00
      }
      return date;
    },
    getWeekNumber: function getWeekNumber(date) {
      var checkDate = new Date(date.getTime());
      checkDate.setDate(checkDate.getDate() + 4 - (checkDate.getDay() || 7));
      var time = checkDate.getTime();
      checkDate.setMonth(0);
      checkDate.setDate(1);
      return Math.floor(Math.round((time - checkDate.getTime()) / 86400000) / 7) + 1;
    },
    onDateCellKeydown: function onDateCellKeydown(event, date, groupIndex) {
      var cellContent = event.currentTarget;
      var cell = cellContent.parentElement;
      var cellIndex = getIndex(cell);
      switch (event.code) {
        case 'ArrowDown':
          {
            cellContent.tabIndex = '-1';
            var nextRow = cell.parentElement.nextElementSibling;
            if (nextRow) {
              var tableRowIndex = getIndex(cell.parentElement);
              var tableRows = Array.from(cell.parentElement.parentElement.children);
              var nextTableRows = tableRows.slice(tableRowIndex + 1);
              var hasNextFocusableDate = nextTableRows.find(function (el) {
                var focusCell = el.children[cellIndex].children[0];
                return !getAttribute(focusCell, 'data-p-disabled');
              });
              if (hasNextFocusableDate) {
                var focusCell = hasNextFocusableDate.children[cellIndex].children[0];
                focusCell.tabIndex = '0';
                focusCell.focus();
              } else {
                this.navigationState = {
                  backward: false
                };
                this.navForward(event);
              }
            } else {
              this.navigationState = {
                backward: false
              };
              this.navForward(event);
            }
            event.preventDefault();
            break;
          }
        case 'ArrowUp':
          {
            cellContent.tabIndex = '-1';
            if (event.altKey) {
              this.overlayVisible = false;
              this.focused = true;
            } else {
              var prevRow = cell.parentElement.previousElementSibling;
              if (prevRow) {
                var _tableRowIndex = getIndex(cell.parentElement);
                var _tableRows = Array.from(cell.parentElement.parentElement.children);
                var prevTableRows = _tableRows.slice(0, _tableRowIndex).reverse();
                var _hasNextFocusableDate = prevTableRows.find(function (el) {
                  var focusCell = el.children[cellIndex].children[0];
                  return !getAttribute(focusCell, 'data-p-disabled');
                });
                if (_hasNextFocusableDate) {
                  var _focusCell = _hasNextFocusableDate.children[cellIndex].children[0];
                  _focusCell.tabIndex = '0';
                  _focusCell.focus();
                } else {
                  this.navigationState = {
                    backward: true
                  };
                  this.navBackward(event);
                }
              } else {
                this.navigationState = {
                  backward: true
                };
                this.navBackward(event);
              }
            }
            event.preventDefault();
            break;
          }
        case 'ArrowLeft':
          {
            cellContent.tabIndex = '-1';
            var prevCell = cell.previousElementSibling;
            if (prevCell) {
              var cells = Array.from(cell.parentElement.children);
              var prevCells = cells.slice(0, cellIndex).reverse();
              var _hasNextFocusableDate2 = prevCells.find(function (el) {
                var focusCell = el.children[0];
                return !getAttribute(focusCell, 'data-p-disabled');
              });
              if (_hasNextFocusableDate2) {
                var _focusCell2 = _hasNextFocusableDate2.children[0];
                _focusCell2.tabIndex = '0';
                _focusCell2.focus();
              } else {
                this.navigateToMonth(event, true, groupIndex);
              }
            } else {
              this.navigateToMonth(event, true, groupIndex);
            }
            event.preventDefault();
            break;
          }
        case 'ArrowRight':
          {
            cellContent.tabIndex = '-1';
            var nextCell = cell.nextElementSibling;
            if (nextCell) {
              var _cells = Array.from(cell.parentElement.children);
              var nextCells = _cells.slice(cellIndex + 1);
              var _hasNextFocusableDate3 = nextCells.find(function (el) {
                var focusCell = el.children[0];
                return !getAttribute(focusCell, 'data-p-disabled');
              });
              if (_hasNextFocusableDate3) {
                var _focusCell3 = _hasNextFocusableDate3.children[0];
                _focusCell3.tabIndex = '0';
                _focusCell3.focus();
              } else {
                this.navigateToMonth(event, false, groupIndex);
              }
            } else {
              this.navigateToMonth(event, false, groupIndex);
            }
            event.preventDefault();
            break;
          }
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          {
            this.onDateSelect(event, date);
            event.preventDefault();
            break;
          }
        case 'Escape':
          {
            this.overlayVisible = false;
            event.preventDefault();
            break;
          }
        case 'Tab':
          {
            if (!this.inline) {
              this.trapFocus(event);
            }
            break;
          }
        case 'Home':
          {
            cellContent.tabIndex = '-1';
            var currentRow = cell.parentElement;
            var _focusCell4 = currentRow.children[0].children[0];
            if (getAttribute(_focusCell4, 'data-p-disabled')) {
              this.navigateToMonth(event, true, groupIndex);
            } else {
              _focusCell4.tabIndex = '0';
              _focusCell4.focus();
            }
            event.preventDefault();
            break;
          }
        case 'End':
          {
            cellContent.tabIndex = '-1';
            var _currentRow = cell.parentElement;
            var _focusCell5 = _currentRow.children[_currentRow.children.length - 1].children[0];
            if (getAttribute(_focusCell5, 'data-p-disabled')) {
              this.navigateToMonth(event, false, groupIndex);
            } else {
              _focusCell5.tabIndex = '0';
              _focusCell5.focus();
            }
            event.preventDefault();
            break;
          }
        case 'PageUp':
          {
            cellContent.tabIndex = '-1';
            if (event.shiftKey) {
              this.navigationState = {
                backward: true
              };
              this.navBackward(event);
            } else this.navigateToMonth(event, true, groupIndex);
            event.preventDefault();
            break;
          }
        case 'PageDown':
          {
            cellContent.tabIndex = '-1';
            if (event.shiftKey) {
              this.navigationState = {
                backward: false
              };
              this.navForward(event);
            } else this.navigateToMonth(event, false, groupIndex);
            event.preventDefault();
            break;
          }
      }
    },
    navigateToMonth: function navigateToMonth(event, prev, groupIndex) {
      if (prev) {
        if (this.numberOfMonths === 1 || groupIndex === 0) {
          this.navigationState = {
            backward: true
          };
          this.navBackward(event);
        } else {
          var prevMonthContainer = this.overlay.children[groupIndex - 1];
          var cells = find(prevMonthContainer, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
          var focusCell = cells[cells.length - 1];
          focusCell.tabIndex = '0';
          focusCell.focus();
        }
      } else {
        if (this.numberOfMonths === 1 || groupIndex === this.numberOfMonths - 1) {
          this.navigationState = {
            backward: false
          };
          this.navForward(event);
        } else {
          var nextMonthContainer = this.overlay.children[groupIndex + 1];
          var _focusCell6 = findSingle(nextMonthContainer, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
          _focusCell6.tabIndex = '0';
          _focusCell6.focus();
        }
      }
    },
    onMonthCellKeydown: function onMonthCellKeydown(event, index) {
      var cell = event.currentTarget;
      switch (event.code) {
        case 'ArrowUp':
        case 'ArrowDown':
          {
            cell.tabIndex = '-1';
            var cells = cell.parentElement.children;
            var cellIndex = getIndex(cell);
            var nextCell = cells[event.code === 'ArrowDown' ? cellIndex + 3 : cellIndex - 3];
            if (nextCell) {
              nextCell.tabIndex = '0';
              nextCell.focus();
            }
            event.preventDefault();
            break;
          }
        case 'ArrowLeft':
          {
            cell.tabIndex = '-1';
            var prevCell = cell.previousElementSibling;
            if (prevCell) {
              prevCell.tabIndex = '0';
              prevCell.focus();
            } else {
              this.navigationState = {
                backward: true
              };
              this.navBackward(event);
            }
            event.preventDefault();
            break;
          }
        case 'ArrowRight':
          {
            cell.tabIndex = '-1';
            var _nextCell = cell.nextElementSibling;
            if (_nextCell) {
              _nextCell.tabIndex = '0';
              _nextCell.focus();
            } else {
              this.navigationState = {
                backward: false
              };
              this.navForward(event);
            }
            event.preventDefault();
            break;
          }
        case 'PageUp':
          {
            if (event.shiftKey) return;
            this.navigationState = {
              backward: true
            };
            this.navBackward(event);
            break;
          }
        case 'PageDown':
          {
            if (event.shiftKey) return;
            this.navigationState = {
              backward: false
            };
            this.navForward(event);
            break;
          }
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          {
            this.onMonthSelect(event, index);
            event.preventDefault();
            break;
          }
        case 'Escape':
          {
            this.overlayVisible = false;
            event.preventDefault();
            break;
          }
        case 'Tab':
          {
            this.trapFocus(event);
            break;
          }
      }
    },
    onYearCellKeydown: function onYearCellKeydown(event, index) {
      var cell = event.currentTarget;
      switch (event.code) {
        case 'ArrowUp':
        case 'ArrowDown':
          {
            cell.tabIndex = '-1';
            var cells = cell.parentElement.children;
            var cellIndex = getIndex(cell);
            var nextCell = cells[event.code === 'ArrowDown' ? cellIndex + 2 : cellIndex - 2];
            if (nextCell) {
              nextCell.tabIndex = '0';
              nextCell.focus();
            }
            event.preventDefault();
            break;
          }
        case 'ArrowLeft':
          {
            cell.tabIndex = '-1';
            var prevCell = cell.previousElementSibling;
            if (prevCell) {
              prevCell.tabIndex = '0';
              prevCell.focus();
            } else {
              this.navigationState = {
                backward: true
              };
              this.navBackward(event);
            }
            event.preventDefault();
            break;
          }
        case 'ArrowRight':
          {
            cell.tabIndex = '-1';
            var _nextCell2 = cell.nextElementSibling;
            if (_nextCell2) {
              _nextCell2.tabIndex = '0';
              _nextCell2.focus();
            } else {
              this.navigationState = {
                backward: false
              };
              this.navForward(event);
            }
            event.preventDefault();
            break;
          }
        case 'PageUp':
          {
            if (event.shiftKey) return;
            this.navigationState = {
              backward: true
            };
            this.navBackward(event);
            break;
          }
        case 'PageDown':
          {
            if (event.shiftKey) return;
            this.navigationState = {
              backward: false
            };
            this.navForward(event);
            break;
          }
        case 'Enter':
        case 'NumpadEnter':
        case 'Space':
          {
            this.onYearSelect(event, index);
            event.preventDefault();
            break;
          }
        case 'Escape':
          {
            this.overlayVisible = false;
            event.preventDefault();
            break;
          }
        case 'Tab':
          {
            this.trapFocus(event);
            break;
          }
      }
    },
    updateFocus: function updateFocus() {
      var cell;
      if (this.navigationState) {
        if (this.navigationState.button) {
          this.initFocusableCell();
          if (this.navigationState.backward) this.previousButton.focus();else this.nextButton.focus();
        } else {
          if (this.navigationState.backward) {
            var cells;
            if (this.currentView === 'month') {
              cells = find(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]:not([data-p-disabled="true"])');
            } else if (this.currentView === 'year') {
              cells = find(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]:not([data-p-disabled="true"])');
            } else {
              cells = find(this.overlay, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
            }
            if (cells && cells.length > 0) {
              cell = cells[cells.length - 1];
            }
          } else {
            if (this.currentView === 'month') {
              cell = findSingle(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]:not([data-p-disabled="true"])');
            } else if (this.currentView === 'year') {
              cell = findSingle(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]:not([data-p-disabled="true"])');
            } else {
              cell = findSingle(this.overlay, 'table td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
            }
          }
          if (cell) {
            cell.tabIndex = '0';
            cell.focus();
          }
        }
        this.navigationState = null;
      } else {
        this.initFocusableCell();
      }
    },
    initFocusableCell: function initFocusableCell() {
      var cell;
      if (this.currentView === 'month') {
        var cells = find(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"]');
        var selectedCell = findSingle(this.overlay, '[data-pc-section="monthview"] [data-pc-section="month"][data-p-selected="true"]');
        cells.forEach(function (cell) {
          return cell.tabIndex = -1;
        });
        cell = selectedCell || cells[0];
      } else if (this.currentView === 'year') {
        var _cells2 = find(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"]');
        var _selectedCell = findSingle(this.overlay, '[data-pc-section="yearview"] [data-pc-section="year"][data-p-selected="true"]');
        _cells2.forEach(function (cell) {
          return cell.tabIndex = -1;
        });
        cell = _selectedCell || _cells2[0];
      } else {
        cell = findSingle(this.overlay, 'span[data-p-selected="true"]');
        if (!cell) {
          var todayCell = findSingle(this.overlay, 'td[data-p-today="true"] span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
          if (todayCell) cell = todayCell;else cell = findSingle(this.overlay, '.p-datepicker-calendar td span:not([data-p-disabled="true"]):not([data-p-ink="true"])');
        }
      }
      if (cell) {
        cell.tabIndex = '0';
        this.preventFocus = false;
      }
    },
    trapFocus: function trapFocus(event) {
      event.preventDefault();
      var focusableElements = getFocusableElements(this.overlay);
      if (focusableElements && focusableElements.length > 0) {
        if (!document.activeElement) {
          focusableElements[0].focus();
        } else {
          var focusedIndex = focusableElements.indexOf(document.activeElement);
          if (event.shiftKey) {
            if (focusedIndex === -1 || focusedIndex === 0) focusableElements[focusableElements.length - 1].focus();else focusableElements[focusedIndex - 1].focus();
          } else {
            if (focusedIndex === -1) {
              if (this.timeOnly) {
                focusableElements[0].focus();
              } else {
                var spanIndex = null;
                for (var i = 0; i < focusableElements.length; i++) {
                  if (focusableElements[i].tagName === 'SPAN') {
                    spanIndex = i;
                    break;
                  }
                }
                focusableElements[spanIndex].focus();
              }
            } else if (focusedIndex === focusableElements.length - 1) focusableElements[0].focus();else focusableElements[focusedIndex + 1].focus();
          }
        }
      }
    },
    onContainerButtonKeydown: function onContainerButtonKeydown(event) {
      switch (event.code) {
        case 'Tab':
          this.trapFocus(event);
          break;
        case 'Escape':
          this.overlayVisible = false;
          event.preventDefault();
          break;
      }
      this.$emit('keydown', event);
    },
    onInput: function onInput(event) {
      try {
        this.selectionStart = this.input.selectionStart;
        this.selectionEnd = this.input.selectionEnd;
        var value = this.parseValue(event.target.value);
        if (this.isValidSelection(value)) {
          this.typeUpdate = true;
          this.updateModel(value);
        }
      } catch (err) {
        /* NoOp */
      }
      this.$emit('input', event);
    },
    onInputClick: function onInputClick() {
      if (this.showOnFocus && this.isEnabled() && !this.overlayVisible) {
        this.overlayVisible = true;
      }
    },
    onFocus: function onFocus(event) {
      if (this.showOnFocus && this.isEnabled()) {
        this.overlayVisible = true;
      }
      this.focused = true;
      this.$emit('focus', event);
    },
    onBlur: function onBlur(event) {
      this.$emit('blur', {
        originalEvent: event,
        value: event.target.value
      });
      this.focused = false;
      event.target.value = this.formatValue(this.modelValue);
    },
    onKeyDown: function onKeyDown(event) {
      if (event.code === 'ArrowDown' && this.overlay) {
        this.trapFocus(event);
      } else if (event.code === 'ArrowDown' && !this.overlay) {
        this.overlayVisible = true;
      } else if (event.code === 'Escape') {
        if (this.overlayVisible) {
          this.overlayVisible = false;
          event.preventDefault();
        }
      } else if (event.code === 'Tab') {
        if (this.overlay) {
          getFocusableElements(this.overlay).forEach(function (el) {
            return el.tabIndex = '-1';
          });
        }
        if (this.overlayVisible) {
          this.overlayVisible = false;
        }
      } else if (event.code === 'Enter') {
        var _event$target$value;
        if (this.manualInput && event.target.value !== null && ((_event$target$value = event.target.value) === null || _event$target$value === void 0 ? void 0 : _event$target$value.trim()) !== '') {
          try {
            var value = this.parseValue(event.target.value);
            if (this.isValidSelection(value)) {
              this.overlayVisible = false;
            }
          } catch (err) {
            /* NoOp */
          }
        }
        this.$emit('keydown', event);
      }
    },
    overlayRef: function overlayRef(el) {
      this.overlay = el;
    },
    inputRef: function inputRef(el) {
      this.input = el ? el.$el : undefined;
    },
    previousButtonRef: function previousButtonRef(el) {
      this.previousButton = el ? el.$el : undefined;
    },
    nextButtonRef: function nextButtonRef(el) {
      this.nextButton = el ? el.$el : undefined;
    },
    getMonthName: function getMonthName(index) {
      return this.$primevue.config.locale.monthNames[index];
    },
    getYear: function getYear(month) {
      return this.currentView === 'month' ? this.currentYear : month.year;
    },
    onOverlayClick: function onOverlayClick(event) {
      if (!this.inline) {
        OverlayEventBus.emit('overlay-click', {
          originalEvent: event,
          target: this.$el
        });
      }
    },
    onOverlayKeyDown: function onOverlayKeyDown(event) {
      switch (event.code) {
        case 'Escape':
          if (!this.inline) {
            this.input.focus();
            this.overlayVisible = false;
          }
          break;
      }
    },
    onOverlayMouseUp: function onOverlayMouseUp(event) {
      this.onOverlayClick(event);
    },
    createResponsiveStyle: function createResponsiveStyle() {
      if (this.numberOfMonths > 1 && this.responsiveOptions && !this.isUnstyled) {
        if (!this.responsiveStyleElement) {
          var _this$$primevue;
          this.responsiveStyleElement = document.createElement('style');
          this.responsiveStyleElement.type = 'text/css';
          setAttribute(this.responsiveStyleElement, 'nonce', (_this$$primevue = this.$primevue) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.config) === null || _this$$primevue === void 0 || (_this$$primevue = _this$$primevue.csp) === null || _this$$primevue === void 0 ? void 0 : _this$$primevue.nonce);
          document.body.appendChild(this.responsiveStyleElement);
        }
        var innerHTML = '';
        if (this.responsiveOptions) {
          var comparer = localeComparator();
          var responsiveOptions = _toConsumableArray(this.responsiveOptions).filter(function (o) {
            return !!(o.breakpoint && o.numMonths);
          }).sort(function (o1, o2) {
            return -1 * comparer(o1.breakpoint, o2.breakpoint);
          });
          for (var i = 0; i < responsiveOptions.length; i++) {
            var _responsiveOptions$i = responsiveOptions[i],
              breakpoint = _responsiveOptions$i.breakpoint,
              numMonths = _responsiveOptions$i.numMonths;
            var styles = "\n                            .p-datepicker-panel[".concat(this.$attrSelector, "] .p-datepicker-calendar:nth-child(").concat(numMonths, ") .p-datepicker-next-button {\n                                display: inline-flex;\n                            }\n                        ");
            for (var j = numMonths; j < this.numberOfMonths; j++) {
              styles += "\n                                .p-datepicker-panel[".concat(this.$attrSelector, "] .p-datepicker-calendar:nth-child(").concat(j + 1, ") {\n                                    display: none;\n                                }\n                            ");
            }
            innerHTML += "\n                            @media screen and (max-width: ".concat(breakpoint, ") {\n                                ").concat(styles, "\n                            }\n                        ");
          }
        }
        this.responsiveStyleElement.innerHTML = innerHTML;
      }
    },
    destroyResponsiveStyleElement: function destroyResponsiveStyleElement() {
      if (this.responsiveStyleElement) {
        this.responsiveStyleElement.remove();
        this.responsiveStyleElement = null;
      }
    }
  },
  computed: {
    viewDate: function viewDate() {
      var propValue = this.modelValue;
      if (propValue && Array.isArray(propValue)) {
        if (this.isRangeSelection()) {
          propValue = this.inline ? propValue[0] : propValue[1] || propValue[0];
        } else if (this.isMultipleSelection()) {
          propValue = propValue[propValue.length - 1];
        }
      }
      if (propValue && typeof propValue !== 'string') {
        return propValue;
      } else {
        var today = new Date();
        if (this.maxDate && this.maxDate < today) {
          return this.maxDate;
        }
        if (this.minDate && this.minDate > today) {
          return this.minDate;
        }
        return today;
      }
    },
    inputFieldValue: function inputFieldValue() {
      return this.formatValue(this.modelValue);
    },
    months: function months() {
      var months = [];
      for (var i = 0; i < this.numberOfMonths; i++) {
        var month = this.currentMonth + i;
        var year = this.currentYear;
        if (month > 11) {
          month = month % 11 - 1;
          year = year + 1;
        }
        var dates = [];
        var firstDay = this.getFirstDayOfMonthIndex(month, year);
        var daysLength = this.getDaysCountInMonth(month, year);
        var prevMonthDaysLength = this.getDaysCountInPrevMonth(month, year);
        var dayNo = 1;
        var today = new Date();
        var weekNumbers = [];
        var monthRows = Math.ceil((daysLength + firstDay) / 7);
        for (var _i2 = 0; _i2 < monthRows; _i2++) {
          var week = [];
          if (_i2 == 0) {
            for (var j = prevMonthDaysLength - firstDay + 1; j <= prevMonthDaysLength; j++) {
              var prev = this.getPreviousMonthAndYear(month, year);
              week.push({
                day: j,
                month: prev.month,
                year: prev.year,
                otherMonth: true,
                today: this.isToday(today, j, prev.month, prev.year),
                selectable: this.isSelectable(j, prev.month, prev.year, true)
              });
            }
            var remainingDaysLength = 7 - week.length;
            for (var _j = 0; _j < remainingDaysLength; _j++) {
              week.push({
                day: dayNo,
                month: month,
                year: year,
                today: this.isToday(today, dayNo, month, year),
                selectable: this.isSelectable(dayNo, month, year, false)
              });
              dayNo++;
            }
          } else {
            for (var _j2 = 0; _j2 < 7; _j2++) {
              if (dayNo > daysLength) {
                var next = this.getNextMonthAndYear(month, year);
                week.push({
                  day: dayNo - daysLength,
                  month: next.month,
                  year: next.year,
                  otherMonth: true,
                  today: this.isToday(today, dayNo - daysLength, next.month, next.year),
                  selectable: this.isSelectable(dayNo - daysLength, next.month, next.year, true)
                });
              } else {
                week.push({
                  day: dayNo,
                  month: month,
                  year: year,
                  today: this.isToday(today, dayNo, month, year),
                  selectable: this.isSelectable(dayNo, month, year, false)
                });
              }
              dayNo++;
            }
          }
          if (this.showWeek) {
            weekNumbers.push(this.getWeekNumber(new Date(week[0].year, week[0].month, week[0].day)));
          }
          dates.push(week);
        }
        months.push({
          month: month,
          year: year,
          dates: dates,
          weekNumbers: weekNumbers
        });
      }
      return months;
    },
    weekDays: function weekDays() {
      var weekDays = [];
      var dayIndex = this.$primevue.config.locale.firstDayOfWeek;
      for (var i = 0; i < 7; i++) {
        weekDays.push(this.$primevue.config.locale.dayNamesMin[dayIndex]);
        dayIndex = dayIndex == 6 ? 0 : ++dayIndex;
      }
      return weekDays;
    },
    ticksTo1970: function ticksTo1970() {
      return ((1970 - 1) * 365 + Math.floor(1970 / 4) - Math.floor(1970 / 100) + Math.floor(1970 / 400)) * 24 * 60 * 60 * 10000000;
    },
    sundayIndex: function sundayIndex() {
      return this.$primevue.config.locale.firstDayOfWeek > 0 ? 7 - this.$primevue.config.locale.firstDayOfWeek : 0;
    },
    datePattern: function datePattern() {
      return this.dateFormat || this.$primevue.config.locale.dateFormat;
    },
    monthPickerValues: function monthPickerValues() {
      var _this12 = this;
      var monthPickerValues = [];
      var isSelectableMonth = function isSelectableMonth(baseMonth) {
        if (_this12.minDate) {
          var minMonth = _this12.minDate.getMonth();
          var minYear = _this12.minDate.getFullYear();
          if (_this12.currentYear < minYear || _this12.currentYear === minYear && baseMonth < minMonth) {
            return false;
          }
        }
        if (_this12.maxDate) {
          var maxMonth = _this12.maxDate.getMonth();
          var maxYear = _this12.maxDate.getFullYear();
          if (_this12.currentYear > maxYear || _this12.currentYear === maxYear && baseMonth > maxMonth) {
            return false;
          }
        }
        return true;
      };
      for (var i = 0; i <= 11; i++) {
        monthPickerValues.push({
          value: this.$primevue.config.locale.monthNamesShort[i],
          selectable: isSelectableMonth(i)
        });
      }
      return monthPickerValues;
    },
    yearPickerValues: function yearPickerValues() {
      var _this13 = this;
      var yearPickerValues = [];
      var base = this.currentYear - this.currentYear % 10;
      var isSelectableYear = function isSelectableYear(baseYear) {
        if (_this13.minDate) {
          if (_this13.minDate.getFullYear() > baseYear) return false;
        }
        if (_this13.maxDate) {
          if (_this13.maxDate.getFullYear() < baseYear) return false;
        }
        return true;
      };
      for (var i = 0; i < 10; i++) {
        yearPickerValues.push({
          value: base + i,
          selectable: isSelectableYear(base + i)
        });
      }
      return yearPickerValues;
    },
    formattedCurrentHour: function formattedCurrentHour() {
      return this.currentHour < 10 ? '0' + this.currentHour : this.currentHour;
    },
    formattedCurrentMinute: function formattedCurrentMinute() {
      return this.currentMinute < 10 ? '0' + this.currentMinute : this.currentMinute;
    },
    formattedCurrentSecond: function formattedCurrentSecond() {
      return this.currentSecond < 10 ? '0' + this.currentSecond : this.currentSecond;
    },
    todayLabel: function todayLabel() {
      return this.$primevue.config.locale.today;
    },
    clearLabel: function clearLabel() {
      return this.$primevue.config.locale.clear;
    },
    weekHeaderLabel: function weekHeaderLabel() {
      return this.$primevue.config.locale.weekHeader;
    },
    monthNames: function monthNames() {
      return this.$primevue.config.locale.monthNames;
    },
    switchViewButtonDisabled: function switchViewButtonDisabled() {
      return this.numberOfMonths > 1 || this.disabled;
    },
    panelId: function panelId() {
      return this.d_id + '_panel';
    },
    hasFluid: function hasFluid() {
      return isEmpty(this.fluid) ? !!this.$pcFluid : this.fluid;
    }
  },
  components: {
    InputText: InputText,
    Button: Button,
    Portal: Portal,
    CalendarIcon: CalendarIcon,
    ChevronLeftIcon: ChevronLeftIcon,
    ChevronRightIcon: ChevronRightIcon,
    ChevronUpIcon: ChevronUpIcon,
    ChevronDownIcon: ChevronDownIcon
  },
  directives: {
    ripple: Ripple
  }
};

var _hoisted_1 = ["id"];
var _hoisted_2 = ["disabled", "aria-label", "aria-expanded", "aria-controls"];
var _hoisted_3 = ["id", "role", "aria-modal", "aria-label"];
var _hoisted_4 = ["disabled", "aria-label"];
var _hoisted_5 = ["disabled", "aria-label"];
var _hoisted_6 = ["disabled", "aria-label"];
var _hoisted_7 = ["disabled", "aria-label"];
var _hoisted_8 = ["data-p-disabled"];
var _hoisted_9 = ["abbr"];
var _hoisted_10 = ["data-p-disabled"];
var _hoisted_11 = ["aria-label", "data-p-today", "data-p-other-month"];
var _hoisted_12 = ["onClick", "onKeydown", "aria-selected", "aria-disabled", "data-p-disabled", "data-p-selected"];
var _hoisted_13 = ["onClick", "onKeydown", "data-p-disabled", "data-p-selected"];
var _hoisted_14 = ["onClick", "onKeydown", "data-p-disabled", "data-p-selected"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _component_InputText = resolveComponent("InputText");
  var _component_Button = resolveComponent("Button");
  var _component_Portal = resolveComponent("Portal");
  var _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("span", mergeProps({
    ref: "container",
    id: $data.d_id,
    "class": _ctx.cx('root'),
    style: _ctx.sx('root')
  }, _ctx.ptmi('root')), [!_ctx.inline ? (openBlock(), createBlock(_component_InputText, {
    key: 0,
    ref: $options.inputRef,
    id: _ctx.inputId,
    role: "combobox",
    "class": normalizeClass([_ctx.inputClass, _ctx.cx('pcInputText')]),
    style: normalizeStyle(_ctx.inputStyle),
    value: $options.inputFieldValue,
    placeholder: _ctx.placeholder,
    name: _ctx.name,
    invalid: _ctx.invalid,
    variant: _ctx.variant,
    fluid: _ctx.fluid,
    unstyled: _ctx.unstyled,
    autocomplete: "off",
    "aria-autocomplete": "none",
    "aria-haspopup": "dialog",
    "aria-expanded": $data.overlayVisible,
    "aria-controls": $options.panelId,
    "aria-labelledby": _ctx.ariaLabelledby,
    "aria-label": _ctx.ariaLabel,
    inputmode: "none",
    disabled: _ctx.disabled,
    readonly: !_ctx.manualInput || _ctx.readonly,
    tabindex: 0,
    onInput: $options.onInput,
    onClick: $options.onInputClick,
    onFocus: $options.onFocus,
    onBlur: $options.onBlur,
    onKeydown: $options.onKeyDown,
    pt: _ctx.ptm('pcInputText')
  }, null, 8, ["id", "class", "style", "value", "placeholder", "name", "invalid", "variant", "fluid", "unstyled", "aria-expanded", "aria-controls", "aria-labelledby", "aria-label", "disabled", "readonly", "onInput", "onClick", "onFocus", "onBlur", "onKeydown", "pt"])) : createCommentVNode("", true), _ctx.showIcon && _ctx.iconDisplay === 'button' && !_ctx.inline ? renderSlot(_ctx.$slots, "dropdownbutton", {
    key: 1
  }, function () {
    return [createElementVNode("button", mergeProps({
      "class": _ctx.cx('dropdown'),
      disabled: _ctx.disabled,
      onClick: _cache[0] || (_cache[0] = function () {
        return $options.onButtonClick && $options.onButtonClick.apply($options, arguments);
      }),
      type: "button",
      "aria-label": _ctx.$primevue.config.locale.chooseDate,
      "aria-haspopup": "dialog",
      "aria-expanded": $data.overlayVisible,
      "aria-controls": $options.panelId
    }, _ctx.ptm('dropdown')), [renderSlot(_ctx.$slots, "dropdownicon", {
      "class": normalizeClass(_ctx.icon)
    }, function () {
      return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.icon ? 'span' : 'CalendarIcon'), mergeProps({
        "class": _ctx.icon
      }, _ctx.ptm('dropdownIcon')), null, 16, ["class"]))];
    })], 16, _hoisted_2)];
  }) : _ctx.showIcon && _ctx.iconDisplay === 'input' && !_ctx.inline ? (openBlock(), createElementBlock(Fragment, {
    key: 2
  }, [_ctx.$slots.inputicon || _ctx.showIcon ? (openBlock(), createElementBlock("span", mergeProps({
    key: 0,
    "class": _ctx.cx('inputIconContainer')
  }, _ctx.ptm('inputIconContainer')), [renderSlot(_ctx.$slots, "inputicon", {
    "class": normalizeClass(_ctx.cx('inputIcon')),
    clickCallback: $options.onButtonClick
  }, function () {
    return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.icon ? 'i' : 'CalendarIcon'), mergeProps({
      "class": [_ctx.icon, _ctx.cx('inputIcon')],
      onClick: $options.onButtonClick
    }, _ctx.ptm('inputicon')), null, 16, ["class", "onClick"]))];
  })], 16)) : createCommentVNode("", true)], 64)) : createCommentVNode("", true), createVNode(_component_Portal, {
    appendTo: _ctx.appendTo,
    disabled: _ctx.inline
  }, {
    "default": withCtx(function () {
      return [createVNode(Transition, mergeProps({
        name: "p-connected-overlay",
        onEnter: _cache[58] || (_cache[58] = function ($event) {
          return $options.onOverlayEnter($event);
        }),
        onAfterEnter: $options.onOverlayEnterComplete,
        onAfterLeave: $options.onOverlayAfterLeave,
        onLeave: $options.onOverlayLeave
      }, _ctx.ptm('transition')), {
        "default": withCtx(function () {
          return [_ctx.inline || $data.overlayVisible ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            ref: $options.overlayRef,
            id: $options.panelId,
            "class": [_ctx.cx('panel'), _ctx.panelClass],
            style: _ctx.panelStyle,
            role: _ctx.inline ? null : 'dialog',
            "aria-modal": _ctx.inline ? null : 'true',
            "aria-label": _ctx.$primevue.config.locale.chooseDate,
            onClick: _cache[55] || (_cache[55] = function () {
              return $options.onOverlayClick && $options.onOverlayClick.apply($options, arguments);
            }),
            onKeydown: _cache[56] || (_cache[56] = function () {
              return $options.onOverlayKeyDown && $options.onOverlayKeyDown.apply($options, arguments);
            }),
            onMouseup: _cache[57] || (_cache[57] = function () {
              return $options.onOverlayMouseUp && $options.onOverlayMouseUp.apply($options, arguments);
            })
          }, _ctx.ptm('panel')), [!_ctx.timeOnly ? (openBlock(), createElementBlock(Fragment, {
            key: 0
          }, [createElementVNode("div", mergeProps({
            "class": _ctx.cx('calendarContainer')
          }, _ctx.ptm('calendarContainer')), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.months, function (month, groupIndex) {
            return openBlock(), createElementBlock("div", mergeProps({
              key: month.month + month.year,
              "class": _ctx.cx('calendar'),
              ref_for: true
            }, _ctx.ptm('calendar')), [createElementVNode("div", mergeProps({
              "class": _ctx.cx('header'),
              ref_for: true
            }, _ctx.ptm('header')), [renderSlot(_ctx.$slots, "header"), withDirectives(createVNode(_component_Button, mergeProps({
              ref_for: true,
              ref: $options.previousButtonRef,
              "class": _ctx.cx('pcPrevButton'),
              disabled: _ctx.disabled,
              "aria-label": $data.currentView === 'year' ? _ctx.$primevue.config.locale.prevDecade : $data.currentView === 'month' ? _ctx.$primevue.config.locale.prevYear : _ctx.$primevue.config.locale.prevMonth,
              unstyled: _ctx.unstyled,
              onClick: $options.onPrevButtonClick,
              onKeydown: $options.onContainerButtonKeydown
            }, _ctx.navigatorButtonProps, {
              pt: _ctx.ptm('pcPrevButton'),
              "data-pc-group-section": "navigator"
            }), {
              icon: withCtx(function (slotProps) {
                return [renderSlot(_ctx.$slots, "previcon", {}, function () {
                  return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.prevIcon ? 'span' : 'ChevronLeftIcon'), mergeProps({
                    "class": [_ctx.prevIcon, slotProps["class"]],
                    ref_for: true
                  }, _ctx.ptm('pcPrevButton')['icon']), null, 16, ["class"]))];
                })];
              }),
              _: 2
            }, 1040, ["class", "disabled", "aria-label", "unstyled", "onClick", "onKeydown", "pt"]), [[vShow, groupIndex === 0]]), createElementVNode("div", mergeProps({
              "class": _ctx.cx('title'),
              ref_for: true
            }, _ctx.ptm('title')), [_ctx.$primevue.config.locale.showMonthAfterYear ? (openBlock(), createElementBlock(Fragment, {
              key: 0
            }, [$data.currentView !== 'year' ? (openBlock(), createElementBlock("button", mergeProps({
              key: 0,
              type: "button",
              onClick: _cache[1] || (_cache[1] = function () {
                return $options.switchToYearView && $options.switchToYearView.apply($options, arguments);
              }),
              onKeydown: _cache[2] || (_cache[2] = function () {
                return $options.onContainerButtonKeydown && $options.onContainerButtonKeydown.apply($options, arguments);
              }),
              "class": _ctx.cx('selectYear'),
              disabled: $options.switchViewButtonDisabled,
              "aria-label": _ctx.$primevue.config.locale.chooseYear,
              ref_for: true
            }, _ctx.ptm('selectYear'), {
              "data-pc-group-section": "view"
            }), toDisplayString($options.getYear(month)), 17, _hoisted_4)) : createCommentVNode("", true), $data.currentView === 'date' ? (openBlock(), createElementBlock("button", mergeProps({
              key: 1,
              type: "button",
              onClick: _cache[3] || (_cache[3] = function () {
                return $options.switchToMonthView && $options.switchToMonthView.apply($options, arguments);
              }),
              onKeydown: _cache[4] || (_cache[4] = function () {
                return $options.onContainerButtonKeydown && $options.onContainerButtonKeydown.apply($options, arguments);
              }),
              "class": _ctx.cx('selectMonth'),
              disabled: $options.switchViewButtonDisabled,
              "aria-label": _ctx.$primevue.config.locale.chooseMonth,
              ref_for: true
            }, _ctx.ptm('selectMonth'), {
              "data-pc-group-section": "view"
            }), toDisplayString($options.getMonthName(month.month)), 17, _hoisted_5)) : createCommentVNode("", true)], 64)) : (openBlock(), createElementBlock(Fragment, {
              key: 1
            }, [$data.currentView === 'date' ? (openBlock(), createElementBlock("button", mergeProps({
              key: 0,
              type: "button",
              onClick: _cache[5] || (_cache[5] = function () {
                return $options.switchToMonthView && $options.switchToMonthView.apply($options, arguments);
              }),
              onKeydown: _cache[6] || (_cache[6] = function () {
                return $options.onContainerButtonKeydown && $options.onContainerButtonKeydown.apply($options, arguments);
              }),
              "class": _ctx.cx('selectMonth'),
              disabled: $options.switchViewButtonDisabled,
              "aria-label": _ctx.$primevue.config.locale.chooseMonth,
              ref_for: true
            }, _ctx.ptm('selectMonth'), {
              "data-pc-group-section": "view"
            }), toDisplayString($options.getMonthName(month.month)), 17, _hoisted_6)) : createCommentVNode("", true), $data.currentView !== 'year' ? (openBlock(), createElementBlock("button", mergeProps({
              key: 1,
              type: "button",
              onClick: _cache[7] || (_cache[7] = function () {
                return $options.switchToYearView && $options.switchToYearView.apply($options, arguments);
              }),
              onKeydown: _cache[8] || (_cache[8] = function () {
                return $options.onContainerButtonKeydown && $options.onContainerButtonKeydown.apply($options, arguments);
              }),
              "class": _ctx.cx('selectYear'),
              disabled: $options.switchViewButtonDisabled,
              "aria-label": _ctx.$primevue.config.locale.chooseYear,
              ref_for: true
            }, _ctx.ptm('selectYear'), {
              "data-pc-group-section": "view"
            }), toDisplayString($options.getYear(month)), 17, _hoisted_7)) : createCommentVNode("", true)], 64)), $data.currentView === 'year' ? (openBlock(), createElementBlock("span", mergeProps({
              key: 2,
              "class": _ctx.cx('decade'),
              ref_for: true
            }, _ctx.ptm('decade')), [renderSlot(_ctx.$slots, "decade", {
              years: $options.yearPickerValues
            }, function () {
              return [createTextVNode(toDisplayString($options.yearPickerValues[0].value) + " - " + toDisplayString($options.yearPickerValues[$options.yearPickerValues.length - 1].value), 1)];
            })], 16)) : createCommentVNode("", true)], 16), withDirectives(createVNode(_component_Button, mergeProps({
              ref_for: true,
              ref: $options.nextButtonRef,
              "class": _ctx.cx('pcNextButton'),
              disabled: _ctx.disabled,
              "aria-label": $data.currentView === 'year' ? _ctx.$primevue.config.locale.nextDecade : $data.currentView === 'month' ? _ctx.$primevue.config.locale.nextYear : _ctx.$primevue.config.locale.nextMonth,
              unstyled: _ctx.unstyled,
              onClick: $options.onNextButtonClick,
              onKeydown: $options.onContainerButtonKeydown
            }, _ctx.navigatorButtonProps, {
              pt: _ctx.ptm('pcNextButton'),
              "data-pc-group-section": "navigator"
            }), {
              icon: withCtx(function (slotProps) {
                return [renderSlot(_ctx.$slots, "nexticon", {}, function () {
                  return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.nextIcon ? 'span' : 'ChevronRightIcon'), mergeProps({
                    "class": [_ctx.nextIcon, slotProps["class"]],
                    ref_for: true
                  }, _ctx.ptm('pcNextButton')['icon']), null, 16, ["class"]))];
                })];
              }),
              _: 2
            }, 1040, ["class", "disabled", "aria-label", "unstyled", "onClick", "onKeydown", "pt"]), [[vShow, _ctx.numberOfMonths === 1 ? true : groupIndex === _ctx.numberOfMonths - 1]])], 16), $data.currentView === 'date' ? (openBlock(), createElementBlock("table", mergeProps({
              key: 0,
              "class": _ctx.cx('dayView'),
              role: "grid",
              ref_for: true
            }, _ctx.ptm('dayView')), [createElementVNode("thead", mergeProps({
              ref_for: true
            }, _ctx.ptm('tableHeader')), [createElementVNode("tr", mergeProps({
              ref_for: true
            }, _ctx.ptm('tableHeaderRow')), [_ctx.showWeek ? (openBlock(), createElementBlock("th", mergeProps({
              key: 0,
              scope: "col",
              "class": _ctx.cx('weekHeader'),
              ref_for: true
            }, _ctx.ptm('weekHeader', {
              context: {
                disabled: _ctx.showWeek
              }
            }), {
              "data-p-disabled": _ctx.showWeek,
              "data-pc-group-section": "tableheadercell"
            }), [renderSlot(_ctx.$slots, "weekheaderlabel", {}, function () {
              return [createElementVNode("span", mergeProps({
                ref_for: true
              }, _ctx.ptm('weekHeaderLabel', {
                context: {
                  disabled: _ctx.showWeek
                }
              }), {
                "data-pc-group-section": "tableheadercelllabel"
              }), toDisplayString($options.weekHeaderLabel), 17)];
            })], 16, _hoisted_8)) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList($options.weekDays, function (weekDay) {
              return openBlock(), createElementBlock("th", mergeProps({
                key: weekDay,
                scope: "col",
                abbr: weekDay,
                ref_for: true
              }, _ctx.ptm('tableHeaderCell'), {
                "data-pc-group-section": "tableheadercell",
                "class": _ctx.cx('weekDayCell')
              }), [createElementVNode("span", mergeProps({
                "class": _ctx.cx('weekDay'),
                ref_for: true
              }, _ctx.ptm('weekDay'), {
                "data-pc-group-section": "tableheadercelllabel"
              }), toDisplayString(weekDay), 17)], 16, _hoisted_9);
            }), 128))], 16)], 16), createElementVNode("tbody", mergeProps({
              ref_for: true
            }, _ctx.ptm('tableBody')), [(openBlock(true), createElementBlock(Fragment, null, renderList(month.dates, function (week, i) {
              return openBlock(), createElementBlock("tr", mergeProps({
                key: week[0].day + '' + week[0].month,
                ref_for: true
              }, _ctx.ptm('tableBodyRow')), [_ctx.showWeek ? (openBlock(), createElementBlock("td", mergeProps({
                key: 0,
                "class": _ctx.cx('weekNumber'),
                ref_for: true
              }, _ctx.ptm('weekNumber'), {
                "data-pc-group-section": "tablebodycell"
              }), [createElementVNode("span", mergeProps({
                "class": _ctx.cx('weekLabelContainer'),
                ref_for: true
              }, _ctx.ptm('weekLabelContainer', {
                context: {
                  disabled: _ctx.showWeek
                }
              }), {
                "data-p-disabled": _ctx.showWeek,
                "data-pc-group-section": "tablebodycelllabel"
              }), [renderSlot(_ctx.$slots, "weeklabel", {
                weekNumber: month.weekNumbers[i]
              }, function () {
                return [month.weekNumbers[i] < 10 ? (openBlock(), createElementBlock("span", mergeProps({
                  key: 0,
                  style: {
                    "visibility": "hidden"
                  },
                  ref_for: true
                }, _ctx.ptm('weekLabel')), "0", 16)) : createCommentVNode("", true), createTextVNode(" " + toDisplayString(month.weekNumbers[i]), 1)];
              })], 16, _hoisted_10)], 16)) : createCommentVNode("", true), (openBlock(true), createElementBlock(Fragment, null, renderList(week, function (date) {
                return openBlock(), createElementBlock("td", mergeProps({
                  key: date.day + '' + date.month,
                  "aria-label": date.day,
                  "class": _ctx.cx('dayCell', {
                    date: date
                  }),
                  ref_for: true
                }, _ctx.ptm('dayCell', {
                  context: {
                    date: date,
                    today: date.today,
                    otherMonth: date.otherMonth,
                    selected: $options.isSelected(date),
                    disabled: !date.selectable
                  }
                }), {
                  "data-p-today": date.today,
                  "data-p-other-month": date.otherMonth,
                  "data-pc-group-section": "tablebodycell"
                }), [_ctx.showOtherMonths || !date.otherMonth ? withDirectives((openBlock(), createElementBlock("span", mergeProps({
                  key: 0,
                  "class": _ctx.cx('day', {
                    date: date
                  }),
                  onClick: function onClick($event) {
                    return $options.onDateSelect($event, date);
                  },
                  draggable: "false",
                  onKeydown: function onKeydown($event) {
                    return $options.onDateCellKeydown($event, date, groupIndex);
                  },
                  "aria-selected": $options.isSelected(date),
                  "aria-disabled": !date.selectable,
                  ref_for: true
                }, _ctx.ptm('day', {
                  context: {
                    date: date,
                    today: date.today,
                    otherMonth: date.otherMonth,
                    selected: $options.isSelected(date),
                    disabled: !date.selectable
                  }
                }), {
                  "data-p-disabled": !date.selectable,
                  "data-p-selected": $options.isSelected(date),
                  "data-pc-group-section": "tablebodycelllabel"
                }), [renderSlot(_ctx.$slots, "date", {
                  date: date
                }, function () {
                  return [createTextVNode(toDisplayString(date.day), 1)];
                })], 16, _hoisted_12)), [[_directive_ripple]]) : createCommentVNode("", true), $options.isSelected(date) ? (openBlock(), createElementBlock("div", mergeProps({
                  key: 1,
                  "class": "p-hidden-accessible",
                  "aria-live": "polite",
                  ref_for: true
                }, _ctx.ptm('hiddenSelectedDay'), {
                  "data-p-hidden-accessible": true
                }), toDisplayString(date.day), 17)) : createCommentVNode("", true)], 16, _hoisted_11);
              }), 128))], 16);
            }), 128))], 16)], 16)) : createCommentVNode("", true)], 16);
          }), 128))], 16), $data.currentView === 'month' ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            "class": _ctx.cx('monthView')
          }, _ctx.ptm('monthView')), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.monthPickerValues, function (m, i) {
            return withDirectives((openBlock(), createElementBlock("span", mergeProps({
              key: m,
              onClick: function onClick($event) {
                return $options.onMonthSelect($event, {
                  month: m,
                  index: i
                });
              },
              onKeydown: function onKeydown($event) {
                return $options.onMonthCellKeydown($event, {
                  month: m,
                  index: i
                });
              },
              "class": _ctx.cx('month', {
                month: m,
                index: i
              }),
              ref_for: true
            }, _ctx.ptm('month', {
              context: {
                month: m,
                monthIndex: i,
                selected: $options.isMonthSelected(i),
                disabled: !m.selectable
              }
            }), {
              "data-p-disabled": !m.selectable,
              "data-p-selected": $options.isMonthSelected(i)
            }), [createTextVNode(toDisplayString(m.value) + " ", 1), $options.isMonthSelected(i) ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              "class": "p-hidden-accessible",
              "aria-live": "polite",
              ref_for: true
            }, _ctx.ptm('hiddenMonth'), {
              "data-p-hidden-accessible": true
            }), toDisplayString(m.value), 17)) : createCommentVNode("", true)], 16, _hoisted_13)), [[_directive_ripple]]);
          }), 128))], 16)) : createCommentVNode("", true), $data.currentView === 'year' ? (openBlock(), createElementBlock("div", mergeProps({
            key: 1,
            "class": _ctx.cx('yearView')
          }, _ctx.ptm('yearView')), [(openBlock(true), createElementBlock(Fragment, null, renderList($options.yearPickerValues, function (y) {
            return withDirectives((openBlock(), createElementBlock("span", mergeProps({
              key: y.value,
              onClick: function onClick($event) {
                return $options.onYearSelect($event, y);
              },
              onKeydown: function onKeydown($event) {
                return $options.onYearCellKeydown($event, y);
              },
              "class": _ctx.cx('year', {
                year: y
              }),
              ref_for: true
            }, _ctx.ptm('year', {
              context: {
                year: y,
                selected: $options.isYearSelected(y.value),
                disabled: !y.selectable
              }
            }), {
              "data-p-disabled": !y.selectable,
              "data-p-selected": $options.isYearSelected(y.value)
            }), [createTextVNode(toDisplayString(y.value) + " ", 1), $options.isYearSelected(y.value) ? (openBlock(), createElementBlock("div", mergeProps({
              key: 0,
              "class": "p-hidden-accessible",
              "aria-live": "polite",
              ref_for: true
            }, _ctx.ptm('hiddenYear'), {
              "data-p-hidden-accessible": true
            }), toDisplayString(y.value), 17)) : createCommentVNode("", true)], 16, _hoisted_14)), [[_directive_ripple]]);
          }), 128))], 16)) : createCommentVNode("", true)], 64)) : createCommentVNode("", true), (_ctx.showTime || _ctx.timeOnly) && $data.currentView === 'date' ? (openBlock(), createElementBlock("div", mergeProps({
            key: 1,
            "class": _ctx.cx('timePicker')
          }, _ctx.ptm('timePicker')), [createElementVNode("div", mergeProps({
            "class": _ctx.cx('hourPicker')
          }, _ctx.ptm('hourPicker'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcIncrementButton'),
            "aria-label": _ctx.$primevue.config.locale.nextHour,
            unstyled: _ctx.unstyled,
            onMousedown: _cache[9] || (_cache[9] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, 1);
            }),
            onMouseup: _cache[10] || (_cache[10] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[12] || (_cache[12] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, 1);
            }, ["enter"])), _cache[13] || (_cache[13] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, 1);
            }, ["space"]))],
            onMouseleave: _cache[11] || (_cache[11] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[14] || (_cache[14] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[15] || (_cache[15] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcIncrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "incrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementIcon ? 'span' : 'ChevronUpIcon'), mergeProps({
                  "class": [_ctx.incrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcIncrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "unstyled", "onKeydown", "pt"]), createElementVNode("span", mergeProps(_ctx.ptm('hour'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString($options.formattedCurrentHour), 17), createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcDecrementButton'),
            "aria-label": _ctx.$primevue.config.locale.prevHour,
            unstyled: _ctx.unstyled,
            onMousedown: _cache[16] || (_cache[16] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, -1);
            }),
            onMouseup: _cache[17] || (_cache[17] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[19] || (_cache[19] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, -1);
            }, ["enter"])), _cache[20] || (_cache[20] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 0, -1);
            }, ["space"]))],
            onMouseleave: _cache[18] || (_cache[18] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[21] || (_cache[21] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[22] || (_cache[22] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcDecrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "decrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementIcon ? 'span' : 'ChevronDownIcon'), mergeProps({
                  "class": [_ctx.decrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcDecrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "unstyled", "onKeydown", "pt"])], 16), createElementVNode("div", mergeProps(_ctx.ptm('separatorContainer'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createElementVNode("span", mergeProps(_ctx.ptm('separator'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString(_ctx.timeSeparator), 17)], 16), createElementVNode("div", mergeProps({
            "class": _ctx.cx('minutePicker')
          }, _ctx.ptm('minutePicker'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcIncrementButton'),
            "aria-label": _ctx.$primevue.config.locale.nextMinute,
            disabled: _ctx.disabled,
            unstyled: _ctx.unstyled,
            onMousedown: _cache[23] || (_cache[23] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, 1);
            }),
            onMouseup: _cache[24] || (_cache[24] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[26] || (_cache[26] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, 1);
            }, ["enter"])), _cache[27] || (_cache[27] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, 1);
            }, ["space"]))],
            onMouseleave: _cache[25] || (_cache[25] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[28] || (_cache[28] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[29] || (_cache[29] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcIncrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "incrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementIcon ? 'span' : 'ChevronUpIcon'), mergeProps({
                  "class": [_ctx.incrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcIncrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "unstyled", "onKeydown", "pt"]), createElementVNode("span", mergeProps(_ctx.ptm('minute'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString($options.formattedCurrentMinute), 17), createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcDecrementButton'),
            "aria-label": _ctx.$primevue.config.locale.prevMinute,
            disabled: _ctx.disabled,
            onMousedown: _cache[30] || (_cache[30] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, -1);
            }),
            onMouseup: _cache[31] || (_cache[31] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[33] || (_cache[33] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, -1);
            }, ["enter"])), _cache[34] || (_cache[34] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 1, -1);
            }, ["space"]))],
            onMouseleave: _cache[32] || (_cache[32] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[35] || (_cache[35] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[36] || (_cache[36] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcDecrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "decrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementIcon ? 'span' : 'ChevronDownIcon'), mergeProps({
                  "class": [_ctx.decrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcDecrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "onKeydown", "pt"])], 16), _ctx.showSeconds ? (openBlock(), createElementBlock("div", mergeProps({
            key: 0,
            "class": _ctx.cx('separatorContainer')
          }, _ctx.ptm('separatorContainer'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createElementVNode("span", mergeProps(_ctx.ptm('separator'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString(_ctx.timeSeparator), 17)], 16)) : createCommentVNode("", true), _ctx.showSeconds ? (openBlock(), createElementBlock("div", mergeProps({
            key: 1,
            "class": _ctx.cx('secondPicker')
          }, _ctx.ptm('secondPicker'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcIncrementButton'),
            "aria-label": _ctx.$primevue.config.locale.nextSecond,
            disabled: _ctx.disabled,
            unstyled: _ctx.unstyled,
            onMousedown: _cache[37] || (_cache[37] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, 1);
            }),
            onMouseup: _cache[38] || (_cache[38] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[40] || (_cache[40] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, 1);
            }, ["enter"])), _cache[41] || (_cache[41] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, 1);
            }, ["space"]))],
            onMouseleave: _cache[39] || (_cache[39] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[42] || (_cache[42] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[43] || (_cache[43] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcIncrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "incrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementIcon ? 'span' : 'ChevronUpIcon'), mergeProps({
                  "class": [_ctx.incrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcIncrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "unstyled", "onKeydown", "pt"]), createElementVNode("span", mergeProps(_ctx.ptm('second'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString($options.formattedCurrentSecond), 17), createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcDecrementButton'),
            "aria-label": _ctx.$primevue.config.locale.prevSecond,
            disabled: _ctx.disabled,
            unstyled: _ctx.unstyled,
            onMousedown: _cache[44] || (_cache[44] = function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, -1);
            }),
            onMouseup: _cache[45] || (_cache[45] = function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }),
            onKeydown: [$options.onContainerButtonKeydown, _cache[47] || (_cache[47] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, -1);
            }, ["enter"])), _cache[48] || (_cache[48] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseDown($event, 2, -1);
            }, ["space"]))],
            onMouseleave: _cache[46] || (_cache[46] = function ($event) {
              return $options.onTimePickerElementMouseLeave();
            }),
            onKeyup: [_cache[49] || (_cache[49] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["enter"])), _cache[50] || (_cache[50] = withKeys(function ($event) {
              return $options.onTimePickerElementMouseUp($event);
            }, ["space"]))]
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcDecrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "decrementicon", {}, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementIcon ? 'span' : 'ChevronDownIcon'), mergeProps({
                  "class": [_ctx.decrementIcon, slotProps["class"]]
                }, _ctx.ptm('pcDecrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "unstyled", "onKeydown", "pt"])], 16)) : createCommentVNode("", true), _ctx.hourFormat == '12' ? (openBlock(), createElementBlock("div", mergeProps({
            key: 2,
            "class": _ctx.cx('separatorContainer')
          }, _ctx.ptm('separatorContainer'), {
            "data-pc-group-section": "timepickerContainer"
          }), [createElementVNode("span", mergeProps(_ctx.ptm('separator'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString(_ctx.timeSeparator), 17)], 16)) : createCommentVNode("", true), _ctx.hourFormat == '12' ? (openBlock(), createElementBlock("div", mergeProps({
            key: 3,
            "class": _ctx.cx('ampmPicker')
          }, _ctx.ptm('ampmPicker')), [createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcIncrementButton'),
            "aria-label": _ctx.$primevue.config.locale.am,
            disabled: _ctx.disabled,
            unstyled: _ctx.unstyled,
            onClick: _cache[51] || (_cache[51] = function ($event) {
              return $options.toggleAMPM($event);
            }),
            onKeydown: $options.onContainerButtonKeydown
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcIncrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "incrementicon", {
                "class": normalizeClass(_ctx.cx('incrementIcon'))
              }, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.incrementIcon ? 'span' : 'ChevronUpIcon'), mergeProps({
                  "class": [_ctx.cx('incrementIcon'), slotProps["class"]]
                }, _ctx.ptm('pcIncrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "unstyled", "onKeydown", "pt"]), createElementVNode("span", mergeProps(_ctx.ptm('ampm'), {
            "data-pc-group-section": "timepickerlabel"
          }), toDisplayString($data.pm ? _ctx.$primevue.config.locale.pm : _ctx.$primevue.config.locale.am), 17), createVNode(_component_Button, mergeProps({
            "class": _ctx.cx('pcDecrementButton'),
            "aria-label": _ctx.$primevue.config.locale.pm,
            disabled: _ctx.disabled,
            onClick: _cache[52] || (_cache[52] = function ($event) {
              return $options.toggleAMPM($event);
            }),
            onKeydown: $options.onContainerButtonKeydown
          }, _ctx.timepickerButtonProps, {
            pt: _ctx.ptm('pcDecrementButton'),
            "data-pc-group-section": "timepickerbutton"
          }), {
            icon: withCtx(function (slotProps) {
              return [renderSlot(_ctx.$slots, "decrementicon", {
                "class": normalizeClass(_ctx.cx('decrementIcon'))
              }, function () {
                return [(openBlock(), createBlock(resolveDynamicComponent(_ctx.decrementIcon ? 'span' : 'ChevronDownIcon'), mergeProps({
                  "class": [_ctx.cx('decrementIcon'), slotProps["class"]]
                }, _ctx.ptm('pcDecrementButton')['icon'], {
                  "data-pc-group-section": "timepickerlabel"
                }), null, 16, ["class"]))];
              })];
            }),
            _: 3
          }, 16, ["class", "aria-label", "disabled", "onKeydown", "pt"])], 16)) : createCommentVNode("", true)], 16)) : createCommentVNode("", true), _ctx.showButtonBar ? (openBlock(), createElementBlock("div", mergeProps({
            key: 2,
            "class": _ctx.cx('buttonbar')
          }, _ctx.ptm('buttonbar')), [createVNode(_component_Button, mergeProps({
            label: $options.todayLabel,
            onClick: _cache[53] || (_cache[53] = function ($event) {
              return $options.onTodayButtonClick($event);
            }),
            "class": _ctx.cx('pcTodayButton'),
            unstyled: _ctx.unstyled,
            onKeydown: $options.onContainerButtonKeydown
          }, _ctx.todayButtonProps, {
            pt: _ctx.ptm('pcTodayButton'),
            "data-pc-group-section": "button"
          }), null, 16, ["label", "class", "unstyled", "onKeydown", "pt"]), createVNode(_component_Button, mergeProps({
            label: $options.clearLabel,
            onClick: _cache[54] || (_cache[54] = function ($event) {
              return $options.onClearButtonClick($event);
            }),
            "class": _ctx.cx('pcClearButton'),
            unstyled: _ctx.unstyled,
            onKeydown: $options.onContainerButtonKeydown
          }, _ctx.clearButtonProps, {
            pt: _ctx.ptm('pcClearButton'),
            "data-pc-group-section": "button"
          }), null, 16, ["label", "class", "unstyled", "onKeydown", "pt"])], 16)) : createCommentVNode("", true), renderSlot(_ctx.$slots, "footer")], 16, _hoisted_3)) : createCommentVNode("", true)];
        }),
        _: 3
      }, 16, ["onAfterEnter", "onAfterLeave", "onLeave"])];
    }),
    _: 3
  }, 8, ["appendTo", "disabled"])], 16, _hoisted_1);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map