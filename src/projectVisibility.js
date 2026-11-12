// Keep disabled projects and their assets available for later reactivation.
export const disabledProjectIds = new Set(['project-04']);

export const isProjectEnabled = (id) => !disabledProjectIds.has(id);
