import { _decorator, Component, Node, BoxCollider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D, find, debug } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    private destroyed: boolean = false;

    start() {
        let collider = find("Canvas/Snake").getComponent(BoxCollider2D);
        collider.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

        //PhysicsSystem2D.instance?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    }

    update(deltaTime: number) {

    }

    private onBeginContact(firstCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {

        if (firstCollider.tag == 1) {
            switch (otherCollider.tag) {
                case 2:

                    this.scheduleOnce(() => { firstCollider.node.destroy(); });

                    break;

            }
        }


    }
}

