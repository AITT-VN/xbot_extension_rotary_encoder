Blockly.Blocks['xbot_rotary_encoder_get_value'] = {
  init: function () {
    this.jsonInit({
      colour: "#ae00ae",
      tooltip: "",
      message0: "%2 đọc giá trị rotary encoder cổng %1",
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          options: [
            ["1", "0"],
            ["2", "1"],
            ["3", "2"],
            ["4", "3"],
            ["5", "4"],
            ["6", "5"],
          ],
        },
        {
          "type": "field_image",
          "src": "https://i.ibb.co/gTyT9BS/image-removebg-preview-1.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Number",
      helpUrl: "",
    });
  },
};

Blockly.Blocks['xbot_rotary_encoder_set_range'] = {
  init: function () {
    this.jsonInit({
      colour: "#ae00ae",
      tooltip: "",
      message0: "%5 đặt khoảng giá trị cho rotary encoder cổng %1 min %2 max %3 %4",
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          options: [
            ["1", "0"],
            ["2", "1"],
            ["3", "2"],
            ["4", "3"],
            ["5", "4"],
            ["6", "5"],
          ],
        },
        {
          "type": "input_value",
          "name": "min"
        },
        {
          "type": "input_value",
          "name": "max"
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "field_image",
          "src": "https://i.ibb.co/gTyT9BS/image-removebg-preview-1.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Blocks['xbot_rotary_encoder_mode'] = {
  init: function () {
    this.jsonInit({
      colour: "#ae00ae",
      tooltip: "",
      message0: "%3 đặt chế độ xoay cho rotary encoder cổng %1 %2",
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          options: [
            ["1", "0"],
            ["2", "1"],
            ["3", "2"],
            ["4", "3"],
            ["5", "4"],
            ["6", "5"],
          ],
        },
        {
          type: "field_dropdown",
          name: "mode",
          options: [
            ["không giới hạn"," RotaryIRQ.RANGE_UNBOUNDED"], 
            ["reset khi quay tới max","RotaryIRQ.RANGE_WRAP"], 
            ["dừng tăng khi quay tới max","RotaryIRQ.RANGE_BOUNDED"]
          ],
        },
        {
          "type": "field_image",
          "src": "https://i.ibb.co/gTyT9BS/image-removebg-preview-1.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Blocks['xbot_rotary_encoder_set_value'] = {
  init: function () {
    this.jsonInit({
      colour: "#ae00ae",
      tooltip: "",
      message0: "%4 đặt giá trị hiện tại cho rotary encoder cổng %1 %2 %3",
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
          ],
        },
        {
          "type": "input_value",
          "name": "value"
        },
        {
          "type": "input_dummy",
        },
        {
          "type": "field_image",
          "src": "https://i.ibb.co/gTyT9BS/image-removebg-preview-1.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      previousStatement: null,
      nextStatement: null,
      helpUrl: "",
    });
  },
};

Blockly.Blocks['xbot_rotary_encoder_direction'] = {
  init: function () {
    this.jsonInit({
      colour: "#ae00ae",
      tooltip: "",
      message0: "%3 rotary encoder cổng %1 được %2",
      args0: [
        {
          type: "field_dropdown",
          name: "port",
          options: [
            ["1", "1"],
            ["2", "2"],
            ["3", "3"],
            ["4", "4"],
            ["5", "5"],
            ["6", "6"],
          ],
        },
        {
          type: "field_dropdown",
          name: "LR",
          options: [
            ["xoay qua trái"," < 0"], 
            ["xoay qua phải"," > 0"]
          ],
        },
        {
          "type": "field_image",
          "src": "https://i.ibb.co/gTyT9BS/image-removebg-preview-1.png",
          "width": 20,
          "height": 20,
          "alt": "*",
          "flipRtl": false
        }
      ],
      output: "Boolean",
      helpUrl: "",
    });
  },
};

// ============================ PYTHON GENERATE==========================
Blockly.Python['xbot_rotary_encoder_get_value'] = function(block) {
  Blockly.Python.definitions_['import_rotary'] = 'from rotary import rotary_encoder';
  var port = block.getFieldValue("port");
  // TODO: Assemble Python into code variable.
  var code = "rotary_encoder.value(" + port + ")";
  return [code, Blockly.Python.ORDER_NONE];
};

Blockly.Python['xbot_rotary_encoder_set_range'] = function(block) {
  Blockly.Python.definitions_['import_rotary'] = 'from rotary import rotary_encoder';
  var value_min = Blockly.Python.valueToCode(block, 'min', Blockly.Python.ORDER_ATOMIC);
  var value_max = Blockly.Python.valueToCode(block, 'max', Blockly.Python.ORDER_ATOMIC);
  var port = block.getFieldValue("port");
  // TODO: Assemble Python into code variable.
  var code = 'rotary_encoder.set(' + port + ', min_val=' + value_min + ', max_val=' +  value_max + ', range_mode=RotaryIRQ.RANGE_WRAP)\n';
  return code;
};

Blockly.Python['xbot_rotary_encoder_mode'] = function(block) {
  Blockly.Python.definitions_['import_rotary'] = 'from rotary import rotary_encoder';
  var dropdown_mode = block.getFieldValue('mode');
  var port = block.getFieldValue("port");
  // TODO: Assemble Python into code variable.
  var code = 'rotary_encoder.set(' + port + ', range_mode=' + dropdown_mode + ')\n';
  return code;
};

Blockly.Python['xbot_rotary_encoder_set_value'] = function(block) {
  Blockly.Python.definitions_['import_rotary'] = 'from rotary import rotary_encoder';
  var value_value = Blockly.Python.valueToCode(block, 'value', Blockly.Python.ORDER_ATOMIC);
  var port = block.getFieldValue("port");
  // TODO: Assemble Python into code variable.
  var code = 'rotary_encoder.set(' + port + ', value=' + value_value + ')\n';
  return code;
};

Blockly.Python['xbot_rotary_encoder_direction'] = function(block) {
  Blockly.Python.definitions_['import_rotary'] = 'from rotary import rotary_encoder';
  var dropdown_lr = block.getFieldValue('LR');
  var port = block.getFieldValue("port");
  // TODO: Assemble Python into code variable.
  var code = 'rotary_encoder.get_steps(' + port + ')' + dropdown_lr ;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.Python.ORDER_NONE];
};
