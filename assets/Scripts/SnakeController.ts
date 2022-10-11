import {
  _decorator,
  Component,
  RigidBody2D,
  Vec2,
  KeyCode,
  input,
  EventKeyboard,
  Input,
  director,
  find,
  Prefab,
  instantiate,
  Scene,
  randomRange,
  physics,
  BoxCollider2D,
  Contact2DType,
  PhysicsSystem2D,
  IPhysics2DContact,
  Node,
  assetManager,
} from "cc";
import { GameManager } from "./GameManager";
const { ccclass, property } = _decorator;

//type Balls = "pink" | "blue" | "red" | "yellow";
type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT";

@ccclass("SnakeController")
export class SnakeController extends Component {
  public character: RigidBody2D = null;

  private firstMove: boolean = true;

  private velocitySeconds: number = 0.4;
  private direction: Direction;
  private isGoingVertical: boolean;
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

  private tileSize = 30;

  public snakeInside: Array<Node> = [];

  @property(Prefab)
  bodyPrefab: Prefab;

  //private balls: Array<Balls> = new Array<Balls>("red", "blue", "yellow", "pink");

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
      this.schedule(function () {
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
    find("Canvas").getComponent(GameManager).checkGameState();
  }

  public eatBall(ball: Node): void {
    this.snakeInside.push(ball);
    console.log(this.snakeInside);
  }
}
