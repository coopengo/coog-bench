var B = require('backbone');
var formFieldTpl = require('./template/form-field.tpl');
require('./template/form-field.css');
//
exports.setTemplates = function () {
  B.Form.Field.template = formFieldTpl;
  B.Form.Field.errorClassName = 'bench-field-error';
};
