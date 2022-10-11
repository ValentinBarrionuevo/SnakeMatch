import {
  _decorator,
  Component,
  find,
  instantiate,
  Prefab,
  math,
  Vec2,
} from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Prefab)
  redPrefab: Prefab;

  @property(Prefab)
  yellowPrefab: Prefab;

  @property(Prefab)
  bluePrefab: Prefab;

  @property(Prefab)
  pinkPrefab: Prefab;

  @property(Prefab)
  bodyPrefab: Prefab;

  private ballsArray: Array<Prefab> = [];

  start() {
    this.ballsArray = new Array<Prefab>(
      this.redPrefab,
      this.yellowPrefab,
      this.bluePrefab,
      this.pinkPrefab
    );
    this.spawnBall();
    console.log(this.ballsArray);
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
      find("Canvas/Snake/Head").getComponent(SnakeController).eatBall(hijo[0].name);
      hijo[0].destroy();
      this.scheduleOnce(() => {
        if (find("Canvas/Balls").children.length == 0) {
          this.spawnBall();
        }
      }, 0.01);
    }
  }

  private spawnBall(): void {
    for (var i = 0; i < 2; i++) {
      var randomPosX: number =
        Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number =
        Math.round(math.randomRangeInt(-300, 301) / 30) * 30;

      const newParent = find("Canvas/Balls");
      let prefab = null;

      let rndmIndex = math.randomRangeInt(0, 4);
      prefab = instantiate(this.ballsArray[rndmIndex]);

      newParent.addChild(prefab);
      prefab.setPosition(randomPosX, randomPosY);
    }
  }
}
