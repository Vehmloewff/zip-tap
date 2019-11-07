let planning = 0;

export const planned = () => planning;
export const plan = () => planning++;
export const unPlan = () => (planning = 0);

let otherCalls = 0;

export const plannedCalls = () => otherCalls;
export const planCall = () => otherCalls++;
export const unPlanCalls = () => (otherCalls = 0);

let otherCalled = 0;

export const calls = () => otherCalled;
export const call = () => otherCalled++;
export const undoCalls = () => (otherCalled = 0);
