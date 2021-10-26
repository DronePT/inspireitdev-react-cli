interface EntityState<I> {
  id: I;
}

export abstract class Entity<I, S extends EntityState<I>> {
  constructor(private state: S) {}

  protected getState() {
    return this.state;
  }

  getId() {
    return this.state.id;
  }

  protected setState(state: Partial<S>) {
    this.state = { ...this.state, ...state };

    return this;
  }

  serialize(): string {
    return JSON.stringify(this.getState());
  }

  equals(e: Entity<I, S>) {
    return this.getId() === e.getId();
  }
}
