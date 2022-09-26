import {
  _decorator,
  Component,
  RigidBody2D,
  Vec2,
  KeyCode,
  input,
  EventKeyboard,
  Input,
} from "cc";
const { ccclass } = _decorator;

type Balls = "green" | "blue" | "red" | "yellow";

@ccclass("SnakeController")
export class SnakeController extends Component {
  private character: RigidBody2D = null;

  private firstMove: boolean = true;

  private velocity: number = 5;

  private snakeInside: Array<Balls> = [];

  public onLoad(): void {
    this.character = this.node.getComponent(RigidBody2D);

    this.character.linearVelocity = new Vec2(0, 0);

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  public onDestroy(): void {
    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
  }

  private onKeyDown(event: EventKeyboard): void {
    if (this.character.linearVelocity.x != 0 || this.firstMove) {
      switch (event.keyCode) {
        case KeyCode.KEY_W:
        case KeyCode.ARROW_UP:
          this.character.linearVelocity = new Vec2(0, this.velocity);
          this.tileMove();
          break;
        case KeyCode.KEY_S:
        case KeyCode.ARROW_DOWN:
          this.character.linearVelocity = new Vec2(0, -this.velocity);
          this.tileMove();
          break;
      }
    } else if (this.character.linearVelocity.y != 0 || this.firstMove) {
      switch (event.keyCode) {
        case KeyCode.KEY_A:
        case KeyCode.ARROW_LEFT:
          this.tileMove();
          this.character.linearVelocity = new Vec2(-this.velocity, 0);
          break;
        case KeyCode.KEY_D:
        case KeyCode.ARROW_RIGHT:
          this.character.linearVelocity = new Vec2(this.velocity, 0);
          this.tileMove();
          break;
      }
    }
  }

  private tileMove(): void {
    this.firstMove = false;
    this.node.setPosition(
      Math.round(this.node.position.x / 30) * 30,
      Math.round(this.node.position.y / 30) * 30
    );
  }

  private eatBall(ball: Balls): void {}
}
