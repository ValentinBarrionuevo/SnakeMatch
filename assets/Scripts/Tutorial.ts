import { _decorator, Component, Node, Input, director, EventTouch, find, Sprite, SpriteFrame } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Tutorial")
export class Tutorial extends Component {

  @property(SpriteFrame)
  private sprites: Array<SpriteFrame> = new Array<SpriteFrame>(7);

  private back: Node;
  private forward: Node;
  private exit: Node;
  private bg: Node;
  private selected: number = 0;

  onLoad() {

    this.bg = find("Canvas/background");

    this.back = find("Canvas/background/back");
    this.forward = find("Canvas/background/forward");
    this.exit = find("Canvas/background/exit");



    this.back.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.forward.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.exit.on(Input.EventType.TOUCH_END, this.touchStart, this);

    this.back.active = false;
  }


  public touchStart(e: EventTouch): void {

    switch (e.target.name) {
      case "back":
        if (this.selected > 0) {
          this.selected--;
          this.bg.getComponent(Sprite).spriteFrame = this.sprites[this.selected];
          if (!this.forward.active) {
            this.forward.active = true;
          }
        }
        if (this.selected == 0) {
          this.back.active = false;
        }

        break
      case "forward":
        if (this.selected < 6) {
          this.selected++;
          this.bg.getComponent(Sprite).spriteFrame = this.sprites[this.selected];
          if (!this.back.active) {
            this.back.active = true;
          }
        }
        if (this.selected == 6) {
          this.forward.active = false;
        }

        break;
      case "exit":
        director.loadScene("MainMenu");
        break;
    }
  }

}