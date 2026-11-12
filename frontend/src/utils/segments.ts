export function segmentIds(name: string, id: string) {
  return {
    tabId: `${name}-${id}-tab`,
    panelId: `${name}-${id}-panel`,
  }
}
