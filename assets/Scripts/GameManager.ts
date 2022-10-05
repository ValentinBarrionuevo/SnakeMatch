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

  private randomPosX: number = 0;
  private randomPosY: number = 0;
  private spawned: number = 0;

  start() {
    let collider = find("Canvas/Snake").getComponent(BoxCollider2D);
    collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
    this.spawnBall();
    PhysicsSystem2D.instance?.on(
      Contact2DType.BEGIN_CONTACT,
      this.onBeginContact,
      this
    );
  }

  // TODO Checkear si se fue, si esta sobre si misma o si esta sobre una pelota 
  public checkGameState(): void {
    console.log("checking");
  }

  private onBeginContact(
    firstCollider: BoxCollider2D,
    otherCollider: BoxCollider2D,
    contact: IPhysics2DContact | null
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
    for (var i = 0; i < 3; i++) {
      var randomBall = 1;

      this.randomPosX = Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      this.randomPosY = Math.round(math.randomRangeInt(-300, 301) / 30) * 30;

      const newParent = find("Canvas/Balls");
      console.log(newParent);
      let prefab = null;
      let ballType = null;

      // TODO Sacar switch reemplazando con un array y randomizando el index
      // Example:
      // let rndmIndex = Math.random(todos los numeros)
      // this.ballsArray[rndmIndex]
      switch (randomBall) {
        case 1:
          ballType = this.redPrefab;
          console.log("red");
          break;
        case 2:
          ballType = this.bluePrefab;
          console.log("blue");
          break;
        case 3:
          ballType = this.yellowPrefab;
          console.log("yellow");
          break;
        case 4:
          ballType = this.pinkPrefab;
          console.log("pink");
          break;
      }
      prefab = instantiate(ballType);
      this.spawned++;
      newParent.addChild(prefab);
      prefab.setPosition(this.randomPosX, this.randomPosY);
    }
  }
}
