import { _decorator, Component, Node, input, Input, director, EventTouch, find, Sprite, SpriteFrame, Vec2, AudioSource, assert } from "cc";
const { ccclass, property } = _decorator;

@ccclass("UIController")
export class UIController extends Component {

    private audioSource: AudioSource = null!;

    private quit: Node;
    private restart: Node;
    private pauseButton: Node;
    private pause: Node;
    private back: Node;

    onLoad() {

        if (this.node.name == "Pause") {

            this.pauseButton = find("Canvas/UI/PauseButton")
            this.pause = find("Canvas/UI/Pause")
            this.back = find("Canvas/background")
            this.quit = find("Canvas/UI/Pause/Quit")
            this.restart = find("Canvas/UI/Pause/Restart")
            this.pauseButton.on(Input.EventType.TOUCH_END, this.touchStart, this);
            this.back.on(Input.EventType.TOUCH_END, this.touchStart, this);
        } else {
            this.quit = find("Canvas/UI/Death/Quit")
            this.restart = find("Canvas/UI/Death/Restart")
        }

        this.quit.on(Input.EventType.TOUCH_END, this.touchStart, this);
        this.restart.on(Input.EventType.TOUCH_END, this.touchStart, this);


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
                director.loadScene("GameScene");
                break;
            case "background":
                if (this.pause.active) {
                    this.pause.active = false;
                }
                break;
        }
    }

    private muteAll() {
        this.audioSource.enabled = !this.audioSource.enabled;
    }

}