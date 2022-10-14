import { _decorator, Component, director, Button } from "cc";
const { ccclass } = _decorator;

@ccclass("ButtonMethods")
export class ButtonMethods extends Component {


  public restart() {
    director.loadScene("GameScene");
  }
}


