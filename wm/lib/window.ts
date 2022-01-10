import Section from './section.js';
import Container, { ContainerConstructor, Coord } from './container';

export default class Window extends Container {
  mapped?: Boolean;

  constructor(opts: ContainerConstructor = {}) {
    super(opts);
    this.isWin = true;
  }

  append(c: Container, i: number) {
    throw new Error('windows may not have children');
  }

  appendTo(c: Section, i?: number) {
    super.append(c, i);
  }

  remove(c: Container) {
    throw new Error('windows may not have children');
  }

  static getAll(): Array<Window> {
    return Container.getByType(this);
  }

  static getByCoords(c: Coord): Window {
    const { x, y } = c;
    const all = this.getAll().filter(w => {
      const geo = w.geo;
      return w.workspace.active
        && x >= geo.x
        && x <= (geo.x + geo.w)
        && y >= geo.y
        && y <= (geo.y + geo.h);
    });
    return all.find(w => w.fullscreen) || all[0];
  }
}
