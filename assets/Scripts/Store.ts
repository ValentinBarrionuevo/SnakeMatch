import { _decorator, Component, Node, input, Input, director, EventTouch, find, Sprite, SpriteFrame, Vec2, AudioSource, assert, Label } from "cc";
import { GlobalVariables } from "./GlobalVariables";
const { ccclass, property } = _decorator;

@ccclass("Store")
export class Store extends Component {

  private back: Node;
  private item1: Node;
  private item2: Node;
  private item3: Node;
  private item1B: Node;
  private item2B: Node;
  private item3B: Node;
  private checks: Node;

  onLoad() {
    this.back = find("Canvas/background/back");
    this.item1 = find("Canvas/background/Items/Item1");
    this.item2 = find("Canvas/background/Items/Item2");
    this.item3 = find("Canvas/background/Items/Item3");
    this.item1B = find("Canvas/background/Items/item1B");
    this.item2B = find("Canvas/background/Items/item2B");
    this.item3B = find("Canvas/background/Items/item3B");
    this.checks = find("Canvas/background/Checks");

    if (GlobalVariables.saveData.disabledAds == true) {
      find("Canvas/background/adSpace").active = false
    }

    if (GlobalVariables.saveData.skinsBuyed[0] == true) {
      this.item1.active = false;
    }
    if (GlobalVariables.saveData.skinsBuyed[1] == true) {
      this.item2.active = false;
    }
    if (GlobalVariables.saveData.skinsBuyed[2] == true) {
      this.item3.active = false;
    }

    this.coinsCheck();
    this.changeCheck(GlobalVariables.saveData.skin);

    this.back.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.item1.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.item2.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.item3.on(Input.EventType.TOUCH_END, this.touchStart, this);

    this.item1B.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.item2B.on(Input.EventType.TOUCH_END, this.touchStart, this);
    this.item3B.on(Input.EventType.TOUCH_END, this.touchStart, this);

  }


  public touchStart(e: EventTouch): void {
    console.log(e.target.name)

    switch (e.target.name) {
      case "back":
        director.loadScene("MainMenu");
        break;
      case "Item1":
      case "item1B":
        console.log(GlobalVariables.saveData.skin)
        if (GlobalVariables.saveData.skin != 0) {
          GlobalVariables.saveData.skin = 0
          this.changeCheck(0);
        }
        break;
      case "Item2":
      case "item2B":
        if (GlobalVariables.saveData.skinsBuyed[1] == false && GlobalVariables.saveData.coins >= 20) {
          GlobalVariables.saveData.skinsBuyed[1] = true
          GlobalVariables.saveData.coins -= 20
          this.item2.active = false
          this.changeCheck(1);
        } else
          if (GlobalVariables.saveData.skin != 1 && GlobalVariables.saveData.skinsBuyed[1] == true) {
            GlobalVariables.saveData.skin = 1
            this.changeCheck(1);
          }
        break;
      case "Item3":
      case "item3B":
        if (GlobalVariables.saveData.skinsBuyed[2] == false && GlobalVariables.saveData.coins >= 20) {
          GlobalVariables.saveData.skinsBuyed[2] = true
          GlobalVariables.saveData.coins -= 20
          console.log(GlobalVariables.saveData.coins)
          this.item3.active = false
          this.coinsCheck();
        } else
          if (GlobalVariables.saveData.skin != 2 && GlobalVariables.saveData.skinsBuyed[2] == true) {
            GlobalVariables.saveData.skin = 2
            console.log("asd");

            this.changeCheck(2);

          }
        break;
    }
  }

  private coinsCheck(): void {
    find("Canvas/background/coinsCount/Points").getComponent(Label).string = GlobalVariables.saveData.coins.toString();
  }

  private changeCheck(check: number): void {
    switch (check) {
      case 0:
        this.checks.children[0].active = true
        this.checks.children[1].active = false
        this.checks.children[2].active = false
        break;
      case 1:
        this.checks.children[0].active = false
        this.checks.children[1].active = true
        this.checks.children[2].active = false
        break;
      case 2:
        this.checks.children[0].active = false
        this.checks.children[1].active = false
        this.checks.children[2].active = true
    }
  }

}