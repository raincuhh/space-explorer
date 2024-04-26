/**
 * sin selection
 * this is where you will pick your sin boss, each sin corresponds to a different finale boss,
 * for the beta ig only the first will be made
 *
 * order from easiest to hardest
 * sloth > gluttony > lust > greed > envy > pride > wrath
 *
 * boss name gonna be like "the sin of ..., prefix+suffix", in the turnbased part
 */
let SinSelection = {
  name: "SinSelection",
  chosenSin: "",
  confessButton: null,

  init: function () {
    this.render();
  },
  launch: function () {
    this.setDocumentTitle();
    PM.ping("confess your sins");
  },
  render: function () {
    this.createView();
    this.createHeader();
    this.createSins();
    this.createButtons();
  },
  createView: function () {
    let view = createEl("div");
    view.setAttribute("id", "sinSelectionView");
    const parent = getID("view");
    parent.appendChild(view);

    let elem = createEl("div");
    elem.setAttribute("class", "wrapper");
    view.appendChild(elem);
  },
  createHeader: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");

    let header = createEl("header");
    header.setAttribute("class", "header");
    parent.appendChild(header);

    let headerTitle = createEl("div");
    headerTitle.setAttribute("class", "title");
    headerTitle.textContent = "confess your sin";
    header.appendChild(headerTitle);

    let seperator = createEl("div");
    seperator.setAttribute("class", "seperator");
    parent.appendChild(seperator);
  },
  createSins: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");

    let sinsWrapper = createEl("div");
    sinsWrapper.setAttribute("id", "sinsWrapper");
    parent.appendChild(sinsWrapper);

    this.unlockSin("sloth");
    this.unlockSin("gluttony");
    /*
    this.unlockSin("lust");
    this.unlockSin("greed");
    this.unlockSin("envy");
    */
    this.updateUnlockedSins();
  },
  createButtons: function () {
    const parent = getQuerySelector("#sinSelectionView .wrapper");
    let buttonsWrapper = createEl("div");
    buttonsWrapper.setAttribute("id", "buttonsWrapper");
    parent.appendChild(buttonsWrapper);

    this.confessButton = new Button.custom({
      id: "confessButton",
      text: "continue.",
      click: this.confess.bind(this),
      disabled: true,
      width: "100%",
    });

    buttonsWrapper.appendChild(this.confessButton.element);
    this.confessButton.updateListener();
  },
  confess: function () {
    let name = this.chosenSin.trim();
    SM.set("run.activeSin", name);
    PM.ping("...");
    Main.changeModule(Region);
  },
  updateUnlockedSins: function () {
    let persistentStorageSin = SM.get("meta.sinsUnlocked");
    let sins = Object.entries(persistentStorageSin);
    //console.log(sins);
    for (const i of sins) {
      if (i[1] === true) {
        let sinName = i[0];
        let elem = createEl("div");
        elem.setAttribute("id", sinName);
        elem.setAttribute("class", "sin");
        elem.textContent = "The sin of " + sinName + ".";
        elem.addEventListener("click", () => {
          this.selectSin(sinName);
        });
        sinsWrapper.appendChild(elem);
      }
    }
  },
  selectSin: function (sin) {
    this.clearSelected();
    let sinText = getQuerySelector("#sinsWrapper #" + sin);
    sinText.style.textDecoration = "underline";
    Button.disabled(this.confessButton.element, false);
    this.confessButton.updateListener();
    this.chosenSin = sin;
    console.log(this.chosenSin);

    //SM.set("run.sin." + sin, true);
    // calc sin stuff later, gonna change enemy hp and stuff "slightly", as in like a 1.05x boost
    // increases incrementally with each sin, 1.05x > 1.1x > 1.15x > 1.2x > 1.25x > 1.3x > 1.35x
  },
  clearSelected: function () {
    let sinsWrapper = getID("sinsWrapper");
    let sins = sinsWrapper.querySelectorAll(".sin");
    sins.forEach((sin) => {
      sin.style.textDecoration = "none";
    });
  },
  unlockSin: function (sin) {
    if (SM.get("meta.sinsUnlocked." + sin)) {
      return;
    }
    SM.set("meta.sinsUnlocked." + sin, true);
  },

  getSinStatus: function (sin) {
    return SM.get("meta.sinsUnlocked." + sin);
  },
  setDocumentTitle: function () {
    document.title = "a sin?";
  },
};
