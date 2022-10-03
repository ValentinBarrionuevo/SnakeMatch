import { _decorator, Component, Node, Prefab, instantiate, find } from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("BallCommands")
export class BallCommands extends Component {
  @property(Prefab)
  bodyPrefab: Prefab;
  start() {}

  onDestroy() {
    var prefab = instantiate(this.bodyPrefab);
    find("Canvas").addChild(prefab);
    find("Canvas/Snake").getComponent(SnakeController).snakeInside.push(prefab);
  }
  update(deltaTime: number) {}
}
