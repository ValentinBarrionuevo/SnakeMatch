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
    //PhysicsSystem2D.instance?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);
  }

  private onBeginContact(
    firstCollider: BoxCollider2D,
    otherCollider: BoxCollider2D,
    contact: IPhysics2DContact | null
  ) {
    if (firstCollider.tag == 1) {
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
  }

  private spawnBall(): void {
    console.log("enterSpawn");
    for (var i = 0; i < 3; i++) {
      var randomBall = 1;

      this.randomPosX = Math.round(math.randomRangeInt(-150, 151) / 30) * 30;
      this.randomPosY = Math.round(math.randomRangeInt(-300, 301) / 30) * 30;

      switch (randomBall) {
        case 1:
          var prefab = instantiate(this.redPrefab);
          console.log(prefab);
          prefab.parent = find("Canvas");
          prefab.setPosition(this.randomPosX, this.randomPosY);
          this.spawned++;
          console.log("red");
          break;
        case 2:
          var prefab = instantiate(this.bluePrefab);
          prefab.parent = find("Canvas");
          prefab.setPosition(this.randomPosX, this.randomPosY);
          this.spawned++;
          console.log("blue");
          break;
        case 3:
          var prefab = instantiate(this.yellowPrefab);
          prefab.parent = find("Canvas");
          prefab.setPosition(this.randomPosX, this.randomPosY);
          this.spawned++;
          console.log("yellow");
          break;
        case 4:
          var prefab = instantiate(this.pinkPrefab);
          prefab.parent = find("Canvas");
          prefab.setPosition(this.randomPosX, this.randomPosY);
          this.spawned++;
          console.log("pink");
          break;
      }
    }
  }
}
