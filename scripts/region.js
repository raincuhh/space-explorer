const Region = {
  name: "Region",
  currentNode: null,
  currentMap: null,
  currentName: null,
  currentParty: [],
  currentState: null,
  states: {
    beforeJourney: "beforeJourney",
    exploring: "exploring",
    inEvent: "inEvent",
    partyDead: "partyDead",
  },

  currentRegionPool: [],
  timeUntilDim: 3000,
  timeUntilCandleSeen: 4500,
  timeUntilCharactersSeen: 1500,
  //btns
  lookAroundButton: null,
  lightCandleButton: null,
  exploreButton: null,

  init: function () {
    this.render();
    EM.init();

    if (!SM.get("run.activeSin")) {
      SM.set("run.activeSin", "sloth");
    }
    // checking if no active region map, if so then generates one
    RegionGen.init();
    if (!SM.get("run.currentMap")) {
      console.log("no active region, making one");
      let region = RegionGen.newReg();
      SM.set("run.currentMap", region.map);
      SM.set("run.currentName", region.name);
      this.currentMap = region.map;
      this.currentName = region.name;
    }
    this.currentName = this.formatRegionName(SM.get("run.currentName"));
    this.currentMap = SM.get("run.currentMap");
    console.log("map:", this.currentMap);

    // checking characters, if none then makes them.
    let persistentStorageChars = SM.get("char.characters");
    if (persistentStorageChars) {
      let chars = Object.entries(persistentStorageChars);
      chars.forEach((char) => {
        this.currentParty.push(char);
      });
    }
    if (!persistentStorageChars || this.currentParty.length === 0) {
      this.choosePathfinders();
      this.createPathfinders();
    }
    console.log("party:", this.currentParty);

    /*
    console.log(
      "enemyType on abyss, test:",
      RegionEnemies.theAbyss[Math.floor(0)].name
    );
    */

    // before exploring > exploring > in event > ...
    SM.set(
      "run.activeState",
      SM.get("run.activeState") === undefined
        ? this.states.beforeJourney
        : SM.get("run.activeState")
    );
    SM.set(
      "features.caravan.state",
      SM.get("features.caravan.state") === undefined
        ? this.caravanEnum.dark
        : SM.get("features.caravan.state")
    );

    this.updateButtons();

    if (
      SM.get("features.caravan.state") === this.caravanEnum.dim ||
      SM.get("features.caravan.state") === this.caravanEnum.bright
    ) {
      PM.ping("the candles are " + SM.get("features.caravan.state"));
    } else {
      PM.ping("the room is " + SM.get("features.caravan.state"));
    }
    let isInEvent = EM.isActiveEvent();
    console.log("is in a event:", isInEvent);

    if (isInEvent) {
      PM.ping(EM.activeEvent.inItPing);
    }
    //PM.ping("you find yourself in a caravan" + afterFirstDeath);
  },
  launch: function () {
    this.setDocumentTitle();
    if (SM.get("run.activeEvent") !== undefined) {
      EM.startEvent(SM.get("run.activeEvent"));
    }
    /*
    if (!SM.get("run.currentNode")) {
      SM.set("run.currentNode", this.currentMap.nodes[0]);
      this.currentNode = this.currentMap.nodes[0];
    }
    */
    this.currentNode = SM.get("run.currentNode");
    this.updateNodeView();
  },
  render: function () {
    this.createView();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view");
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  createButtons: function () {
    const parent = getQuerySelector("#regionView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    this.lookAroundButton = new Button.custom({
      id: "lookAroundButton",
      text: "look around.",
      click: Region.lookAround, //.bind(this)
      //width: "max-content",
    });
    buttonsWrapper.appendChild(this.lookAroundButton.element);

    this.lightCandleButton = new Button.custom({
      id: "lightCandleButton",
      text: "light candle.",
      click: Region.lightCandle,
    });
    buttonsWrapper.appendChild(this.lightCandleButton.element);

    this.exploreButton = new Button.custom({
      id: "exploreButton",
      text: "explore.",
      click: Region.explore, //.bind(this),
    });
    buttonsWrapper.appendChild(this.exploreButton.element);

    this.lookAroundButton.updateListener();
    this.lightCandleButton.updateListener();
    this.exploreButton.updateListener();

    this.updateButtons();
  },
  updateButtons: function () {
    let lookAroundButton = getID("lookAroundButton");
    let lightCandleButton = getID("lightCandleButton");
    let exploreButton = getID("exploreButton");

    if (SM.get("features.caravan.state") === this.caravanEnum.dark) {
      lookAroundButton.style.display = "block";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.dim) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "block";
      exploreButton.style.display = "none";
    }

    if (SM.get("features.caravan.state") === this.caravanEnum.bright) {
      lookAroundButton.style.display = "none";
      lightCandleButton.style.display = "none";
      exploreButton.style.display = "block";
    }
  },
  lookAround: function () {
    PM.ping("you find an old lighter.");
    setTimeout(() => {
      PM.ping("through the blinds, the moonlight reflects along the walls");
    }, Region.timeUntilDim);
    setTimeout(() => {
      PM.ping("you see a candle close to you");
      SM.set("features.caravan.state", Region.caravanEnum.dim);
      Region.updateButtons();
    }, Region.timeUntilCandleSeen);
  },
  lightCandle: function () {
    SM.set("features.caravan.state", Region.caravanEnum.bright);
    setTimeout(() => {
      PM.ping("the caravan is shaky, looking around, you see 3 strangers");
    }, Region.timeUntilCharactersSeen);
    Region.onCandleChange();
  },
  onCandleChange: function () {
    PM.ping("the caravan is " + SM.get("features.caravan.state"));
    this.updateButtons();
  },
  explore: function () {
    console.log("exploring");
  },
  setDocumentTitle: function () {
    document.title = this.currentName;
  },
  formatRegionName: function (name) {
    let words = name.match(/[A-Z]*[^A-Z]+/g);
    if (words) {
      for (let i = 0; i < words.length; i++) {
        words[i] = words[i].toLowerCase();
      }
    }
    let formattedName = words ? words.join(" ") : name;
    return formattedName;
  },

  updateNodeView: function () {
    if (this.currentNode === null) {
      return;
    }
    let node = this.currentNode;

    //console.log("currentNode:", node);
    //console.log(this.nodeArrivalMsg, this.nodeLeaveMsg, this.nodeInItMsg);
    let toBeLoaded;
    if (specialNodeTypesPool.some((e) => e.type === node.type)) {
      index = specialNodeTypesPool.findIndex((e) => e.type === node.type);
      toBeLoaded = specialNodeTypesPool[index];
      EM.startEvent(toBeLoaded);
    } else {
      index = NodeTypesPool.findIndex((e) => e.type === node.type);
      toBeLoaded = NodeTypesPool[index];
      EM.startEvent(toBeLoaded);
    }
    //console.log(this.nodeArrivalMsg, this.nodeLeaveMsg, this.nodeInItMsg);
    let nextPaths = this.getNextPaths();
    console.log("next paths:", nextPaths);
  },
  getNextPaths: function () {
    let nextPaths = this.currentMap.paths.filter(
      (path) => path.fromId === this.currentNode.id
    );
    return nextPaths;
  },
  moveToNextNode: function (nextNodeId) {
    this.currentNode = this.currentMap.nodes.find(
      (node) => node.id === nextNodeId
    );
    this.updateNodeView();
  },
  choosePathfinders: function () {
    let pathfinderList = PathfinderCharLib;
    let unseen = [];
    let seen = [];
    for (let i = 0; i < pathfinderList.length; i++) {
      let pathfinder = pathfinderList[i];
      unseen.push(pathfinder);
    }
    for (let i = 0; i < 4; i++) {
      let rng = Math.floor(Math.random() * unseen.length);
      let chosen = unseen.splice(rng, 1)[0];
      let pathfinder = chosen.name;
      seen.push(pathfinder);
      this.currentParty.push(pathfinder);
    }
    //console.log(this.currentParty);
  },
  createPathfinders: function () {
    for (const pathfinder of this.currentParty) {
      if (!SM.get("char.characters." + pathfinder)) {
        SM.set("char.characters." + pathfinder, {});
        PFM.createPathfinder(pathfinder);
      }
    }
  },
  enemyEnumTypes: function () {
    let enemyTypes = {
      ice: "ice",
      dark: "dark",
      test: "test",
    };
    return enemyTypes;
  },
  caravanEnum: {
    dark: "dark",
    dim: "dim",
    bright: "bright",
  },
};
