import {
  _decorator,
  Component,
  Node,
  Input,
  director,
  EventTouch,
  find,
  Sprite,
  SpriteFrame,
  AudioSource,
  AudioClip,
} from "cc";
import { GlobalVariables } from "./GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass("MainMenu")
export class MainMenu extends Component {
  @property(SpriteFrame)
  private muteArray: Array<SpriteFrame> = new Array<SpriteFrame>(2);

  @property(AudioClip)
  private introMelody: AudioClip;

  private audioSource: AudioSource = null!;

  private play: Node;
  private mute: Node;
  private shop: Node;
  private ads: Node;
  private tutorial: Node;
  private credits: Node;

  onLoad() {
    this.play = find("Canvas/background/Play");
    this.mute = find("Canvas/background/Mute");
    this.shop = find("Canvas/background/Shop");
    this.ads = find("Canvas/background/Ads");
    this.tutorial = find("Canvas/background/Tutorial")
    this.credits = find("Canvas/background/Credits")

    this.play.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.mute.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.shop.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.ads.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.tutorial.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.credits.on(Input.EventType.TOUCH_END, this.touchStart, this);


    const audioSource = this.getComponent(AudioSource);
    this.audioSource = audioSource;
  }

  start() {
    if (!GlobalVariables.saveData.firstStart) {
      this.audioSource.playOneShot(this.introMelody);
      GlobalVariables.saveData.firstStart = true;
    }
  }

  public touchStart(e: EventTouch): void {

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
        director.loadScene("Store");
        break;
      case "Ads":
        find("Canvas/background/adSpace").active = false;
        GlobalVariables.saveData.disabledAds = true;
        break;
      case "Tutorial":
        director.loadScene("Tutorial");
        break;
      case "Credits":
        director.loadScene("Credits");
        break;
    }
  }

  private muteAll() {
    this.audioSource.enabled = !this.audioSource.enabled;
  }
}
