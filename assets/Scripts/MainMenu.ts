import { _decorator, Component, Node, input, Input, director } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  onLoad() {
    input.on(Input.EventType.TOUCH_START, this.startGame, this);
  }

  startGame() {
    director.loadScene("GameScene");
  }
}
