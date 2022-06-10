/* eslint-disable no-restricted-globals */
import { TinyliciousClient } from "@fluidframework/tinylicious-client";
import { SharedMap } from "fluid-framework";
const client = new TinyliciousClient();

const containerSchema = {
  initialObjects: { myMap: SharedMap },
};

export const todoKey = "todo-key";
export const inputKey = "input-key";

export const getMyMap = async () => {
  let container;
  const containerId = location.hash.substring(1);
  if (!containerId) {
    ({ container } = await client.createContainer(containerSchema));
    container.initialObjects.myMap.set(todoKey, []);
    container.initialObjects.myMap.set(inputKey, "");
    const id = await container.attach();
    location.hash = id;
  } else {
    ({ container } = await client.getContainer(containerId, containerSchema));
  }
  return container.initialObjects.myMap;
};
