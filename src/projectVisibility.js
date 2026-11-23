// Keep disabled projects and their assets available for later reactivation.
export const disabledProjectIds = new Set();

export const isProjectEnabled = (id) => !disabledProjectIds.has(id);
