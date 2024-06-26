const ShrineOfAbyss = {
  tokens: null,

  init: function () {
    this.render();
    Main.changeLocationHeader("The Shrine");

    // setting default values and states of metaprogression

    if (!SM.get("meta.tokens")) {
      this.tokens = 0;
      SM.set("meta.tokens", this.tokens);
    }
    this.tokens = SM.get("meta.tokens");
    //console.log("tokens:", this.tokens);
    const tokenCurrencyPreview = getQuerySelector(
      "#shrineView #currencyPanel #tokenCurrencyPreview"
    );
    tokenCurrencyPreview.textContent = this.tokens + " tokens";

    this.updateCurrency();
  },

  updateCurrency: function () {
    const tokenCurrencyPreview = getQuerySelector(
      "#shrineView #currencyPanel #tokenCurrencyPreview"
    );
    tokenCurrencyPreview.textContent = this.tokens + " tokens";
  },

  render: function () {
    this.createView();
  },

  createView: function () {
    const parent = getID(EM.eventId);

    let header = createEl("div");
    header.setAttribute("id", "shrineHeader");
    parent.appendChild(header);

    let sections = [{ title: "Skills" }, { title: "Items" }];
    sections.forEach((section, index) => {
      let seperator = createEl("div");
      seperator.setAttribute("class", "seperator");
      seperator.textContent = "<";
      header.appendChild(seperator);

      section = createHeaderSection(section.title, index);
      header.appendChild(section);
    });

    function createHeaderSection(title, index) {
      let elem = createEl("div");
      elem.setAttribute("id", "shrineHeader" + title);
      elem.setAttribute("class", "shrineSectionHeader");
      elem.textContent = title.toLowerCase();
      elem.addEventListener("click", () => {
        ShrineOfAbyss.changePanel(index);
      });

      return elem;
    }

    let body = createEl("div");
    body.setAttribute("id", "shrineView");
    parent.appendChild(body);

    let currencyPanel = createEl("div");
    currencyPanel.setAttribute("id", "currencyPanel");
    body.appendChild(currencyPanel);

    let currencyPanelDesc = createEl("div");
    currencyPanelDesc.setAttribute("id", "currencyPanelDesc");
    currencyPanelDesc.textContent = "abyss shop";
    currencyPanel.appendChild(currencyPanelDesc);

    let tokenCurrencyPreview = createEl("div");
    tokenCurrencyPreview.setAttribute("id", "tokenCurrencyPreview");
    currencyPanel.appendChild(tokenCurrencyPreview);

    let itemsUnlockedPreview = createEl("div");
    itemsUnlockedPreview.setAttribute("id", "itemsUnlockedPreview");
    currencyPanel.appendChild(itemsUnlockedPreview);

    let itemsPanel = createEl("div");
    itemsPanel.setAttribute("id", "itemsPanel");
    itemsPanel.setAttribute("class", "shrinePanel");
    body.appendChild(itemsPanel);

    let demoWarning1 = createEl("div");
    demoWarning1.setAttribute("id", "sorryNothingHere");
    demoWarning1.textContent = "not added for demo";
    itemsPanel.appendChild(demoWarning1);

    let skillsPanel = createEl("div");
    skillsPanel.setAttribute("id", "skillsPanel");
    skillsPanel.setAttribute("class", "shrinePanel");
    body.appendChild(skillsPanel);

    let demoWarning2 = createEl("div");
    demoWarning2.setAttribute("id", "sorryNothingHere");
    demoWarning2.textContent = "not added for demo";
    skillsPanel.appendChild(demoWarning2);

    ShrineOfAbyss.hidePanel();
    this.changePanel(1);
  },

  changePanel: function (index) {
    // hiding panels, kinda hardcoded
    ShrineOfAbyss.hidePanel();
    //console.log("changing panel to:", index);
    const itemsPanel = getQuerySelector("#shrineView #itemsPanel");
    const skillsPanel = getQuerySelector("#shrineView #skillsPanel");
    if (index === 0) {
      skillsPanel.style.display = "flex";
    } else if (index === 1) {
      itemsPanel.style.display = "flex";
    } else {
      console.warn("index not defined");
    }
  },

  hidePanel: function () {
    const itemsPanel = getQuerySelector("#shrineView #itemsPanel");
    const skillsPanel = getQuerySelector("#shrineView #skillsPanel");
    itemsPanel.style.display = "none";
    skillsPanel.style.display = "none";
  },
};
