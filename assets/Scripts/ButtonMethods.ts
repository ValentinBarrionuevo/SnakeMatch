import { _decorator, Component, director } from 'cc';
const { ccclass } = _decorator;

@ccclass("ButtonMethods")
export class ButtonMethods extends Component {


    restart() {

        director.loadScene("GameScene");

    }

}