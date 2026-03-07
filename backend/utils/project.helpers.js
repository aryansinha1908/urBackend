/**
 * Shared Project Helpers
 */

/**
 * Check if the project is configured to use external storage (Supabase BYOD)
 * @param {Object} project - The project object (lean or document)
 * @returns {Boolean}
 */
const isProjectStorageExternal = (project) => {
    return !!project.resources?.storage?.isExternal;
};

/**
 * Check if the project is configured to use an external database
 * @param {Object} project - The project object
 * @returns {Boolean}
 */
const isProjectDbExternal = (project) => {
    return !!project.resources?.db?.isExternal;
};

module.exports = {
    isProjectStorageExternal,
    isProjectDbExternal
};
