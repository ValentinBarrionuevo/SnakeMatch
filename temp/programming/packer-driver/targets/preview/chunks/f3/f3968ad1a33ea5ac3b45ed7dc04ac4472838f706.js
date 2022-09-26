System.register(["cc"], function (_export, _context) {
  "use strict";

  var _cclegacy, __checkObsolete__, __checkObsoleteInNamespace__, _decorator, Component, RigidBody2D, Vec2, KeyCode, input, Input, _dec, _class, _crd, ccclass, SnakeController;

  return {
    setters: [function (_cc) {
      _cclegacy = _cc.cclegacy;
      __checkObsolete__ = _cc.__checkObsolete__;
      __checkObsoleteInNamespace__ = _cc.__checkObsoleteInNamespace__;
      _decorator = _cc._decorator;
      Component = _cc.Component;
      RigidBody2D = _cc.RigidBody2D;
      Vec2 = _cc.Vec2;
      KeyCode = _cc.KeyCode;
      input = _cc.input;
      Input = _cc.Input;
    }],
    execute: function () {
      _crd = true;

      _cclegacy._RF.push({}, "b24c5ZByjRJF6MNgP3icyvD", "SnakeController", undefined);

      __checkObsolete__(['_decorator', 'Component', 'RigidBody2D', 'Vec2', 'KeyCode', 'input', 'EventKeyboard', 'Input']);

      ({
        ccclass
      } = _decorator);

      _export("SnakeController", SnakeController = (_dec = ccclass("SnakeController"), _dec(_class = class SnakeController extends Component {
        constructor() {
          super(...arguments);
          this.character = null;
          this.firstMove = true;
          this.velocity = 5;
          this.snakeInside = [];
        }

        onLoad() {
          this.character = this.node.getComponent(RigidBody2D);
          this.character.linearVelocity = new Vec2(0, 0);
          input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }

        onDestroy() {
          input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        }

        onKeyDown(event) {
          if (this.character.linearVelocity.x != 0 || this.firstMove) {
            switch (event.keyCode) {
              case KeyCode.KEY_W:
                this.character.linearVelocity = new Vec2(0, this.velocity);
                this.tileMove();
                break;

              case KeyCode.KEY_S:
                this.character.linearVelocity = new Vec2(0, -this.velocity);
                this.tileMove();
                break;
            }
          } else if (this.character.linearVelocity.y != 0 || this.firstMove) {
            switch (event.keyCode) {
              case KeyCode.KEY_A:
                this.tileMove();
                this.character.linearVelocity = new Vec2(-this.velocity, 0);
                break;

              case KeyCode.KEY_D:
                this.character.linearVelocity = new Vec2(this.velocity, 0);
                this.tileMove();
                break;
            }
          }
        }

        tileMove() {
          this.firstMove = false;
          this.node.setPosition(Math.round(this.node.position.x / 30) * 30, Math.round(this.node.position.y / 30) * 30);
        }

        eatBall(ball) {}

      }) || _class));

      _cclegacy._RF.pop();

      _crd = false;
    }
  };
});
//# sourceMappingURL=f3968ad1a33ea5ac3b45ed7dc04ac4472838f706.js.map