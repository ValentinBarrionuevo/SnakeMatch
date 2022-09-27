import { _decorator, Component, Node, BoxCollider2D, Contact2DType, IPhysics2DContact, PhysicsSystem2D, find, debug } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameManager')
export class GameManager extends Component {

    start() {

        PhysicsSystem2D.instance?.on(Contact2DType.BEGIN_CONTACT, this.onBeginContact, this);

    }

    update(deltaTime: number) {

    }

    private onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        console.log(selfCollider);
        if (selfCollider.node.name == "snake") {
            console.log(otherCollider.node.name);
            switch (otherCollider.node.name) {
                case "borderTop":
                case "borderBottom":
                case "borderLeft":
                case "borderRight":

                    selfCollider.node.destroy();
                    break;

            }
        }


    }
}

