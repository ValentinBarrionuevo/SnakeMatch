import { _decorator, Component, Node, Input, director, EventTouch, find } from "cc";
const { ccclass } = _decorator;

@ccclass("Credits")
export class Credits extends Component {

  private back: Node;


  onLoad() {

    this.back = find("Canvas/background/back");
    this.back.on(Input.EventType.TOUCH_END, this.touchStart, this);

  }


  public touchStart(e: EventTouch): void {

    switch (e.target.name) {
      case "back":
        director.loadScene("MainMenu");
        break;

    }
  }


}