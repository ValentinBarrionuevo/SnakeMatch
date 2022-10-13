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
    const oldPos = { x: pos.x, y: pos.y };

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

    for (let i = 1; i < find("Canvas/Snake").children.length; i++) {
      const aux = find("Canvas/Snake").children.length - i;
      const snekPart = find("Canvas/Snake").children[aux];
      const auxOldX = snekPart.position.x;
      const auxOldY = snekPart.position.y;

      snekPart.setPosition(oldPos.x, oldPos.y, 0);

      oldPos.x = auxOldX;
      oldPos.y = auxOldY;
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
