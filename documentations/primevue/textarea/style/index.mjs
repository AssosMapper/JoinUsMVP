import BaseStyle from '@primevue/core/base/style';

var theme = function theme(_ref) {
  var dt = _ref.dt;
  return "\n.p-textarea {\n    font-family: inherit;\n    font-feature-settings: inherit;\n    font-size: 1rem;\n    color: ".concat(dt('textarea.color'), ";\n    background: ").concat(dt('textarea.background'), ";\n    padding: ").concat(dt('textarea.padding.y'), " ").concat(dt('textarea.padding.x'), ";\n    border: 1px solid ").concat(dt('textarea.border.color'), ";\n    transition: background ").concat(dt('textarea.transition.duration'), ", color ").concat(dt('textarea.transition.duration'), ", border-color ").concat(dt('textarea.transition.duration'), ", outline-color ").concat(dt('textarea.transition.duration'), ", box-shadow ").concat(dt('textarea.transition.duration'), ";\n    appearance: none;\n    border-radius: ").concat(dt('textarea.border.radius'), ";\n    outline-color: transparent;\n    box-shadow: ").concat(dt('textarea.shadow'), ";\n}\n\n.p-textarea:enabled:hover {\n    border-color: ").concat(dt('textarea.hover.border.color'), ";\n}\n\n.p-textarea:enabled:focus {\n    border-color: ").concat(dt('textarea.focus.border.color'), ";\n    box-shadow: ").concat(dt('textarea.focus.ring.shadow'), ";\n    outline: ").concat(dt('textarea.focus.ring.width'), " ").concat(dt('textarea.focus.ring.style'), " ").concat(dt('textarea.focus.ring.color'), ";\n    outline-offset: ").concat(dt('textarea.focus.ring.offset'), ";\n}\n\n.p-textarea.p-invalid {\n    border-color: ").concat(dt('textarea.invalid.border.color'), ";\n}\n\n.p-textarea.p-variant-filled {\n    background: ").concat(dt('textarea.filled.background'), ";\n}\n\n.p-textarea.p-variant-filled:enabled:focus {\n    background: ").concat(dt('textarea.filled.focus.background'), ";\n}\n\n.p-textarea:disabled {\n    opacity: 1;\n    background: ").concat(dt('textarea.disabled.background'), ";\n    color: ").concat(dt('textarea.disabled.color'), ";\n}\n\n.p-textarea::placeholder {\n    color: ").concat(dt('textarea.placeholder.color'), ";\n}\n\n.p-textarea-fluid {\n    width: 100%;\n}\n\n.p-textarea-resizable {\n    overflow: hidden;\n    resize: none;\n}\n");
};
var classes = {
  root: function root(_ref2) {
    var instance = _ref2.instance,
      props = _ref2.props;
    return ['p-textarea p-component', {
      'p-filled': instance.filled,
      'p-textarea-resizable ': props.autoResize,
      'p-invalid': props.invalid,
      'p-variant-filled': props.variant ? props.variant === 'filled' : instance.$primevue.config.inputStyle === 'filled' || instance.$primevue.config.inputVariant === 'filled',
      'p-textarea-fluid': instance.hasFluid
    }];
  }
};
var TextareaStyle = BaseStyle.extend({
  name: 'textarea',
  theme: theme,
  classes: classes
});

export { TextareaStyle as default };
//# sourceMappingURL=index.mjs.map
