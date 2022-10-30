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
  Label,
  Node,
  SpriteFrame,
  Sprite,
} from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("GameManager")
export class GameManager extends Component {
  @property(SpriteFrame)
  private sprites: Array<SpriteFrame> = new Array<SpriteFrame>(4);

  @property(Prefab)
  private void: Prefab;

  @property(Prefab)
  private coin: Prefab;

  @property(Prefab)
  private ball: Prefab;

  @property(Prefab)
  private bomb: Prefab;

  @property(Prefab)
  private rndmBall: Prefab;

  private snake: Prefab = null;
  
  private movementCount: number;
  private movementsNeededVoid: number = 50;

  private spawnedArray: Array<number> = [];

  public destroyed: boolean = false;

  public points: number = 0;
  public multiplier: number = 1;
  private coins: number = 0;

  private justAte: boolean = false;

  onLoad() {}
  start() {
    this.spawnByType(this.ball);
    this.spawnByType(this.ball);
    this.spawnByType(this.ball);
    this.spawnByType(this.coin);
    this.spawnByType(this.rndmBall);
  }

  public checkGameState(): void {
    let snakePos = new Vec2(
      Math.round(find("Canvas/Snake/Head").getPosition().x),
      Math.round(find("Canvas/Snake/Head").getPosition().y)
    );

    this.checkCol(snakePos, this.ball);
    this.checkCol(snakePos, this.coin);
    this.checkCol(snakePos, this.void);
    this.checkCol(snakePos, this.bomb);
    this.checkCol(snakePos, this.rndmBall);
    this.checkCol(snakePos, this.snake);

    this.movementCount =
      find("Canvas/Snake/Head").getComponent(SnakeController).movementCount;

    if (this.movementCount % this.movementsNeededVoid == 0) {
      this.spawnByType(this.void);
    }
    if (this.justAte == true) {
      this.justAte = false;
    }
    while (this.spawnedArray.length < 3) {
      this.spawnByType(this.ball);
    }
  }

  private checkCol(snakePos: Vec2, type: Prefab) {
    let parent = null;
    let array = null;

    switch (type) {
      case this.ball:
        parent = find("Canvas/Balls");
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          let index = find("Canvas/Balls").children.indexOf(array[0]);
          find("Canvas/Snake/Head")
            .getComponent(SnakeController)
            .eatBall(this.spawnedArray[index]);
          this.spawnedArray.splice(index, 1);
          array[0].destroy();

          this.points += 100 * this.multiplier;
          find("Canvas/UI/Points").getComponent(Label).string =
            this.points.toString();

          this.justAte = true;

          while (this.spawnedArray.length < 3) {
            this.spawnByType(this.ball);
          }
          while (find("Canvas/Coins").children.length < 2) {
            this.spawnByType(this.coin);
          }

          const prob = math.randomRangeInt(0, 11);
          if (prob >= 1 && prob <= 3) {
            this.spawnByType(this.bomb);
          }
        }
        break;
      case this.coin:
        parent = find("Canvas/Coins");
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          this.points += 500 * this.multiplier;
          this.coins += 1;
          find("Canvas/UI/Coins").getComponent(Label).string =
            "x" + this.coins.toString();
          find("Canvas/UI/Points").getComponent(Label).string =
            this.points.toString();
        }
        break;
      case this.void:
        parent = find("Canvas/Voids");
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          find("Canvas/Snake").destroy();
        }
        break;
      case this.snake:
        if (!this.justAte) {
          parent = find("Canvas/Snake");
          array = this.check(parent, snakePos);
          if (array.length > 1) {
            find("Canvas/Snake").destroy();
          }
        }
        break;
      case this.bomb:
        parent = find("Canvas/Bombs");
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          find("Canvas/Snake/Head").getComponent(SnakeController).eatBomb();
        }
        break;
      case this.rndmBall:
        parent = find("Canvas/Random");
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          this.spawnedArray.splice(0);
          find("Canvas/Balls").destroyAllChildren();

          this.spawnByType(this.ball);
          this.spawnByType(this.ball);
          this.spawnByType(this.ball);
        }
    }
  }

  private check(parent: Node, snakePos: Vec2): Array<Node> {
    return parent.children.filter((child) => {
      return (
        Math.round(child.position.x) == snakePos.x &&
        Math.round(child.position.y) == snakePos.y
      );
    });
  }

  private generateRandomPos(): Vec2 {
    return new Vec2(
      Math.round(math.randomRangeInt(-150, 151) / 30) * 30,
      Math.round(math.randomRangeInt(-240, 241) / 30) * 30
    );
  }

  private spawnByType(type: Prefab): void {
    let pos: Vec2 = this.generateRandomPos();

    if (!this.checkSpawn(pos.x, pos.y)) {
      let newParent = null;

      switch (type) {
        case this.ball:
          newParent = find("Canvas/Balls");
          break;
        case this.void:
          newParent = find("Canvas/Voids");
          break;
        case this.coin:
          newParent = find("Canvas/Coins");
          break;
        case this.bomb:
          newParent = find("Canvas/Bombs");
          break;
        case this.rndmBall:
          newParent = find("Canvas/Random");
          break;
      }

      const node = this.spawn(type, newParent, pos);

      if (type == this.ball) {
        let rndmIndex = math.randomRangeInt(0, 4);
        node.getComponent(Sprite).spriteFrame = this.sprites[rndmIndex];
        this.spawnedArray.push(rndmIndex);
      }
    }
  }

  private spawn(type: Prefab, parent: Node, pos: Vec2): Node {
    let prefab = null;
    prefab = instantiate(type);
    parent.addChild(prefab);
    prefab.setPosition(pos.x, pos.y);
    return prefab;
  }

  private checkSpawn(randomPosX: number, randomPosY: number): boolean {
    if (
      this.posChecker(randomPosX, randomPosY, find("Canvas/Snake").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Coins").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Voids").children) ||
      this.posChecker(randomPosX, randomPosY, find("Canvas/Balls").children)
    ) {
      return true;
    }
    return false;
  }

  private posChecker(posX: number, posY: number, target: Array<Node>): boolean {
    return (
      target.filter((child: Node) => {
        return (
          Math.round(child.position.x) == posX &&
          Math.round(child.position.y) == posY
        );
      }).length > 0
    );
  }
}
