class FSM {
    /**
     * Creates new FSM instance.
     * @param config
     */

    constructor(config) {
        if (!config) throw new Error;

        else
        {
            Object.assign(this, JSON.parse(JSON.stringify(config)));

            this.reset();
        }
    }

    /**
     * Returns active state.
     * @returns {String}
     */
    getState() {
        return this.current;
    }

    /**
     * Goes to specified state.
     * @param state
     */
    changeState(state, undo = false) {
        if (state in this.states)
        {
            if (!undo) 
            {
                if (this.redo_levels[this.redo_levels.length - 1]) this.redo_levels = [];

                this.undo_levels.push(this.current);
            }

            this.current = state;
        }
        else
            throw new Error;
    }

    /**
     * Changes state according to event transition rules.
     * @param event
     */
    trigger(event) {
        this.changeState(this.states[this.getState()].transitions[event]);
    }

    /**
     * Resets FSM state to initial.
     */
    reset() {
        this.undo_levels = [];
        this.redo_levels = [];
        this.current = null;

        this.changeState(this.initial);
    }

    /**
     * Returns an array of states for which there are specified event transition rules.
     * Returns all states if argument is undefined.
     * @param event
     * @returns {Array}
     */
    getStates(event = null) {
        if (!event) return Object.keys(this.states);
        else
        {
            let toReturn = [], state;

            for (state in this.states)
            {
                if (event in this.states[state].transitions)
                    toReturn.push(state);
            }

            return toReturn;
        }
    }

    /**
     * Goes back to previous state.
     * Returns false if undo is not available.
     * @returns {Boolean}
     */
    undo() {
        if (!this.undo_levels[this.undo_levels.length - 1]) return false;

        this.redo_levels.push(this.getState());

        let undo_action = this.undo_levels.pop();

        this.changeState(undo_action, true);

        return true;
    }

    /**
     * Goes redo to state.
     * Returns false if redo is not available.
     * @returns {Boolean}
     */
    redo() {
        if (!this.redo_levels[this.redo_levels.length - 1]) return false;

        let redo_action = this.redo_levels.pop();

        this.changeState(redo_action, true);

        return true;
    }

    /**
     * Clears transition history
     */
    clearHistory() {
        this.undo_levels = [];
    }
}

module.exports = FSM;

/** @Created by Uladzimir Halushka **/