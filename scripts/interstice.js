/**
 * not sure if i should name it purgatory or interstice, interstice for now
 */
const Interstice = {
  name: "Interstice",

  roomEnum: {
    lookAround: "lookAround",
    beforeTalk: "beforeTalk",
    talk: "talk",
    finishTalk: "finishTalk",
  },

  // btns
  lookAroundButton: null,
  openDoorButton: null,
  talkButton: null,

  //timers
  lookAroundTimer: 1000,
  walkToReceptionistTimer: 1000,

  init: function () {
    this.render();

    SM.set(
      "features.room.state",
      SM.get("features.room.state") === undefined
        ? this.roomEnum.lookAround
        : SM.get("features.room.state")
    );

    if (SM.get("features.room.state") === this.roomEnum.lookAround) {
      PM.ping("you find yourself in lobby");
    }
    //PM.ping("next to it, you see a door");
  },

  render: function () {
    this.createView();
    this.createButtons();
  },

  createView: function () {
    const parent = getID("view");
    let view = createEl("div");
    view.setAttribute("id", "intersticeView");
    parent.appendChild(view);

    let wrapper = createEl("div");
    wrapper.setAttribute("class", "wrapper");
    view.appendChild(wrapper);

    Main.changeLocationHeader("???");
  },

  createButtons: function () {
    const parent = getQuerySelector("#intersticeView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    this.lookAroundButton = new Button.custom({
      id: "lookAroundButton",
      text: "look around.",
      click: this.lookAround.bind(this),
    });
    buttonsWrapper.appendChild(this.lookAroundButton.element);

    this.openDoorButton = new Button.custom({
      id: "openDoorButton",
      text: "open door.",
      click: this.openDoor.bind(this),
    });
    buttonsWrapper.appendChild(this.openDoorButton.element);

    this.talkButton = new Button.custom({
      id: "talkButton",
      text: "talk.",
      click: this.talk.bind(this),
    });
    buttonsWrapper.appendChild(this.talkButton.element);
  },

  updateButtons: function () {
    let lookAroundButton = getQuerySelector(
      "#intersticeView .wrapper #buttonsWrapper #lookAroundButton"
    );
    let openDoorButton = getID("openDoorButton");
    let talkButton = getID("talkButton");
  },

  lookAround: function () {
    Button.disabled(Interstice.lookAroundButton.element, true);
    Interstice.lookAroundButton.updateListener();
    PM.ping(
      "Scanning your surroundings, you spot a flickering fireplace casting a soft glow."
    );
    //PM.ping("looking around, you see a fireplace burning softly");
    setTimeout(() => {
      PM.ping(
        "Gazing around the room, your eyes are drawn to an unassuming door in the distance."
      );
      SM.set("features.room.state", Interstice.roomEnum.beforeTalk);
      Button.disabled(Interstice.lookAroundButton.element, false);
      Interstice.lookAroundButton.updateListener();
      Interstice.updateButtons();
    }, Interstice.lookAroundTimer);
  },

  openDoor: function () {
    Button.disabled(Interstice.openDoorButton.element, true);
    Interstice.openDoorButton.updateListener();
    PM.ping(
      "as you push the door ajar, warm light spills into the room, revealing a welcoming space."
    );
    setTimeout(() => {
      PM.ping(
        "peeking through the door's gap, you discern a figure standing still amidst the shadows."
      );
    }, 1000);
    setTimeout(() => {
      PM.ping(
        "with a slight push, the door opens, revealing a man sitting behind a desk."
      );
      Button.disabled(Interstice.openDoorButton.element, false);
      Interstice.openDoorButton.updateListener();
      SM.set("features.room.state", Interstice.roomEnum.talk);
      Interstice.updateButtons();
    }, 1500);
  },

  talk: function () {
    Button.disabled(Interstice.talkButton.element, true);
    Interstice.talkButton.updateListener();
    PM.ping(
      "walking up to the man, he tells you this place is called the interstice"
    );
    SM.set("features.room.state", Interstice.roomEnum.finishTalk);
  },

  launch: function () {
    this.setDocumentTitle();
    Main.changeLocationHeader("the interstice");
  },

  setDocumentTitle: function () {
    document.title = "the interstice";
  },
};
