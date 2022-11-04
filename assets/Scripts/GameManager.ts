import {
  _decorator,
  Component,
  instantiate,
  Prefab,
  math,
  Vec2,
  Label,
  Node,
  SpriteFrame,
  Sprite,
  AudioSource,
  AudioClip,
} from "cc";
import { GlobalVariables } from "./GlobalVariables";
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

  @property(AudioClip)
  private coinSound: AudioClip;

  @property(Node)
  private snakeHead: Node;

  @property(Node)
  private voidsNode: Node;

  @property(Node)
  private coinsNode: Node;

  @property(Node)
  private ballsNode: Node;

  @property(Node)
  private bombsNode: Node;

  @property(Node)
  private rndmBallsNode: Node;

  @property(Node)
  private pointsNode: Node;

  @property(Node)
  private multiplierNode: Node;

  @property(Node)
  private snakeNode: Node;

  @property(Node)
  private UICoins: Node;

  private snake: Prefab = null;

  private movementCount: number;
  private voidSpawnNeeded: number = 75;

  private matchCount: number;
  private maxMatch: number;
  private voidDestroyNeeded: number = 2;

  private spawnedArray: Array<number> = [];

  public destroyed: boolean = false;

  public points: number = 0;
  public multiplier: number = 1;
  private coins: number = 0;

  private justAte: boolean = false;
  private audioSource: AudioSource = null;

  onLoad() {
    this.audioSource = this.getComponent(AudioSource);
  }

  start() {
    if (GlobalVariables.saveData.disabledAds == false) {
      this.node.children[7].children[4].active = true;
    }

    this.spawnByType(this.ball);
    this.spawnByType(this.ball);
    this.spawnByType(this.ball);
    this.spawnByType(this.coin);
    this.spawnByType(this.rndmBall);
  }

  public checkGameState(): void {
    let snakePos = new Vec2(
      Math.round(this.snakeHead.getPosition().x),
      Math.round(this.snakeHead.getPosition().y)
    );

    this.checkCol(snakePos, this.ball);
    this.checkCol(snakePos, this.coin);
    this.checkCol(snakePos, this.void);
    this.checkCol(snakePos, this.bomb);
    this.checkCol(snakePos, this.rndmBall);
    this.checkCol(snakePos, this.snake);

    this.movementCount =
      this.snakeHead.getComponent(SnakeController).movementCount;
    this.matchCount =
      this.snakeHead.getComponent(SnakeController).matchCount;

    if (
      this.matchCount / this.voidDestroyNeeded == 1 &&
      this.matchCount != this.maxMatch
    ) {
      this.maxMatch = this.matchCount;
      this.voidDestroy();
    }
    if (this.movementCount % this.voidSpawnNeeded == 0) {
      this.spawnByType(this.void);
    }
    if (this.justAte == true) {
      this.justAte = false;
    }
    while (this.spawnedArray.length < 3) {
      this.spawnByType(this.ball);
    }

    this.pointsNode.getComponent(Label).string =
      this.points.toString();
    this.multiplierNode.getComponent(Label).string =
      "x" + this.multiplier.toString();
  }

  private voidDestroy(): void {
    const voids = this.voidsNode.children;
    if (voids.length < 1) {
      return;
    }
    const rndNum = Math.round((voids.length - 1) * Math.random());
    voids[rndNum].destroy();
  }

  private checkCol(snakePos: Vec2, type: Prefab) {
    let parent = null;
    let array = null;

    switch (type) {
      case this.ball:
        parent = this.ballsNode;
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          let index = this.ballsNode.children.indexOf(array[0]);
          this.snakeHead
            .getComponent(SnakeController)
            .eatBall(this.spawnedArray[index]);
          this.spawnedArray.splice(index, 1);
          array[0].destroy();

          this.points += 100 * this.multiplier;
          this.pointsNode.getComponent(Label).string =
            this.points.toString();

          this.justAte = true;

          while (this.spawnedArray.length < 3) {
            this.spawnByType(this.ball);
          }

          const prob = math.randomRange(0, 1);
          if (prob >= 0 && prob <= 0.25) {
            if (this.bombsNode.children.length < 1) {
              this.spawnByType(this.bomb);
            }
          }
          if (prob >= 0.26 && prob <= 0.5) {
            if (this.rndmBallsNode.children.length < 1) {
              this.spawnByType(this.rndmBall);
            }
          }
          if (prob >= 0.51 && prob <= 0.9) {
            this.spawnByType(this.coin);
          }
        }
        break;
      case this.coin:
        parent = this.coinsNode;
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          this.audioSource.playOneShot(this.coinSound);
          this.points += 500 * this.multiplier;
          this.coins += 1;
          this.UICoins.getComponent(Label).string =
            "x" + this.coins.toString();
          this.pointsNode.getComponent(Label).string =
            this.points.toString();
        }
        break;
      case this.void:
        parent = this.voidsNode;
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          this.snakeNode.getComponent(SnakeController).death();
        }
        break;
      case this.snake:
        if (!this.justAte) {
          parent = this.snakeNode;
          array = this.check(parent, snakePos);
          if (array.length > 1) {
            this.snakeHead.getComponent(SnakeController).death();
          }
        }
        break;
      case this.bomb:
        parent = this.bombsNode;
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          this.snakeHead.getComponent(SnakeController).eatBomb();
        }
        break;
      case this.rndmBall:
        parent = this.rndmBallsNode;
        array = this.check(parent, snakePos);
        if (array.length > 0) {
          array[0].destroy();
          this.spawnedArray.splice(0);
          this.ballsNode.destroyAllChildren();

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
          newParent = this.ballsNode;
          break;
        case this.void:
          newParent = this.voidsNode;
          break;
        case this.coin:
          newParent = this.coinsNode;
          break;
        case this.bomb:
          newParent = this.bombsNode;
          break;
        case this.rndmBall:
          newParent = this.rndmBallsNode;
          break;
      }

      const node = this.spawn(type, newParent, pos);

      if (type == this.bomb) {
        this.scheduleOnce(() => {
          if (this.bombsNode.children[0] != null) {
            this.bombsNode.children[0].destroy();
          }
        }, 10);
      }

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
      this.posChecker(randomPosX, randomPosY, this.snakeNode.children) ||
      this.posChecker(randomPosX, randomPosY, this.coinsNode.children) ||
      this.posChecker(randomPosX, randomPosY, this.voidsNode.children) ||
      this.posChecker(randomPosX, randomPosY, this.ballsNode.children)
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
