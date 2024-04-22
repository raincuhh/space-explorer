const Region = {
  name: "Region",

  currentNode: null,
  currentMap: null,
  currentName: null,
  currentParty: [],
  // btns
  exploreButton: null,
  init: function () {
    this.render();

    if (!SM.get("run.activeSin")) {
      SM.set("run.activeSin", "sloth");
    }

    // checking if there is no active region currently, if so then generates one
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
  },
  launch: function () {
    this.setDocumentTitle();
    this.startExploration();
  },
  render: function () {
    this.createView();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "regionView");
    const parent = getID("view"); // the parent that all "views" will get appended to
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

    this.exploreButton = new Button.custom({
      id: "exploreButton",
      text: "explore",
      click: this.explore.bind(this),
    });
    buttonsWrapper.appendChild(this.exploreButton.element);
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
  explore: function () {
    console.log("exploring new");
  },
  startExploration: function () {
    if (!SM.get("run.currentNode")) {
      SM.set("run.currentNode", this.currentMap.nodes[0]);
      this.currentNode = this.currentMap.nodes[0];
    }
    this.currentNode = SM.get("run.currentNode");
    this.updateNodeView();
  },
  updateNodeView: function () {
    let node = this.currentNode;
    //console.log("currentNode:", node);
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
    let nextPaths = this.getNextPaths();
    //console.log(nextPaths);
  },
  getNextPaths: function () {
    let nextPaths = this.currentMap.paths.filter(
      (path) => path.fromId === this.currentNode.id
    );
    return nextPaths;
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
};
