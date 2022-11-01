import { _decorator, Component, Node, input, Input, director, EventTouch, find, Sprite, SpriteFrame, Vec2, AudioSource, assert } from "cc";
import { SnakeController } from "./SnakeController";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {

    @property(SpriteFrame)
    private muteArray: Array<SpriteFrame> = new Array<SpriteFrame>(2);

    private audioSource: AudioSource = null!;

    private quit: Node;
    private quitDeath: Node;

    private restart: Node;
    private restartDeath: Node;

    private pauseButton: Node;
    private pause: Node;
    private continue: Node;

    private ad: Node;
    private snake: Node;

    private mute: Node;



    onLoad() {

        

        this.pauseButton = find("Canvas/UI/PauseButton")
        this.pause = find("Canvas/UI/Pause")
        this.continue = find("Canvas/UI/Pause/Continue")
        this.quit = find("Canvas/UI/Pause/Quit")
        this.restart = find("Canvas/UI/Pause/Restart")
        this.ad = find("Canvas/UI/Death/watchAd")
        this.snake = find("Canvas/Snake/Head")
        this.mute = find("Canvas/UI/Pause/Mute")


        this.pauseButton.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.continue.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.quit.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.restart.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.ad.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.mute.on(Input.EventType.TOUCH_END, this.touchStart, this);




        this.quitDeath = find("Canvas/UI/Death/Quit")
        this.restartDeath = find("Canvas/UI/Death/Restart")

        this.quitDeath.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.restartDeath.on(Input.EventType.TOUCH_END, this.touchStart, this);


        const audioSource = this.getComponent(AudioSource)!;
        assert(audioSource);
        this.audioSource = audioSource;
    }


    public touchStart(e: EventTouch): void {
        console.log(e.target.name)

        switch (e.target.name) {
            case "PauseButton":
                console.log("asd")
                this.pause.active = true;
                break;
            case "Quit":
                director.loadScene("MainMenu");
                break;
            case "Restart":
                this.scheduleOnce(() => {
                    director.loadScene("GameScene");
                }, 0.1);
                break;
            case "Continue":
                if (this.pause.active) {
                    this.pause.active = false;
                }
                break;
            case "watchAd":

                this.ad.parent.parent.children[5].active = true;
                this.ad.active = false;
                this.ad.parent.active = false;
                this.scheduleOnce(() => {

                    this.ad.parent.parent.children[5].active = false;
                    this.snake.getComponent(SnakeController).restartAD();
                }, 5);
                break;
            case "Mute":
                this.muteAll();
                if (e.target.getComponent(Sprite).spriteFrame == this.muteArray[0]) {
                    e.target.getComponent(Sprite).spriteFrame = this.muteArray[1];
                } else {
                    e.target.getComponent(Sprite).spriteFrame = this.muteArray[0];
                }
                break;
        }
    }

    private muteAll() {

        //this.audioSource.enabled = !this.audioSource.enabled;
    }

}