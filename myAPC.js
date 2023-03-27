class MyAPC {
    constructor() {
        this.popup = {
            background: {
                el: document.createElement("div"),
                classes: ["box-background"],
            },
            container: {
                el: document.createElement("div"),
                classes: ["box"],
            },
            message: {
                el: document.createElement("div"),
                classes: ["popup-message"]
            },
            buttonsContainer: {
                el: document.createElement("div"),
                classes: [],
            },
            confirmButton: {
                el: document.createElement("button"),
                classes: ["btn", "green"],
                text: "Confirm"
            },
            cancelButton: {
                el: document.createElement("button"),
                classes: ["btn", "red"],
                text: "Cancel"
            },
            prompt: {
                el: document.createElement("input"),
                classes: [],
                attributes: {
                    type: "text"
                }
            },
        }
    }

    mergePopupStructure(popup){
        if(popup){
            let components = Object.keys(popup);

            components.forEach((key) => {
                if (this.popup[key]) {
                    this.popup[key] = popup[key];
                }
            });
        }   
    }

    setClasses() {
        let components = Object.keys(this.popup);
        components.forEach((key) => {
            if (this.popup[key].classes && this.popup[key].classes.length) {
                this.popup[key].classes.forEach(item => this.popup[key].el.classList.add(item));
            }
        });
    }

    setAttributes() {
        let components = Object.keys(this.popup);
        components.forEach((key) => {
            if (this.popup[key].attributes) {
                let attributes = Object.keys(this.popup[key].attributes);

                if (attributes) {
                    attributes.forEach((attribute) => {
                        this.popup[key].el.setAttribute(attribute, this.popup[key].attributes[attribute]);
                    });
                }
            }
        });
    }

    async show(message) {
        let result = null;

        this.popup.message.el.innerHTML = message;

        await this.build().then(response => {
            result = response;
        });

        return Promise.resolve(result);
    }

    destroy() {
        this.popup.confirmButton.el.innerHTML = "";
        this.popup.cancelButton.el.innerHTML = "";

        while (this.popup.buttonsContainer.el.firstChild) {
            this.popup.buttonsContainer.el.removeChild(this.popup.buttonsContainer.el.firstChild);
        }
        while (this.popup.background.el.firstChild) {
            this.popup.background.el.removeChild(this.popup.background.el.firstChild);
        }

        document.body.removeChild(this.popup.background.el);
    }

    build(){};
}

class Prompt extends MyAPC{
    constructor(popup = null){
        super();

        this.mergePopupStructure(popup);

        this.setClasses();
        this.setAttributes();
    }

    build(){
        this.popup.confirmButton.el.innerHTML = this.popup.confirmButton.text;
        this.popup.cancelButton.el.innerHTML = this.popup.cancelButton.text;

        this.popup.buttonsContainer.el.appendChild(this.popup.confirmButton.el);
        this.popup.buttonsContainer.el.appendChild(this.popup.cancelButton.el);

        this.popup.container.el.appendChild(this.popup.message.el);
        this.popup.container.el.appendChild(this.popup.prompt.el);
        this.popup.container.el.appendChild(this.popup.buttonsContainer.el);

        this.popup.background.el.appendChild(this.popup.container.el);

        document.body.appendChild(this.popup.background.el);

        return new Promise((resolve, reject) => {
            this.popup.confirmButton.el.addEventListener("click", () => {
                resolve(this.popup.prompt.el.value);
                this.destroy();
            });
            this.popup.cancelButton.el.addEventListener("click", () => {
                resolve(false);
                this.destroy();
            });
        });
    }
}

class Confirm extends MyAPC{
    constructor(popup = null){
        super();

        this.mergePopupStructure(popup);
        
        this.setClasses();
        this.setAttributes();
    }

    build(){
        /* create buttons container */
        this.popup.confirmButton.el.innerHTML = this.popup.confirmButton.text;
        this.popup.cancelButton.el.innerHTML = this.popup.cancelButton.text;

        this.popup.buttonsContainer.el.appendChild(this.popup.confirmButton.el);
        this.popup.buttonsContainer.el.appendChild(this.popup.cancelButton.el);

        /* create popup */
        this.popup.container.el.appendChild(this.popup.message.el);
        this.popup.container.el.appendChild(this.popup.buttonsContainer.el);

        this.popup.background.el.appendChild(this.popup.container.el);

        document.body.appendChild(this.popup.background.el);

        return new Promise((resolve, reject) => {
            this.popup.confirmButton.el.addEventListener("click", () => {
                resolve(true);
                this.popup.destroy();
            });
            this.popup.cancelButton.el.addEventListener("click", () => {
                resolve(false);
                this.destroy();
            });
        });
    }
}

class Alert extends MyAPC{
    constructor(popup = null){
        super();

        this.mergePopupStructure(popup);
        
        this.setClasses();
        this.setAttributes();
    }

    build(){
        /* create buttons container */
        this.popup.confirmButton.el.innerHTML = this.popup.confirmButton.text;

        this.popup.buttonsContainer.el.appendChild(this.popup.confirmButton.el);

        /* create popup */
        this.popup.container.el.appendChild(this.popup.message.el);
        this.popup.container.el.appendChild(this.popup.buttonsContainer.el);

        this.popup.background.el.appendChild(this.popup.container.el);

        document.body.appendChild(this.popup.background.el);

        return new Promise((resolve, reject) => {
            this.popup.confirmButton.el.addEventListener("click", () => {
                resolve(true);
                this.destroy();
            });
        });
    }
}