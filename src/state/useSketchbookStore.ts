import { useReducer } from 'react';
import type { PageTurnDirection } from '../animation/pageAnimations';
import type { AppMode } from '../content/types';

interface SketchbookState {
  mode: AppMode;
  activeSlug: string | null;
  pageIndex: number;
  inputLocked: boolean;
  pageTurnDirection: PageTurnDirection | null;
  pendingPageIndex: number | null;
}

type Action =
  | { type: 'BEGIN_OPENING'; slug: string }
  | { type: 'FINISH_OPENING' }
  | { type: 'BEGIN_CLOSING' }
  | { type: 'FINISH_CLOSING' }
  | { type: 'BEGIN_PAGE_TURN'; direction: PageTurnDirection; pageIndex: number }
  | { type: 'FINISH_PAGE_TURN' }
  | { type: 'TOGGLE_DETAILS' };

const initialState: SketchbookState = {
  mode: 'gallery',
  activeSlug: null,
  pageIndex: 0,
  inputLocked: false,
  pageTurnDirection: null,
  pendingPageIndex: null,
};

function reducer(state: SketchbookState, action: Action): SketchbookState {
  switch (action.type) {
    case 'BEGIN_OPENING':
      return state.inputLocked
        ? state
        : {
          mode: 'opening',
          activeSlug: action.slug,
          pageIndex: 0,
          inputLocked: true,
          pageTurnDirection: null,
          pendingPageIndex: null,
        };
    case 'FINISH_OPENING':
      return { ...state, mode: 'reading', inputLocked: false };
    case 'BEGIN_CLOSING':
      return state.mode === 'gallery' || (state.inputLocked && state.mode !== 'opening')
        ? state
        : { ...state, mode: 'closing', inputLocked: true };
    case 'FINISH_CLOSING':
      return initialState;
    case 'BEGIN_PAGE_TURN':
      return state.inputLocked
        ? state
        : {
          ...state,
          mode: 'reading',
          inputLocked: true,
          pageTurnDirection: action.direction,
          pendingPageIndex: Math.max(0, action.pageIndex),
        };
    case 'FINISH_PAGE_TURN':
      return state.pendingPageIndex === null
        ? { ...state, inputLocked: false, pageTurnDirection: null }
        : {
          ...state,
          mode: 'reading',
          pageIndex: state.pendingPageIndex,
          inputLocked: false,
          pageTurnDirection: null,
          pendingPageIndex: null,
        };
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
    beginPageTurn: (direction: PageTurnDirection, pageIndex: number) => dispatch({
      type: 'BEGIN_PAGE_TURN',
      direction,
      pageIndex,
    }),
    finishPageTurn: () => dispatch({ type: 'FINISH_PAGE_TURN' }),
    toggleDetails: () => dispatch({ type: 'TOGGLE_DETAILS' }),
  };
}
