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

@ccclass("SnakeController")
export class SnakeController extends Component {

  public character: RigidBody2D = null;

  private firstMove: boolean = true;

  private velocity: number = 5;

  private snakeInside: Array<Node> = [];

  @property(Prefab)
  bodyPrefab: Prefab;


  //private balls: Array<Balls> = new Array<Balls>("red", "blue", "yellow", "pink");


  public onLoad(): void {
    find("Canvas/button").active = false;

    this.character = this.node.getComponent(RigidBody2D);

    this.character.linearVelocity = new Vec2(0, 0);

    input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

  }

  public onDestroy(): void {

    input.off(Input.EventType.KEY_DOWN, this.onKeyDown, this);
    find("Canvas/button").active = true;

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

  public update(dt: number): void {

  }



  private tileMove(): void {
    this.firstMove = false;
    this.node.setPosition(
      Math.round(this.node.position.x / 30) * 30,
      Math.round(this.node.position.y / 30) * 30
    );
    console.log(this.node.position);
  }


  public eatBall(_ballTag: number): void {

    var prefab = instantiate(this.bodyPrefab);

    // da el error aca abajo, cualquier operacion a la variable prefab
    // probe moviendo al game manager y lo mismo
    // game manager, incluso cambiando el body prefab por redPrefab, tiraba el mismo error
    // a pesar de que la generacion de las bolas funciona bien

    //prefab.parent = find("Canvas/Snake");
    //prefab.setPosition(30, 30);

    //this.snakeInside.push(prefab);

  }



}
