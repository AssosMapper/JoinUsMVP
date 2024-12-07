import { UniqueComponentId } from '@primevue/core/utils';
import MinusIcon from '@primevue/icons/minus';
import PlusIcon from '@primevue/icons/plus';
import Ripple from 'primevue/ripple';
import BaseComponent from '@primevue/core/basecomponent';
import FieldsetStyle from 'primevue/fieldset/style';
import { resolveDirective, openBlock, createElementBlock, mergeProps, createElementVNode, renderSlot, toDisplayString, createCommentVNode, withDirectives, normalizeClass, createBlock, resolveDynamicComponent, createVNode, Transition, withCtx, vShow } from 'vue';

var script$1 = {
  name: 'BaseFieldset',
  "extends": BaseComponent,
  props: {
    legend: String,
    toggleable: Boolean,
    collapsed: Boolean,
    toggleButtonProps: {
      type: null,
      "default": null
    }
  },
  style: FieldsetStyle,
  provide: function provide() {
    return {
      $pcFieldset: this,
      $parentInstance: this
    };
  }
};

var script = {
  name: 'Fieldset',
  "extends": script$1,
  inheritAttrs: false,
  emits: ['update:collapsed', 'toggle'],
  data: function data() {
    return {
      id: this.$attrs.id,
      d_collapsed: this.collapsed
    };
  },
  watch: {
    '$attrs.id': function $attrsId(newValue) {
      this.id = newValue || UniqueComponentId();
    },
    collapsed: function collapsed(newValue) {
      this.d_collapsed = newValue;
    }
  },
  mounted: function mounted() {
    this.id = this.id || UniqueComponentId();
  },
  methods: {
    toggle: function toggle(event) {
      this.d_collapsed = !this.d_collapsed;
      this.$emit('update:collapsed', this.d_collapsed);
      this.$emit('toggle', {
        originalEvent: event,
        value: this.d_collapsed
      });
    },
    onKeyDown: function onKeyDown(event) {
      if (event.code === 'Enter' || event.code === 'NumpadEnter' || event.code === 'Space') {
        this.toggle(event);
        event.preventDefault();
      }
    }
  },
  computed: {
    buttonAriaLabel: function buttonAriaLabel() {
      return this.toggleButtonProps && this.toggleButtonProps.ariaLabel ? this.toggleButtonProps.ariaLabel : this.legend;
    }
  },
  directives: {
    ripple: Ripple
  },
  components: {
    PlusIcon: PlusIcon,
    MinusIcon: MinusIcon
  }
};

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var _hoisted_1 = ["id"];
var _hoisted_2 = ["id", "aria-controls", "aria-expanded", "aria-label"];
var _hoisted_3 = ["id", "aria-labelledby"];
function render(_ctx, _cache, $props, $setup, $data, $options) {
  var _directive_ripple = resolveDirective("ripple");
  return openBlock(), createElementBlock("fieldset", mergeProps({
    "class": _ctx.cx('root')
  }, _ctx.ptmi('root')), [createElementVNode("legend", mergeProps({
    "class": _ctx.cx('legend')
  }, _ctx.ptm('legend')), [renderSlot(_ctx.$slots, "legend", {
    toggleCallback: $options.toggle
  }, function () {
    return [!_ctx.toggleable ? (openBlock(), createElementBlock("span", mergeProps({
      key: 0,
      id: $data.id + '_header',
      "class": _ctx.cx('legendLabel')
    }, _ctx.ptm('legendLabel')), toDisplayString(_ctx.legend), 17, _hoisted_1)) : createCommentVNode("", true), _ctx.toggleable ? withDirectives((openBlock(), createElementBlock("button", mergeProps({
      key: 1,
      id: $data.id + '_header',
      type: "button",
      "aria-controls": $data.id + '_content',
      "aria-expanded": !$data.d_collapsed,
      "aria-label": $options.buttonAriaLabel,
      "class": _ctx.cx('toggleButton'),
      onClick: _cache[0] || (_cache[0] = function () {
        return $options.toggle && $options.toggle.apply($options, arguments);
      }),
      onKeydown: _cache[1] || (_cache[1] = function () {
        return $options.onKeyDown && $options.onKeyDown.apply($options, arguments);
      })
    }, _objectSpread(_objectSpread({}, _ctx.toggleButtonProps), _ctx.ptm('toggleButton'))), [renderSlot(_ctx.$slots, _ctx.$slots.toggleicon ? 'toggleicon' : 'togglericon', {
      collapsed: $data.d_collapsed,
      "class": normalizeClass(_ctx.cx('toggleIcon'))
    }, function () {
      return [(openBlock(), createBlock(resolveDynamicComponent($data.d_collapsed ? 'PlusIcon' : 'MinusIcon'), mergeProps({
        "class": _ctx.cx('toggleIcon')
      }, _ctx.ptm('toggleIcon')), null, 16, ["class"]))];
    }), createElementVNode("span", mergeProps({
      "class": _ctx.cx('legendLabel')
    }, _ctx.ptm('legendLabel')), toDisplayString(_ctx.legend), 17)], 16, _hoisted_2)), [[_directive_ripple]]) : createCommentVNode("", true)];
  })], 16), createVNode(Transition, mergeProps({
    name: "p-toggleable-content"
  }, _ctx.ptm('transition')), {
    "default": withCtx(function () {
      return [withDirectives(createElementVNode("div", mergeProps({
        id: $data.id + '_content',
        "class": _ctx.cx('contentContainer'),
        role: "region",
        "aria-labelledby": $data.id + '_header'
      }, _ctx.ptm('contentContainer')), [createElementVNode("div", mergeProps({
        "class": _ctx.cx('content')
      }, _ctx.ptm('content')), [renderSlot(_ctx.$slots, "default")], 16)], 16, _hoisted_3), [[vShow, !$data.d_collapsed]])];
    }),
    _: 3
  }, 16)], 16);
}

script.render = render;

export { script as default };
//# sourceMappingURL=index.mjs.map