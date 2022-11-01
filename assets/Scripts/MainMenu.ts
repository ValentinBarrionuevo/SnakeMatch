import { _decorator, Component, Node, input, Input, director, EventTouch, find, Sprite, SpriteFrame, Vec2, AudioSource, assert } from "cc";
import { GlobalVariables } from "./GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {

  @property(SpriteFrame)
  private muteArray: Array<SpriteFrame> = new Array<SpriteFrame>(2);

  private audioSource: AudioSource = null!;

  private play: Node;
  private mute: Node;
  private shop: Node;
  private ads: Node;

  onLoad() {

    this.play = find("Canvas/background/Play")
    this.mute = find("Canvas/background/Mute")
    this.shop = find("Canvas/background/Shop")
    this.ads = find("Canvas/background/Ads")

    this.play.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.mute.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.shop.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.ads.on(Input.EventType.TOUCH_END, this.touchStart, this);

    const audioSource = this.getComponent(AudioSource)!;
    assert(audioSource);
    this.audioSource = audioSource;
  }


  public touchStart(e: EventTouch): void {
    console.log(e.target.name)

    switch (e.target.name) {
      case "Play":
        director.loadScene("GameScene");
        break;
      case "Mute":
        if (e.target.getComponent(Sprite).spriteFrame == this.muteArray[0]) {
          e.target.getComponent(Sprite).spriteFrame = this.muteArray[1];
        } else {
          e.target.getComponent(Sprite).spriteFrame = this.muteArray[0];
        }
        this.muteAll();
        break;
      case "Shop":
        director.loadScene("Shop");
        break;
      case "Ads":
        find("Canvas/background/adSpace").active = false;
        GlobalVariables.saveData.disabledAds = true;
        break;
    }
  }

  private muteAll() {
    this.audioSource.enabled = !this.audioSource.enabled;
  }

}