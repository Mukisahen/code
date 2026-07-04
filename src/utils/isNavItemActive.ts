export function isNavItemActive(route: string, pathname: string, hash: string): boolean {
  const [path, itemHash] = route.split('#')
  if (itemHash) return pathname === path && hash === `#${itemHash}`
  return pathname === path && hash === ''
}
