import { DIRECTION } from "../actions";

export default function shiftFocusReducer (state, action) {
  const focusedKey = state.get("focused");
  const focusedObj = state.getIn(["objects", focusedKey]);
  let newFocusedKey;

  switch (action.payload.direction) {

    case DIRECTION.LEFT:
      
      if (focusedObj.get("type") == "Word") {
	const parentKey = focusedObj.get("parentId");
	const wordOrd = focusedObj.get("order");
	
	if (wordOrd == 0) {
	  newFocusedKey = parentKey;
	} else {
	  const focusedParent = state.getIn(["objects", parentKey]);
	  const previousWordKey = focusedParent.getIn(["words", wordOrd-1, "id"]);
	  newFocusedKey = previousWordKey;
	}

      } else if (focusedObj.get("type") == "Sentence") {
	const size = focusedObj.get("size");
	const lastWordKey = focusedObj.getIn(["words", size-1, "id"]);
	newFocusedKey = lastWordKey;
      }

      break;

    case DIRECTION.RIGHT:

      if (focusedObj.get("type") == "Word") {
	const parentKey = focusedObj.get("parentId");
	const focusedParent = state.getIn(["objects", parentKey]);
	const wordOrd = focusedObj.get("order");

	if (wordOrd+1 >= focusedParent.get("size")) {
	  newFocusedKey = parentKey;
	} else {
	  const newWordKey = focusedParent.getIn(["words", wordOrd+1, "id"]);
	  newFocusedKey = newWordKey;
	}
	
      } else if (focusedObj.get("type") == "Sentence") {
	const firstWordKey = focusedObj.getIn(["words", 0, "id"]);
	newFocusedKey = firstWordKey;
      }

      break;

    case DIRECTION.UP:
      if (focusedObj.get("type") == "Word") {
	const parentKey = focusedObj.get("parentId");
	newFocusedKey = parentKey;
      } else if (focusedObj.get("type") == "Sentence") {
	const sentenceOrd = focusedObj.get("order");
	if (sentenceOrd <= 0) {
	  const quiverLength = state.get("quiver").size;
	  const quiver = state.get("quiver");
	  const lastSentenceKey = quiver.get(quiverLength-1);
	  newFocusedKey = lastSentenceKey;
	} else {
	  const prevSentenceKey = state.getIn(["quiver", sentenceOrd-1]);
	  newFocusedKey = prevSentenceKey;
	}
      }

      break;

    case DIRECTION.DOWN:
      const quiver = state.get("quiver");


      if (focusedObj.get("type") == "Word") {
	const parentKey = focusedObj.get("parentId");
	const nextSentenceKey = quiver.get(quiver.indexOf(parentKey) + 1);

	const isLast = nextSentenceKey == undefined;

	// if the parent sentence is the last in the quiver, focus
	// on the parent. Otherwise, focus on the next sentence.
	newFocusedKey = isLast ? parentKey : nextSentenceKey;

      } else if (focusedObj.get("type") == "Sentence") {
	const focusedKey = focusedObj.get("id");
	const nextSentenceKey = quiver.get(quiver.indexOf(focusedKey) + 1);
	
	const isLast = nextSentenceKey == undefined;

	newFocusedKey = isLast ? quiver.get(0) : nextSentenceKey;
      }

      break;

    default:

      newFocusedKey = focusedKey;
  }

  return state.set("focused", newFocusedKey);
}
