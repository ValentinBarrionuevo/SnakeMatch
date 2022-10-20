import { _decorator, Component, Node, input, Input, director, EventTouch, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {

  private _touchStartPos: import("cc").math.Vec2;


  onLoad() {
    input.on(Input.EventType.TOUCH_START, this.touchStart, this);
    input.on(Input.EventType.TOUCH_END, this.touchEnd, this);

    const play = find("Canvas/background/play");
    console.log(play);
  }

  public touchStart(e: EventTouch): void {
    this._touchStartPos = e.getLocation();
  }

  public touchEnd(e: EventTouch): void {
    if (!this._touchStartPos) {
      return;
    }

    const end = e.getLocation();
    this._touchStartPos = null;

    if (end.x > 0) {



    }

  }

  startGame() {
    director.loadScene("GameScene");
  }
}
