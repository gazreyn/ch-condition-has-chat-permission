module.exports = class extends window.casthub.card.condition {

    /**
     * Called once when the Condition is booted on App
     * launch or when installed for the first time.
     *
     * @return {Promise}
     */
    async mounted() {
        //

        await super.mounted();
    }

    /**
     * @return {Promise}
     */
    async prepareProps() {
        return {
            broadcaster: {
                type: 'toggle',
                required: true,
                default: true,
                label: 'Is the Broadcaster',
                help: 'Checks to see if the chat command was from the broadcaster',
            },
            mod: {
                type: 'toggle',
                required: true,
                default: false,
                label: 'Is a Moderator',
                help: 'Checks to see if the chat command was from a moderator',
            },
            subscriber: {
                type: 'toggle',
                required: true,
                default: false,
                label: 'Is a Subscriber',
                help: 'Checks to see if the chat command was from a subscriber',
            },
        };
    }

    /**
     * Called when a Trigger has executed and needs Conditions
     * to pass or fail.
     *
     * @param {Object} input The output, if any, from the Trigger.
     *
     * @return {Promise}
     */
    async run(input) {

        const { mod, subscriber, badges: { broadcaster} } = input.subject.meta;
        const userPermissions = { mod, subscriber, broadcaster }

        const permissionsToCheck = this.filter(this.props, prop => prop);
        const permissionsToCheckArray = Object.keys(permissionsToCheck);   


        // Check through all checked permissions. If the user has any of them, condition should pass. If not, then we throw error below.
        for (let i = 0; i < permissionsToCheckArray.length; i++) {
            const permission = permissionsToCheckArray[i];
            if(userPermissions[permission]) return; // User has the permission, we can Promise.resolve() or return here
        }

        throw new Error("User doesn't have permission");

    }

    /**
     * Function to filter an object like it was an array
     *
     * @param {Object} obj The object to be filtered.
     * @param {Function} predicate The value to check is truthy.
     *
     * @return {Promise}
     */
    filter(obj, predicate) {
        return Object.keys(obj)
            .filter(key => predicate(obj[key]))
            .reduce((res, key) => (res[key] = obj[key], res), {})
    }

};
