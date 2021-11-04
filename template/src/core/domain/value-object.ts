import equal from 'fast-deep-equal/es6/react';

export abstract class ValueObject<S> {
  constructor(private state: S) {}

  protected getState() {
    return this.state;
  }

  protected setState(state: Partial<S>) {
    this.state = { ...this.state, ...state };

    return this;
  }

  serialize(): string {
    return JSON.stringify(this.getState());
  }

  equals(e: ValueObject<S>) {
    return equal(this.state, e.state);
  }
}
