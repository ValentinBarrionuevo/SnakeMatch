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
  Vec3,
  Label,
  Node,
} from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(Prefab)
  private balls: Array<Prefab> = new Array<Prefab>(4);

  @property(Prefab)
  private void: Prefab;

  @property(Prefab)
  private coin: Prefab;

  private spawnedArray: Array<number> = [];

  public destroyed: boolean = false;

  public points: number = 0;
  public multiplier: number = 1;
  private coins: number = 0;


  onLoad() {
    find("Canvas/Snake/Head").getComponent(SnakeController)
    find("Canvas/UI/button").active = false;
    input.on(Input.EventType.TOUCH_START, this.restart, this);
  }

  private restart(): void {
    if (this.destroyed) {
      director.loadScene("GameScene");
    }
  }

  start() {
    this.spawnBall();
    this.spawnCoin();
    this.spawnVoid();
  }

  // TODO Checkear si esta sobre si misma
  public checkGameState(): void {

    let snakePos = new Vec2(
      Math.round(find("Canvas/Snake/Head").getPosition().x),
      Math.round(find("Canvas/Snake/Head").getPosition().y)
    );

    this.checkVoids(snakePos);
    this.checkCoins(snakePos);
    this.checkBalls(snakePos);

  }


  private checkVoids(snakePos: Vec2): void {
    let voids = find("Canvas/Voids").children.filter((child) => {
      return (
        Math.round(child.position.x) == snakePos.x &&
        Math.round(child.position.y) == snakePos.y
      );
    });

    if (voids.length > 0) {
      find("Canvas/Snake").destroy();
    }
  }

  private checkCoins(snakePos: Vec2): void {
    let coin = find("Canvas/Coins").children.filter((child) => {
      return (
        Math.round(child.position.x) == snakePos.x &&
        Math.round(child.position.y) == snakePos.y
      );
    });

    if (coin.length > 0) {
      coin[0].destroy();
      this.points += 500 * this.multiplier;
      this.coins += 1;
      find("Canvas/UI/Coins").getComponent(Label).string = "x" + (this.coins).toString();
      find("Canvas/UI/Points").getComponent(Label).string = (this.points).toString();
    }
  }

  private checkBalls(snakePos: Vec2): void {

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
      this.points += 100 * this.multiplier;

      find("Canvas/UI/Points").getComponent(Label).string = (this.points).toString();

      this.spawnBall();
      this.spawnCoin();

    }
  }

  private spawnVoid(): void {

    while (find("Canvas/Voids").children.length < 1) {

      var randomPosX: number =
        Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number =
        Math.round(math.randomRangeInt(-240, 241) / 30) * 30;

      if (!this.checkSpawn(randomPosX, randomPosY)) {

        const newParent = find("Canvas/Voids");
        let prefab = null;

        prefab = instantiate(this.void);

        newParent.addChild(prefab);
        prefab.setPosition(randomPosX, randomPosY);

      }
    }
  }

  private spawnCoin(): void {

    while (find("Canvas/Coins").children.length < 2) {

      var randomPosX: number =
        Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number =
        Math.round(math.randomRangeInt(-240, 241) / 30) * 30;

      if (!this.checkSpawn(randomPosX, randomPosY)) {


        const newParent = find("Canvas/Coins");
        let prefab = null;

        prefab = instantiate(this.coin);

        newParent.addChild(prefab);
        prefab.setPosition(randomPosX, randomPosY);

      }
    }
  }


  private spawnBall(): void {

    while (this.spawnedArray.length < 3) {

      var randomPosX: number =
        Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number =
        Math.round(math.randomRangeInt(-240, 241) / 30) * 30;

      if (!this.checkSpawn(randomPosX, randomPosY)) {

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

  private checkSpawn(randomPosX: number, randomPosY: number): boolean {

    if (
      this.posChecker(randomPosX, randomPosY, find("Canvas/Snake").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Coins").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Voids").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Balls").children)
    ) {
      return true
    }

    return false;
  }

  private posChecker(posX: number, posY: number, target: Array<Node>): boolean {
    return target.filter((child: Node) => {
      return (
        Math.round(child.position.x) == posX &&
        Math.round(child.position.y) == posY
      );
    }).length > 0;
  }
}
