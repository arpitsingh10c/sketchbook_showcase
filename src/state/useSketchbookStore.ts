import { useReducer } from 'react';
import type { AppMode } from '../content/types';

interface SketchbookState {
  mode: AppMode;
  activeSlug: string | null;
  pageIndex: number;
  inputLocked: boolean;
}

type Action =
  | { type: 'BEGIN_OPENING'; slug: string }
  | { type: 'FINISH_OPENING' }
  | { type: 'BEGIN_CLOSING' }
  | { type: 'FINISH_CLOSING' }
  | { type: 'SET_PAGE'; pageIndex: number }
  | { type: 'TOGGLE_DETAILS' };

const initialState: SketchbookState = {
  mode: 'gallery',
  activeSlug: null,
  pageIndex: 0,
  inputLocked: false,
};

function reducer(state: SketchbookState, action: Action): SketchbookState {
  switch (action.type) {
    case 'BEGIN_OPENING':
      return state.inputLocked
        ? state
        : { mode: 'opening', activeSlug: action.slug, pageIndex: 0, inputLocked: true };
    case 'FINISH_OPENING':
      return { ...state, mode: 'reading', inputLocked: false };
    case 'BEGIN_CLOSING':
      return state.mode === 'gallery' || (state.inputLocked && state.mode !== 'opening')
        ? state
        : { ...state, mode: 'closing', inputLocked: true };
    case 'FINISH_CLOSING':
      return initialState;
    case 'SET_PAGE':
      return state.inputLocked
        ? state
        : { ...state, mode: 'reading', pageIndex: Math.max(0, action.pageIndex) };
    case 'TOGGLE_DETAILS':
      return state.inputLocked
        ? state
        : { ...state, mode: state.mode === 'showing-details' ? 'reading' : 'showing-details' };
  }
}

export function useSketchbookStore() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return {
    state,
    beginOpening: (slug: string) => dispatch({ type: 'BEGIN_OPENING', slug }),
    finishOpening: () => dispatch({ type: 'FINISH_OPENING' }),
    beginClosing: () => dispatch({ type: 'BEGIN_CLOSING' }),
    finishClosing: () => dispatch({ type: 'FINISH_CLOSING' }),
    setPage: (pageIndex: number) => dispatch({ type: 'SET_PAGE', pageIndex }),
    toggleDetails: () => dispatch({ type: 'TOGGLE_DETAILS' }),
  };
}
