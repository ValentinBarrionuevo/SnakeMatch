import {
  _decorator,
  Component,
  find,
  instantiate,
  Prefab,
  math,
  Vec2,
  input,
  Input,
  director,
} from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Prefab)
  private balls: Array<Prefab> = new Array<Prefab>(4);

  private spawnedArray: Array<number> = [];

  public destroyed: boolean = false;

  onLoad() {
    find("Canvas/Snake/Head").getComponent(SnakeController)
    input.on(Input.EventType.TOUCH_START, this.restart, this);

  }

  private restart(): void {
    if (this.destroyed) {
      director.loadScene("GameScene");
    }
  }

  start() {
    this.spawnBall();
  }

  // TODO Checkear si se fue, si esta sobre si misma
  public checkGameState(): void {
    let snakePos = new Vec2(
      Math.round(find("Canvas/Snake/Head").getPosition().x),
      Math.round(find("Canvas/Snake/Head").getPosition().y)
    );
    let hijo = find("Canvas/Balls").children.filter((child) => {
      return (
        Math.round(child.position.x) == snakePos.x &&
        Math.round(child.position.y) == snakePos.y
      );
    });
    if (hijo.length > 0) {
      console.log(hijo[0]);
      let index = find("Canvas/Balls").children.indexOf(hijo[0]);
      find("Canvas/Snake/Head")
        .getComponent(SnakeController)
        .eatBall(this.spawnedArray[index]);
      this.spawnedArray.splice(index, 1);
      hijo[0].destroy();
      this.spawnBall();
    }
  }

  private spawnBall(): void {
    while (this.spawnedArray.length < 3) {
      var randomPosX: number =
        Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number =
        Math.round(math.randomRangeInt(-300, 301) / 30) * 30;

      const newParent = find("Canvas/Balls");
      let prefab = null;

      let rndmIndex = math.randomRangeInt(0, 4);
      prefab = instantiate(this.balls[rndmIndex]);
      this.spawnedArray.push(rndmIndex);

      newParent.addChild(prefab);
      prefab.setPosition(randomPosX, randomPosY);
    }
  }
}
