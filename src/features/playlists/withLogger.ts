export function withLogger<S, A extends { type: string }>(
  reducer: (state: S, action: A) => S
): (state: S, action: A) => S {
  return (prevState: S, action: A): S => {
    const nextState = reducer(prevState, action);
    if (import.meta.env.DEV) {
      console.log(`[Playlist Action]: ${action.type}`);
      console.log('Previous State:', prevState);
      console.log('Next State:', nextState);
    }
    return nextState;
  };
}
