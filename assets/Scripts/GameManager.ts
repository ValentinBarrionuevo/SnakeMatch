import {
  _decorator,
  Component,
  Node,
  BoxCollider2D,
  Contact2DType,
  IPhysics2DContact,
  PhysicsSystem2D,
  find,
  debug,
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

  private ballsPosition: Array<math.Vec2> = [];
  private ballsArray: Array<Prefab> = []
  private spawned: number = 0;
  private full: boolean = false;

  start() {
    let collider = find("Canvas/Snake").getComponent(BoxCollider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.spawnBall();
    PhysicsSystem2D.instance?.on(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );

    this.ballsArray = new Array<Prefab>(this.redPrefab, this.yellowPrefab, this.bluePrefab, this.pinkPrefab);
  }

  // TODO Checkear si se fue, si esta sobre si misma o si esta sobre una pelota 
  public checkGameState(): void {

    var snakePos = new Vec2(
      Math.round(find("Canvas/Snake").getPosition().x),
      Math.round(find("Canvas/Snake").getPosition().y));
    console.log(snakePos, "snakepos")
    console.log(this.ballsPosition)

    console.log(this.ballsPosition.includes(snakePos))

    if (this.ballsPosition.includes(snakePos)) {
      console.log("tocado")

    }

    console.log("checking");
  }



  private onBeginContact(
    firstCollider: BoxCollider2D,
    otherCollider: BoxCollider2D,
    _contact: IPhysics2DContact | null
  ) {
    switch (otherCollider.tag) {
      case 2:
        this.scheduleOnce(() => {
          firstCollider.node.destroy();
        });
        break;
      case 3:
      case 4:
      case 5:
      case 6:
        this.scheduleOnce(() => {
          var prefab = instantiate(this.redPrefab);
          find("Canvas").addChild(prefab);
          find("Canvas/Snake").getComponent(SnakeController).eatBall(prefab);
          otherCollider.node.destroy();
        });
        this.spawned--;
        if (this.spawned == 0) {
          this.spawnBall();
        }
        break;
    }
  }

  private spawnBall(): void {

    console.log("enterSpawn");

    if (!this.full) {
      this.full = true
      this.ballsArray.push(this.redPrefab);
      this.ballsArray.push(this.bluePrefab);
      this.ballsArray.push(this.yellowPrefab);
      this.ballsArray.push(this.pinkPrefab);
    }

    for (var i = 0; i < 3; i++) {

      var randomPosX: number = Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      var randomPosY: number = Math.round(math.randomRangeInt(-300, 301) / 30) * 30;
      const pos = new Vec2(randomPosX, randomPosY)
      this.ballsPosition.push(pos)

      const newParent = find("Canvas/Balls");
      console.log(newParent);

      let prefab = null;

      let rndmIndex = math.randomRangeInt(0, 4);
      prefab = instantiate(this.ballsArray[rndmIndex]);

      newParent.addChild(prefab);
      prefab.setPosition(randomPosX, randomPosY);

      this.spawned++;

      console.log(this.ballsPosition);
      // TODO Sacar switch reemplazando con un array y randomizando el index
      // Example:
      // let rndmIndex = Math.random(todos los numeros)
      // this.ballsArray[rndmIndex]
      //switch (randomBall) {
      //  case 1:
      //    ballType = this.redPrefab;
      //    console.log("red");
      //    break;
      //  case 2:
      //    ballType = this.bluePrefab;
      //    console.log("blue");
      //    break;
      //  case 3:
      //    ballType = this.yellowPrefab;
      //    console.log("yellow");
      //    break;
      //  case 4:
      //    ballType = this.pinkPrefab;
      //    console.log("pink");
      //    break;
      //}
      //prefab = instantiate(ballType);
    }
  }
}
