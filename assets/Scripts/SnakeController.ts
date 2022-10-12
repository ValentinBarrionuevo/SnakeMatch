import {
  _decorator,
  Component,
  RigidBody2D,
  KeyCode,
  input,
  EventKeyboard,
  Input,
  find,
  Prefab,
  instantiate,
  Sprite,
  Vec3,
  SpriteFrame,
  Vec2,
} from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

@ccclass("SnakeController")
export class SnakeController extends Component {
  public character: RigidBody2D = null;

  @property(SpriteFrame)
  private spriteArray: Array<SpriteFrame> = new Array<SpriteFrame>(4);

  @property(Prefab)
  bodyPrefab: Prefab;

  private firstMove: boolean = true;
  private velocitySeconds: number = 0.8;
  private direction: Direction;
  private isGoingVertical: boolean;

  private tileSize = 30;

  private keyWhiteList: Array<KeyCode> = new Array(
    KeyCode.KEY_W,
    KeyCode.ARROW_UP,
    KeyCode.KEY_S,
    KeyCode.ARROW_DOWN,
    KeyCode.KEY_A,
    KeyCode.ARROW_LEFT,
    KeyCode.KEY_D,
    KeyCode.ARROW_RIGHT
  );

  public onLoad(): void {
    find("Canvas/button").active = false;

    this.character = this.node.getComponent(RigidBody2D);

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  public onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    find("Canvas/button").active = true;
  }

  private onKeyDown(event: EventKeyboard): void {
    if (this.isGoingVertical == false || this.isGoingVertical == undefined) {
      switch (event.keyCode) {
        case KeyCode.KEY_W:
        case KeyCode.ARROW_UP:
          this.direction = "UP";
          this.isGoingVertical = true;
          break;
        case KeyCode.KEY_S:
        case KeyCode.ARROW_DOWN:
          this.direction = "DOWN";
          this.isGoingVertical = true;
          break;
      }
    }
    if (this.isGoingVertical == true || this.isGoingVertical == undefined) {
      switch (event.keyCode) {
        case KeyCode.KEY_A:
        case KeyCode.ARROW_LEFT:
          this.direction = "LEFT";
          this.isGoingVertical = false;
          break;
        case KeyCode.KEY_D:
        case KeyCode.ARROW_RIGHT:
          this.direction = "RIGHT";
          this.isGoingVertical = false;
          break;
      }
    }
    if (this.firstMove == true && this.keyWhiteList.includes(event.keyCode)) {
      this.firstMove = false;
      this.schedule(() => {
        this.snakeMovement();
      }, this.velocitySeconds);
    }
  }

  private snakeMovement(): void {
    const pos = this.node.getPosition();
    switch (this.direction) {
      case "UP":
        pos.y += this.tileSize;
        this.node.angle = 0;
        break;
      case "DOWN":
        pos.y -= this.tileSize;
        this.node.angle = 180;
        break;
      case "LEFT":
        pos.x -= this.tileSize;
        this.node.angle = 90;
        break;
      case "RIGHT":
        pos.x += this.tileSize;
        this.node.angle = 270;
        break;
    }
    this.node.setPosition(pos);

    for (let i = 0; i < find("Canvas/Snake").children.length - 1; i++) {
      const prev = find("Canvas/Snake").children[i];
      const prevPos: Vec3 = prev.getPosition();
      const next = find("Canvas/Snake").children[i + 1];
      let nextPos: Vec3 = next.getPosition();

      console.log("prevPos", prevPos, "nextPos", nextPos);

      const diffX = nextPos.x - prevPos.x;
      const diffY = nextPos.y - prevPos.y;

      // Preguntarle a milton/cesar/ema
      nextPos.x += diffX * -1;
      nextPos.y += diffY * -1;

      console.log("diffX", diffX, "diffY", diffY);

      // if (diffY > 0) {
      //   nextPos.y = prevPos.y + this.tileSize;
      //   next.angle = 0;
      // } else if (diffY < 0) {
      //   nextPos.y = prevPos.y - this.tileSize;
      //   next.angle = 180;
      // }
      // if (diffX > 0) {
      //   nextPos.x = prevPos.x + this.tileSize;
      //   next.angle = 90;
      // } else if (diffX < 0) {
      //   nextPos.x = prevPos.x - this.tileSize;
      //   next.angle = 270;
      // }

      nextPos = new Vec3(Math.round(nextPos.x), Math.round(nextPos.y), 0);
      console.log("nextPos", nextPos);
      next.setPosition(nextPos)
    }
    find("Canvas").getComponent(GameManager).checkGameState();
  }

  public eatBall(ball: number): void {
    const prefab = instantiate(this.bodyPrefab);
    find("Canvas/Snake").addChild(prefab);

    const newBody =
      find("Canvas/Snake").children[find("Canvas/Snake").children.length - 1];
    newBody.getComponent(Sprite).spriteFrame = this.spriteArray[ball];
    let pos = find("Canvas/Snake/Head").getPosition();
    pos = new Vec3(Math.round(pos.x), Math.round(pos.y), 0);

    newBody.setPosition(pos);
    console.log(newBody.position);
  }
}
